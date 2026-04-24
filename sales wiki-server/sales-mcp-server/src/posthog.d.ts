// Augments Cloudflare.Env with secrets and bindings not captured by wrangler types

// RateLimit binding — provided by Cloudflare Workers runtime
interface RateLimit {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

declare namespace Cloudflare {
  interface Env {
    POSTHOG_API_KEY: string;
    MCP_RATE_LIMITER: RateLimit;
    // workers-oauth-provider — KV storage for tokens and grants
    OAUTH_KV: KVNamespace;
    // Injected by OAuthProvider into handlers — methods to parse/complete auth
    OAUTH_PROVIDER: import("@cloudflare/workers-oauth-provider").OAuthHelpers;
    // Google OAuth secrets — set via: wrangler secret put GOOGLE_CLIENT_ID
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
  }
}
