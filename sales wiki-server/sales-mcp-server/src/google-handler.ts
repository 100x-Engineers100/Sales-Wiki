import type { AuthRequest, OAuthHelpers } from "@cloudflare/workers-oauth-provider";

// ── Google OAuth handler ──────────────────────────────────────────────────────
// Handles /authorize (redirect to Google) and /callback (exchange code, issue
// MCP token). All other routes return a simple info page.
//
// Flow:
//  1. MCP client hits /authorize with standard OAuth params
//  2. We encode those params as the Google `state` and redirect to Google login
//  3. Google redirects to /callback with code + state
//  4. We exchange code for Google access_token, fetch user profile
//  5. We call env.OAUTH_PROVIDER.completeAuthorization() — this issues the MCP
//     access token and stores user claims (sub, email, name) as props
//  6. Redirect back to MCP client. All subsequent tool calls have this.props.

type HandlerEnv = Env & {
  OAUTH_PROVIDER: OAuthHelpers;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
};

const CALLBACK_PATH = "/callback";

function callbackUri(request: Request): string {
  return new URL(CALLBACK_PATH, request.url).href;
}

export const GoogleHandler = {
  async fetch(request: Request, env: HandlerEnv): Promise<Response> {
    const url = new URL(request.url);

    // ── /authorize — start the Google login flow ──────────────────────────────
    if (url.pathname === "/authorize") {
      let oauthReqInfo;
      try {
        oauthReqInfo = await env.OAUTH_PROVIDER.parseAuthRequest(request);
      } catch (err) {
        // parseAuthRequest throws for unregistered or invalid clients
        return new Response(`OAuth error: ${err instanceof Error ? err.message : String(err)}`, { status: 400 });
      }
      if (!oauthReqInfo.clientId) {
        return new Response("Invalid OAuth request — missing client_id", { status: 400 });
      }

      // Encode the full MCP OAuth request as Google's state param.
      // We read it back in /callback to call completeAuthorization().
      const state = btoa(JSON.stringify(oauthReqInfo));

      const params = new URLSearchParams({
        client_id: env.GOOGLE_CLIENT_ID,
        redirect_uri: callbackUri(request),
        response_type: "code",
        scope: "openid email profile",
        state,
        prompt: "select_account",
      });

      return Response.redirect(
        `https://accounts.google.com/o/oauth2/v2/auth?${params}`,
        302
      );
    }

    // ── /callback — Google redirects here after login ─────────────────────────
    if (url.pathname === CALLBACK_PATH) {
      const code = url.searchParams.get("code");
      const stateParam = url.searchParams.get("state");
      const error = url.searchParams.get("error");

      if (error) {
        return new Response(`Google auth error: ${error}`, { status: 400 });
      }
      if (!code || !stateParam) {
        return new Response("Missing code or state from Google", { status: 400 });
      }

      // Restore the original MCP OAuth request from state
      let oauthReqInfo: AuthRequest;
      try {
        oauthReqInfo = JSON.parse(atob(stateParam)) as AuthRequest;
      } catch {
        return new Response("Invalid state parameter", { status: 400 });
      }

      // Exchange Google authorization code for an access token
      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: env.GOOGLE_CLIENT_ID,
          client_secret: env.GOOGLE_CLIENT_SECRET,
          redirect_uri: callbackUri(request),
          grant_type: "authorization_code",
        }),
      });

      if (!tokenRes.ok) {
        console.error("Google token exchange failed:", await tokenRes.text());
        return new Response("Failed to authenticate with Google", { status: 502 });
      }

      const { access_token } = await tokenRes.json() as { access_token: string };

      // Fetch the user's Google profile
      const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      if (!userRes.ok) {
        return new Response("Failed to fetch Google profile", { status: 502 });
      }

      const user = await userRes.json() as {
        id: string;
        email: string;
        name: string;
        picture?: string;
      };

      // Issue MCP access token. The `props` object becomes this.props in McpAgent
      // for every tool call made with this token — stable identity across sessions.
      const { redirectTo } = await env.OAUTH_PROVIDER.completeAuthorization({
        request: oauthReqInfo,
        userId: user.id,
        scope: oauthReqInfo.scope,
        props: {
          claims: {
            sub: user.id,
            email: user.email,
            name: user.name,
            picture: user.picture ?? "",
          },
        },
        metadata: { label: user.email },
      });

      return Response.redirect(redirectTo, 302);
    }

    // ── / — health / info ─────────────────────────────────────────────────────
    return new Response(
      JSON.stringify({
        name: "Sales Wiki MCP",
        status: "ok",
        auth: "Google OAuth 2.0",
        mcp_endpoint: "/mcp",
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  },
};
