import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  registerAppTool,
  registerAppResource,
  RESOURCE_MIME_TYPE,
} from "@modelcontextprotocol/ext-apps/server";
import { z } from "zod";
import OAuthProvider from "@cloudflare/workers-oauth-provider";
import { GoogleHandler } from "./google-handler";

// ── Auth context ───────────────────────────────────────────────────────────────
type SalesProps = {
  claims: {
    sub: string;
    email: string;
    name: string;
    picture: string;
  };
};

// ── Security: prompt injection sanitization ───────────────────────────────────
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+instructions/gi,
  /<\s*\/?(?:SYSTEM|INST|SYS|HUMAN|ASSISTANT)\s*>/gi,
  /\[SYSTEM\]/gi,
  /###\s*SYSTEM/gi,
  /you are now\s+/gi,
  /act as\s+(a\s+)?(?:DAN|jailbreak|unrestricted)/gi,
];

function sanitizeOutput(text: string): string {
  let safe = text;
  for (const pattern of INJECTION_PATTERNS) {
    safe = safe.replace(pattern, "[removed]");
  }
  return `--- BEGIN WIKI DATA ---\n${safe}\n--- END WIKI DATA ---`;
}

function extractTitle(md: string): string | null {
  const m = md.match(/^---[\s\S]*?^title:\s*["']?(.+?)["']?\s*$/m);
  return m ? m[1] : null;
}

// Fetch multiple KV pages in parallel, bundle into one string
async function fetchPages(kv: KVNamespace, keys: string[]): Promise<string> {
  const results = await Promise.all(
    keys.map(async (key) => {
      const content = await kv.get(key);
      if (!content) return null;
      const title = extractTitle(content) ?? key;
      return `### ${title}\n\n${content}`;
    })
  );
  // explicit type guard — filter(Boolean) doesn't narrow in strict mode
  return results.filter((r): r is string => r !== null).join("\n\n---\n\n");
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function detectDiagramType(s: string): string {
  const f = s.trim().toLowerCase();
  if (f.startsWith("flowchart") || f.startsWith("graph")) return "Flowchart";
  if (f.startsWith("sequencediagram")) return "Sequence";
  if (f.startsWith("classdiagram")) return "Class Diagram";
  if (f.startsWith("erdiagram")) return "ER Diagram";
  if (f.startsWith("gantt")) return "Gantt";
  if (f.startsWith("mindmap")) return "Mind Map";
  if (f.startsWith("timeline")) return "Timeline";
  if (f.startsWith("statediagram")) return "State Diagram";
  if (f.startsWith("pie")) return "Pie Chart";
  if (f.startsWith("xychart")) return "XY Chart";
  return "Diagram";
}

function buildVisualizerHTML(syntax: string, title: string): string {
  const safeTitle = escapeHtml(title);
  const diagramType = detectDiagramType(syntax);
  const syntaxJson = JSON.stringify(syntax);
  const titleJson = JSON.stringify(title);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${safeTitle}</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
:root{
  --bg:#0D0D0D;--surface:#161616;--surface2:#1E1E1E;
  --primary:#F96846;--primary-h:#FF7A5C;--primary-dim:rgba(249,104,70,0.14);
  --text:#F2F2F2;--muted:#777;--border:#282828;
  --font:"Space Grotesk",system-ui,sans-serif;
}
html,body{width:100%;height:100%;min-height:480px;background:var(--bg);color:var(--text);font-family:var(--font);overflow:hidden;}
#app{display:flex;flex-direction:column;height:100%;min-height:480px;}
header{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;
  background:var(--surface);border-bottom:1px solid var(--border);flex-shrink:0;gap:8px;}
.hl{display:flex;align-items:center;gap:8px;min-width:0;flex:1;}
.logo{width:24px;height:24px;background:var(--primary);border-radius:6px;display:flex;
  align-items:center;justify-content:center;flex-shrink:0;}
.logo svg{width:13px;height:13px;fill:#fff;}
.htitle{font-size:12px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.badge{font-size:9px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;
  color:var(--primary);background:var(--primary-dim);border:1px solid rgba(249,104,70,.3);
  padding:2px 7px;border-radius:20px;flex-shrink:0;}
.hr{display:flex;gap:5px;flex-shrink:0;}
#wrap{flex:1;position:relative;overflow:hidden;background:var(--bg);
  background-image:radial-gradient(circle,#1E1E1E 1px,transparent 1px);background-size:20px 20px;
  cursor:grab;}
#wrap.dragging{cursor:grabbing;}
#canvas{position:absolute;top:50%;left:50%;transform-origin:0 0;
  display:flex;align-items:center;justify-content:center;}
.mermaid{display:block;}
.mermaid svg{display:block;max-width:none;}
#err{display:none;position:absolute;inset:0;flex-direction:column;align-items:center;
  justify-content:center;gap:10px;color:var(--muted);font-size:13px;text-align:center;padding:32px;}
#err .eicon{font-size:26px;}
#zctrl{position:absolute;bottom:12px;right:12px;display:flex;align-items:center;gap:2px;
  background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:3px;}
.zbtn{width:26px;height:26px;background:transparent;border:none;border-radius:5px;
  color:var(--muted);font-size:15px;cursor:pointer;display:flex;align-items:center;
  justify-content:center;transition:all .12s;line-height:1;}
.zbtn:hover{background:var(--surface2);color:var(--text);}
.zbtn:active{background:var(--primary-dim);color:var(--primary);}
#zlvl{font-size:10px;font-weight:600;color:var(--muted);min-width:36px;text-align:center;font-family:var(--font);}
.panel{display:none;position:absolute;inset:0;background:var(--bg);z-index:60;flex-direction:column;padding:14px;overflow:auto;}
.panel.open{display:flex;}
.panel-hd{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-shrink:0;}
.panel-title{font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.6px;}
#syn-code{font-family:"Courier New",monospace;font-size:11px;color:var(--text);line-height:1.65;
  background:var(--surface);padding:14px;border-radius:8px;border:1px solid var(--border);
  white-space:pre-wrap;word-break:break-all;flex:1;overflow:auto;}
.exc-steps{display:flex;flex-direction:column;gap:10px;margin-top:4px;}
.exc-step{display:flex;gap:10px;align-items:flex-start;}
.step-num{width:22px;height:22px;background:var(--primary);border-radius:50%;
  display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;
  color:#fff;flex-shrink:0;margin-top:1px;}
.step-text{font-size:12px;line-height:1.6;color:var(--text);}
#copy-box{margin-top:12px;background:var(--surface);border:1px solid var(--border);
  border-radius:8px;padding:12px;position:relative;}
#copy-box textarea{width:100%;background:transparent;border:none;color:var(--muted);
  font-family:"Courier New",monospace;font-size:10px;line-height:1.5;resize:none;
  outline:none;height:80px;}
#copy-msg{position:absolute;top:8px;right:8px;font-size:10px;color:var(--primary);
  font-weight:600;opacity:0;transition:opacity .2s;}
#copy-msg.on{opacity:1;}
footer{display:flex;align-items:center;justify-content:space-between;padding:8px 14px;
  background:var(--surface);border-top:1px solid var(--border);flex-shrink:0;gap:8px;}
.btn-g{display:flex;gap:5px;}
.btn{height:28px;padding:0 12px;border-radius:7px;font-family:var(--font);font-size:11px;
  font-weight:500;cursor:pointer;transition:all .12s;display:flex;align-items:center;gap:5px;
  white-space:nowrap;border:none;}
.btn-o{background:transparent;border:1px solid var(--border);color:var(--muted);}
.btn-o:hover{border-color:var(--muted);color:var(--text);background:var(--surface2);}
.btn-p{background:var(--primary);color:#fff;font-weight:600;}
.btn-p:hover{background:var(--primary-h);}
#toast{position:fixed;bottom:52px;left:50%;transform:translateX(-50%) translateY(6px);
  background:var(--surface2);border:1px solid var(--border);color:var(--text);font-size:11px;
  padding:6px 13px;border-radius:8px;opacity:0;transition:opacity .18s,transform .18s;
  pointer-events:none;white-space:nowrap;z-index:200;}
#toast.on{opacity:1;transform:translateX(-50%) translateY(0);}
</style>
</head>
<body>
<div id="app">
<header>
  <div class="hl">
    <div class="logo"><svg viewBox="0 0 16 16"><path d="M2 3h12v2H2zM2 7h8v2H2zM2 11h10v2H2z"/></svg></div>
    <span class="htitle">${safeTitle}</span>
    <span class="badge">${escapeHtml(diagramType)}</span>
  </div>
  <div class="hr">
    <button class="btn btn-o" id="btn-syn">
      <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor"><path d="M5 3L1 8l4 5-1.4 1.1L-.6 8 3.6 1.9 5 3zm6 0l1.4-1.1L16.6 8l-4.2 6.1L11 13l4-5-4-5z"/></svg>
      Source
    </button>
  </div>
</header>
<div id="wrap">
  <div id="canvas"><div class="mermaid" id="mel"></div></div>
  <div id="err"><div class="eicon">⚠</div><div id="errmsg">Render error</div>
    <div style="font-size:11px;color:#444;margin-top:4px">Click Source to inspect Mermaid syntax</div>
  </div>
  <div id="zctrl">
    <button class="zbtn" id="z-out" title="Zoom out">−</button>
    <span id="zlvl">100%</span>
    <button class="zbtn" id="z-in" title="Zoom in">+</button>
    <button class="zbtn" id="z-rst" title="Reset view" style="font-size:11px;font-weight:700;">⟳</button>
  </div>
  <div class="panel" id="syn-panel">
    <div class="panel-hd">
      <span class="panel-title">Mermaid Source</span>
      <button class="btn btn-o" id="btn-syn-close" style="height:24px;padding:0 9px;font-size:10px;">✕ Close</button>
    </div>
    <pre id="syn-code"></pre>
  </div>
  <div class="panel" id="exc-panel">
    <div class="panel-hd">
      <span class="panel-title">Open in Excalidraw</span>
      <button class="btn btn-o" id="btn-exc-close" style="height:24px;padding:0 9px;font-size:10px;">✕ Close</button>
    </div>
    <div class="exc-steps">
      <div class="exc-step"><div class="step-num">1</div>
        <div class="step-text">Click <strong style="color:var(--primary)">Copy Syntax</strong> below</div></div>
      <div class="exc-step"><div class="step-num">2</div>
        <div class="step-text">Open <strong style="color:var(--primary)">excalidraw.com</strong></div></div>
      <div class="exc-step"><div class="step-num">3</div>
        <div class="step-text">Menu → Insert → Mermaid Diagram → paste → OK</div></div>
    </div>
    <div id="copy-box">
      <textarea id="syn-ta" readonly onclick="this.select()" spellcheck="false"></textarea>
      <span id="copy-msg">Copied!</span>
      <button class="btn btn-p" id="btn-copy-syn" style="height:28px;padding:0 14px;font-size:11px;margin-top:6px;">Copy Syntax</button>
    </div>
    <div id="exc-url-row" style="display:flex;align-items:center;gap:8px;margin-top:12px;padding:10px 12px;
      background:var(--surface);border:1px solid var(--border);border-radius:8px;">
      <span style="font-size:11px;color:var(--muted);flex-shrink:0;">URL:</span>
      <span style="font-size:12px;font-weight:600;color:var(--primary);flex:1;font-family:'Courier New',monospace;">excalidraw.com</span>
      <button class="btn btn-o" id="btn-exc-link" style="height:26px;padding:0 10px;font-size:10px;flex-shrink:0;">Open ↗</button>
    </div>
    <div id="exc-blocked-notice" style="display:none;margin-top:8px;font-size:11px;color:var(--muted);
      padding:8px 12px;background:var(--surface2);border-radius:6px;border-left:2px solid var(--primary);">
      Popup blocked. Type <strong style="color:var(--primary)">excalidraw.com</strong> in a new tab.
    </div>
  </div>
</div>
<footer>
  <div class="btn-g">
    <button class="btn btn-o" id="btn-svg">
      <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor"><path d="M8 11L3 6h3V1h4v5h3L8 11zM1 13h14v2H1z"/></svg>
      Export SVG
    </button>
  </div>
  <button class="btn btn-p" id="btn-exc-open">
    <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor"><path d="M9 2h5v5h-2V4.4l-6 6L4.6 9l6-6H9V2zM2 4h3v2H4v6h6v-1h2v3H2V4z"/></svg>
    Open in Excalidraw
  </button>
</footer>
</div>
<div id="toast"></div>
<script>
var D=${syntaxJson};
var T=${titleJson};
document.getElementById("syn-code").textContent=D;
document.getElementById("syn-ta").value=D;
var _tt;
function toast(m,d){var el=document.getElementById("toast");el.textContent=m;el.classList.add("on");clearTimeout(_tt);_tt=setTimeout(function(){el.classList.remove("on");},d||2200);}
function copyText(txt){if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(txt).catch(function(){execCopy(txt);});}else{execCopy(txt);}}
function execCopy(txt){var ta=document.createElement("textarea");ta.value=txt;ta.style.cssText="position:fixed;top:-999px;left:-999px;opacity:0;";document.body.appendChild(ta);ta.select();try{document.execCommand("copy");}catch(e){}document.body.removeChild(ta);}
mermaid.initialize({startOnLoad:false,theme:"base",securityLevel:"loose",themeVariables:{background:"#0D0D0D",mainBkg:"#161616",primaryColor:"#F96846",primaryBorderColor:"#F96846",primaryTextColor:"#F2F2F2",lineColor:"#555",secondaryColor:"#1E1E1E",tertiaryColor:"#222",textColor:"#F2F2F2",labelTextColor:"#F2F2F2",nodeTextColor:"#F2F2F2",edgeLabelBackground:"#161616",clusterBkg:"#1A1A1A",clusterBorder:"#2A2A2A",titleColor:"#F2F2F2",fontFamily:"Space Grotesk,system-ui,sans-serif",fontSize:"14px",pie1:"#F96846",pie2:"#FF9E87",pie3:"#FFD4C8",pie4:"#CC4D2E",pie5:"#E8755A",pie6:"#A03820",pie7:"#FF6040",activationBorderColor:"#F96846",sequenceNumberColor:"#F96846",sectionBkgColor:"#161616",altSectionBkgColor:"#1A1A1A"}});
var mel=document.getElementById("mel");
var errEl=document.getElementById("err");
mel.textContent=D;
mermaid.run({nodes:[mel]}).then(function(){var svg=mel.querySelector("svg");if(!svg)return;svg.removeAttribute("height");svg.removeAttribute("width");svg.style.display="block";fitTransform();}).catch(function(e){mel.style.display="none";errEl.style.display="flex";document.getElementById("errmsg").textContent="Error: "+(e&&e.message?e.message:"Invalid syntax");});
var scale=1,tx=0,ty=0;
var dragging=false,startX=0,startY=0,startTx=0,startTy=0;
var wrap=document.getElementById("wrap");
var canvas=document.getElementById("canvas");
function applyTransform(){canvas.style.transform="translate(calc(-50% + "+tx+"px), calc(-50% + "+ty+"px)) scale("+scale+")";document.getElementById("zlvl").textContent=Math.round(scale*100)+"%";}
function initTransform(){scale=1;tx=0;ty=0;applyTransform();}
function fitTransform(){var svg=mel.querySelector("svg");if(!svg){initTransform();return;}var svgW=0,svgH=0;var vb=svg.getAttribute("viewBox");if(vb){var parts=vb.trim().split(/[\\s,]+/);svgW=parseFloat(parts[2])||0;svgH=parseFloat(parts[3])||0;}if(!svgW||!svgH){var r=svg.getBoundingClientRect();svgW=r.width||400;svgH=r.height||300;}var wrapRect=wrap.getBoundingClientRect();var padFactor=0.88;var scaleX=(wrapRect.width*padFactor)/svgW;var scaleY=(wrapRect.height*padFactor)/svgH;var fit=Math.min(scaleX,scaleY,1);scale=Math.max(0.05,fit);tx=0;ty=0;applyTransform();}
wrap.addEventListener("wheel",function(e){e.preventDefault();var rect=wrap.getBoundingClientRect();var cx=e.clientX-rect.left-rect.width/2;var cy=e.clientY-rect.top-rect.height/2;var delta=e.deltaY<0?1.12:0.89;var ns=Math.min(8,Math.max(0.1,scale*delta));tx=cx+(tx-cx)*(ns/scale);ty=cy+(ty-cy)*(ns/scale);scale=ns;applyTransform();},{passive:false});
wrap.addEventListener("pointerdown",function(e){if(e.target.closest("button,a,textarea"))return;dragging=true;startX=e.clientX;startY=e.clientY;startTx=tx;startTy=ty;wrap.setPointerCapture(e.pointerId);wrap.classList.add("dragging");});
wrap.addEventListener("pointermove",function(e){if(!dragging)return;tx=startTx+(e.clientX-startX);ty=startTy+(e.clientY-startY);applyTransform();});
wrap.addEventListener("pointerup",function(){dragging=false;wrap.classList.remove("dragging");});
document.getElementById("z-in").onclick=function(){scale=Math.min(8,scale*1.2);applyTransform();};
document.getElementById("z-out").onclick=function(){scale=Math.max(0.1,scale/1.2);applyTransform();};
document.getElementById("z-rst").onclick=function(){fitTransform();};
document.getElementById("btn-svg").onclick=function(){var svg=mel.querySelector("svg");if(!svg){toast("No diagram rendered yet");return;}var clone=svg.cloneNode(true);clone.setAttribute("xmlns","http://www.w3.org/2000/svg");clone.style.background="#0D0D0D";var str=new XMLSerializer().serializeToString(clone);var enc="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(str);var a=document.createElement("a");a.href=enc;a.download=T.replace(/[^a-z0-9]/gi,"-").toLowerCase()+".svg";document.body.appendChild(a);a.click();document.body.removeChild(a);toast("SVG downloaded");};
document.getElementById("btn-syn").onclick=function(){document.getElementById("syn-panel").classList.add("open");};
document.getElementById("btn-syn-close").onclick=function(){document.getElementById("syn-panel").classList.remove("open");};
document.getElementById("btn-exc-open").onclick=function(){copyText(D);document.getElementById("exc-panel").classList.add("open");};
document.getElementById("btn-exc-close").onclick=function(){document.getElementById("exc-panel").classList.remove("open");};
document.getElementById("btn-exc-link").onclick=function(){var url="https://excalidraw.com";try{window.parent.postMessage({type:"openUrl",url:url},"*");}catch(e){}var popup=null;try{popup=window.open(url,"_blank","noopener,noreferrer");}catch(e){}setTimeout(function(){if(!popup||popup.closed||typeof popup.closed==="undefined"){document.getElementById("exc-blocked-notice").style.display="block";}},300);};
document.getElementById("btn-copy-syn").onclick=function(){copyText(D);var msg=document.getElementById("copy-msg");msg.classList.add("on");setTimeout(function(){msg.classList.remove("on");},2000);toast("Mermaid syntax copied");};
document.getElementById("syn-ta").addEventListener("click",function(){this.select();copyText(D);var msg=document.getElementById("copy-msg");msg.classList.add("on");setTimeout(function(){msg.classList.remove("on");},2000);});
</script>
</body>
</html>`;
}

// ── MCP Agent ─────────────────────────────────────────────────────────────────

const VISUALIZER_URI = "ui://sales-wiki/visualizer.html";

export class SalesWikiMCP extends McpAgent<Env, unknown, SalesProps> {
  server = new McpServer({ name: "Sales Wiki", version: "1.0.0" });

  private diagramSyntax = "";
  private diagramTitle = "Sales Wiki Diagram";

  private async track(event: string, props: Record<string, unknown> = {}): Promise<void> {
    const key = this.env.POSTHOG_API_KEY;
    if (!key) return;
    try {
      await fetch("https://us.i.posthog.com/capture/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: key,
          distinct_id: this.props?.claims?.sub ?? "anonymous",
          event,
          properties: {
            ...props,
            $lib: "sales-wiki-mcp",
            server: "sales-wiki",
            user_email: this.props?.claims?.email,
            user_name: this.props?.claims?.name,
            $set: {
              email: this.props?.claims?.email,
              name: this.props?.claims?.name,
            },
          },
          timestamp: new Date().toISOString(),
        }),
      });
    } catch { /* analytics must never crash a tool call */ }
  }

  async init() {

    // ── 1. get_index ──────────────────────────────────────────────────────────
    this.server.tool(
      "get_index",
      "Returns the full sales wiki index — catalog of all pages by category. Call this first to discover what exists before using get_page or search_wiki.",
      {},
      async () => {
        const t0 = Date.now();
        try {
          const content = await this.env.SALES_WIKI.get("__index__");
          const text = content ?? "Index not found. Run sync.js.";
          await this.track("tool_called", { tool: "get_index", duration_ms: Date.now() - t0, found: !!content });
          return { content: [{ type: "text" as const, text }] };
        } catch (err) {
          await this.track("tool_error", { tool: "get_index", error: String(err) });
          return { content: [{ type: "text" as const, text: "Wiki index temporarily unavailable." }] };
        }
      }
    );

    // ── 2. get_page ───────────────────────────────────────────────────────────
    this.server.tool(
      "get_page",
      "Fetches the full content of a single wiki page by key, e.g. 'concepts/call-framework' or 'entities/cohort-program'. Use get_index first to find valid keys.",
      { path: z.string().describe("KV key of the page. No .md extension needed.") },
      async ({ path }) => {
        const t0 = Date.now();
        const safePath = path.replace(/\.md$/, "");
        if (!/^[a-z0-9/_-]+$/.test(safePath)) {
          await this.track("input_rejected", { tool: "get_page", reason: "invalid_path", path });
          return { content: [{ type: "text" as const, text: `Invalid path: '${path}'. Use lowercase letters, numbers, hyphens, slashes only.` }] };
        }
        try {
          const content = await this.env.SALES_WIKI.get(safePath);
          const found = !!content;
          await this.track("tool_called", { tool: "get_page", duration_ms: Date.now() - t0, path, found });
          return { content: [{ type: "text" as const, text: found ? sanitizeOutput(content!) : `Not found: '${path}'. Use get_index to see valid keys.` }] };
        } catch (err) {
          await this.track("tool_error", { tool: "get_page", error: String(err) });
          return { content: [{ type: "text" as const, text: `Unable to fetch '${path}' right now.` }] };
        }
      }
    );

    // ── 3. search_wiki ────────────────────────────────────────────────────────
    this.server.tool(
      "search_wiki",
      "Full-text search across all sales wiki pages. Returns keys, titles, and excerpts. Use for ad-hoc questions not covered by the situational tools.",
      {
        query: z.string().min(2).describe("Search term"),
        type: z.enum(["concepts", "sources", "entities", "synthesis"]).optional().describe("Restrict to page type"),
      },
      async ({ query, type }) => {
        const t0 = Date.now();
        if (query.length > 1000) {
          await this.track("input_rejected", { tool: "search_wiki", reason: "query_too_long", length: query.length });
          return { content: [{ type: "text" as const, text: "Query too long. Keep under 1000 characters." }] };
        }
        try {
          const listed = await this.env.SALES_WIKI.list({ prefix: type ? `${type}/` : undefined });
          const q = query.toLowerCase();
          const matches: string[] = [];
          for (const k of listed.keys) {
            const md = await this.env.SALES_WIKI.get(k.name);
            if (!md) continue;
            const idx = md.toLowerCase().indexOf(q);
            if (idx === -1) continue;
            const title = extractTitle(md) ?? k.name;
            const start = Math.max(0, idx - 40);
            const excerpt = md.slice(start, idx + query.length + 60).replace(/\n/g, " ").trim();
            matches.push(`[${k.name}] ${title}\n  "...${excerpt}..."`);
          }
          const resultText = matches.length
            ? `${matches.length} result(s) for '${query}':\n\n${matches.join("\n\n")}`
            : `No results for '${query}'.`;
          await this.track("tool_called", { tool: "search_wiki", duration_ms: Date.now() - t0, query, type: type ?? "all", results_count: matches.length });
          return { content: [{ type: "text" as const, text: resultText }] };
        } catch (err) {
          await this.track("tool_error", { tool: "search_wiki", error: String(err) });
          return { content: [{ type: "text" as const, text: "Search temporarily unavailable." }] };
        }
      }
    );

    // ── 4. get_call_brief ─────────────────────────────────────────────────────
    this.server.tool(
      "get_call_brief",
      "Fetches everything needed to prep for or navigate a call with a specific lead. Includes curriculum data, sales frameworks, and wiki index for domain-aware page discovery. Use before the call OR mid-call.",
      {
        domain: z.string().describe("Lead's professional domain, e.g. 'game designer', 'doctor', 'marketing agency founder'"),
        role: z.string().optional().describe("Specific job title or role if known"),
        years_exp: z.number().optional().describe("Years of experience if known"),
      },
      async ({ domain, role, years_exp }) => {
        const t0 = Date.now();
        try {
          const wikiIndex = await this.env.SALES_WIKI.get("__index__");
          const context = `
=== LEAD CONTEXT ===
domain="${domain}"${role ? `, role="${role}"` : ""}${years_exp ? `, years_exp=${years_exp}` : ""}

=== MANDATORY PRE-OUTPUT STEPS — DO ALL IN ORDER, DO NOT SKIP ===

STEP 1 — WEB SEARCH:
Search: "${domain} company AI replacing workflow 2025 2026" AND "${domain} studio cut roles AI 2026"
You are looking for ONE named real-world example — a specific company that did something with AI
in the ${domain} space. A studio that cut a team. A tool a named company shipped. A decision a
named org made. Something a rep can say: "Hey, [Company X] just did [Y] last year."
NOT a percentage. NOT "studies show." NOT "the industry is shifting."
A NAME. A DECISION. A DATE.
Also search: "site:techcrunch.com OR site:theverge.com OR site:gamedeveloper.com ${domain} AI 2025 2026"
to find credible named examples with sources a rep can cite.

STEP 2 — FETCH PAGES FROM WIKI INDEX:
You MUST fetch these every time — they are the foundation:
- sources/100x-cohort7-module1-diffusion
- sources/100x-cohort7-module2-llm
- sources/100x-cohort7-module3-agents
- concepts/call-framework
- concepts/domain-mirroring
- concepts/experience-reframe
- concepts/three-mode-objection-handling
- synthesis/success-stories
Then pick 3-4 MORE pages from the WIKI INDEX below relevant to "${domain}".
Call get_page for ALL of them now, before writing any output.

STEP 3 — MAP SHIFT TO LECTURE:
Take the specific story/event from Step 1.
Which exact lecture from the curriculum directly equips this lead to be
on the RIGHT side of that shift — the one driving it, not replaced by it?
Name the shift and the lecture explicitly.

=== OUTPUT FORMAT (only after completing all 3 steps above) ===

**Hook angle:** [name a specific tool or workflow they use daily and the exact frustration it creates — not "AI is changing things", something like "you're spending 3 days on concept iterations that should take 3 hours"]
Frame it as: [1 sentence — the mental model that reframes their daily frustration as the exact problem this cohort solves]

**What's shifting in their world:**
[Named company OR specific tool release OR specific role cut — one real example with a name]
(Source: [publication + year])
→ Cohort coverage: [exact lecture name] — [1 line on what it teaches for this]
Frame it as: [1 sentence the rep can say naturally on a call using this example — e.g. "The studios aren't hiring fewer designers, they're hiring fewer junior ones and paying the senior one more."]

**Relevant modules:**
- Module 1 (Diffusion): [2-3 EXACT lecture names from wiki] — [what they specifically build in their domain]
- Module 2 (Full Stack LLM): [2-3 EXACT lecture names from wiki] — [what they specifically build in their domain]
- Module 3 (Agents): [2-3 EXACT lecture names from wiki] — [what they specifically build in their domain]

**Likely objections:**
[objection 1] → [one line response]
Frame it as: [mental model that dissolves this objection]
[objection 2] → [one line response]
Frame it as: [mental model that dissolves this objection]

**Story to use:**
- Name: [full name]
- Cohort: [cohort number]
- Before: [their background/role before — 1 line]
- What they did: [specific thing they built or achieved during cohort — 1 line]
- After: [concrete outcome — company, salary, hike, product launch — 1 line]
- Why it lands for this lead: [1 sentence — what specifically makes this story resonate for THIS domain/person]
Frame it as: [exact words the rep can say on the call — e.g. "We had a game designer from Cohort 6, mechanical engineer background, now running AI pipelines at T-Series. His domain knowledge was the thing that made him irreplaceable — not despite the AI shift, because of it."]

**Key handle:** [1 sentence — their years of experience is the unfair advantage AI grads don't have]
Frame it as: [1 sentence mental model — e.g. "The resistance is your opportunity."]

=== WIKI INDEX ===
${wikiIndex ?? "Index not available."}`;
          await this.track("tool_called", { tool: "get_call_brief", duration_ms: Date.now() - t0, domain });
          return { content: [{ type: "text" as const, text: sanitizeOutput(context) }] };
        } catch (err) {
          await this.track("tool_error", { tool: "get_call_brief", error: String(err) });
          return { content: [{ type: "text" as const, text: "Unable to fetch call brief right now." }] };
        }
      }
    );

    // ── 5. get_objection_response ─────────────────────────────────────────────
    this.server.tool(
      "get_objection_response",
      "Fetches objection handling context for a specific objection raised mid-call. Describe the objection in natural language — exact words not needed.",
      {
        objection: z.string().describe("The objection in the rep's own words, e.g. 'she said it is too expensive' or 'he thinks he can learn on YouTube'"),
        domain: z.string().optional().describe("Lead's professional domain if known, e.g. 'game designer', 'doctor'"),
      },
      async ({ objection, domain }) => {
        const t0 = Date.now();
        try {
          const corePages = [
            "concepts/three-mode-objection-handling",
            "sources/objection-playbook",
            "concepts/call-framework",
            "concepts/learn-on-real-problems",
            "concepts/it-wave-ai-wave",
            "entities/cohort-program",
          ];
          const [bundled, wikiIndex] = await Promise.all([
            fetchPages(this.env.SALES_WIKI, corePages),
            this.env.SALES_WIKI.get("__index__"),
          ]);
          const context = `
=== SITUATION ===
Objection: "${objection}"${domain ? `\nDomain: "${domain}"` : ""}

=== MANDATORY PRE-OUTPUT STEPS — DO ALL IN ORDER, DO NOT SKIP ===

STEP 1 — DOMAIN PAGE DISCOVERY:
${domain
  ? `You know what a ${domain} does. Look at the WIKI INDEX at the bottom.
Pick 3-4 pages most relevant to their world and this objection context.
Call get_page for EACH one now, before writing output.`
  : `Look at the WIKI INDEX at the bottom.
Pick 2-3 pages most relevant to this specific objection type.
Call get_page for EACH one now, before writing output.`}

STEP 2 — Write response in EXACTLY this structure, nothing else:

**Warm:** [1-2 sentences — empathetic, validates concern then reframes without pressure]
**Pressure:** [1-2 sentences — direct, creates urgency without aggression]
**Straightforward:** [1-2 sentences — factual, no emotion, plain clear answer]
**Rep tip:** [1 line — which mode fits this lead's energy right now and why]

=== CORE WIKI DATA ===
${bundled}

=== WIKI INDEX (use this for Step 1 — pick relevant pages and call get_page) ===
${wikiIndex ?? "Index not available."}`;
          await this.track("tool_called", { tool: "get_objection_response", duration_ms: Date.now() - t0, objection, domain: domain ?? "none" });
          return { content: [{ type: "text" as const, text: sanitizeOutput(context) }] };
        } catch (err) {
          await this.track("tool_error", { tool: "get_objection_response", error: String(err) });
          return { content: [{ type: "text" as const, text: "Unable to fetch objection response right now." }] };
        }
      }
    );

    // ── 6. draft_followup ─────────────────────────────────────────────────────
    this.server.tool(
      "draft_followup",
      "Drafts a personalized WhatsApp follow-up message after a sales call. Provide prospect name, domain, and brief call notes.",
      {
        prospect_name: z.string().describe("Prospect's first name"),
        domain: z.string().describe("Their professional domain"),
        call_notes: z.string().describe("Brief notes from the call — what resonated, concerns raised, anything specific they said"),
      },
      async ({ prospect_name, domain, call_notes }) => {
        const t0 = Date.now();
        try {
          const corePages = [
            "concepts/call-framework",
            "entities/cohort-program",
            "concepts/matched-success-story",
            "synthesis/success-stories",
            "concepts/experience-reframe",
          ];
          const [bundled, wikiIndex] = await Promise.all([
            fetchPages(this.env.SALES_WIKI, corePages),
            this.env.SALES_WIKI.get("__index__"),
          ]);
          const context = `
=== SITUATION ===
Prospect: name="${prospect_name}", domain="${domain}"
Call notes: ${call_notes}

=== MANDATORY PRE-OUTPUT STEPS — DO ALL IN ORDER, DO NOT SKIP ===

STEP 1 — DOMAIN PAGE DISCOVERY:
You know what a ${domain} does. Look at the WIKI INDEX at the bottom.
Pick 3-4 pages most relevant to their world and what resonated on this call.
Call get_page for EACH one now, before writing the message.

STEP 2 — WRITE THE MESSAGE:
Output EXACTLY ONE WhatsApp message. No "Option A", no variants, no labels, no explanation before or after.
Rules:
- 3-5 sentences maximum
- Conversational tone — how a helpful person texts, not how a salesperson emails
- Use ${prospect_name}'s first name once at the start
- Reference something specific from the call notes (a concern, something that resonated)
- End with exactly one clear next step (e.g. "Anup will send you the brochure shortly")
- Do not mention price unless it appears explicitly in call notes above

Write the message now. Nothing else.

=== CORE WIKI DATA ===
${bundled}

=== WIKI INDEX (use this for Step 1 — pick relevant pages and call get_page) ===
${wikiIndex ?? "Index not available."}`;
          await this.track("tool_called", { tool: "draft_followup", duration_ms: Date.now() - t0, domain });
          return { content: [{ type: "text" as const, text: sanitizeOutput(context) }] };
        } catch (err) {
          await this.track("tool_error", { tool: "draft_followup", error: String(err) });
          return { content: [{ type: "text" as const, text: "Unable to draft follow-up right now." }] };
        }
      }
    );

    // ── 7. visualize ─────────────────────────────────────────────────────────
    registerAppTool(
      this.server,
      "visualize",
      {
        title: "Wiki Visualizer",
        description: "Renders an interactive Mermaid diagram in the chat. Generate valid Mermaid syntax (flowchart, mindmap, timeline, sequenceDiagram, etc.) from wiki content, then call this tool. Supports zoom, pan, SVG export, and opening in Excalidraw.",
        inputSchema: {
          diagram: z.string().describe("Complete Mermaid diagram syntax to render"),
          title: z.string().optional().describe("Short title for the diagram"),
        },
        _meta: { ui: { resourceUri: VISUALIZER_URI } },
      },
      async (args: { diagram: string; title?: string }) => {
        const t0 = Date.now();
        try {
          const { diagram, title } = args;
          this.diagramSyntax = diagram;
          this.diagramTitle = title ?? "Sales Wiki Diagram";
          await this.track("tool_called", { tool: "visualize", duration_ms: Date.now() - t0, diagram_length: diagram.length, has_title: !!title });
          return { content: [{ type: "text" as const, text: `Diagram ready: "${this.diagramTitle}"` }] };
        } catch (err) {
          await this.track("tool_error", { tool: "visualize", error: String(err) });
          return { content: [{ type: "text" as const, text: "Unable to render diagram right now." }] };
        }
      }
    );

    registerAppResource(
      this.server,
      VISUALIZER_URI,
      VISUALIZER_URI,
      { mimeType: RESOURCE_MIME_TYPE },
      async () => ({
        contents: [{
          uri: VISUALIZER_URI,
          mimeType: RESOURCE_MIME_TYPE,
          text: buildVisualizerHTML(this.diagramSyntax, this.diagramTitle),
        }],
      })
    );
  }
}

// ── Security headers ──────────────────────────────────────────────────────────
const SECURITY_HEADERS: HeadersInit = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "no-referrer",
  "Content-Security-Policy": "default-src 'none'",
};

function withSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) headers.set(k, v);
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

// ── OAuth Provider ────────────────────────────────────────────────────────────
const oauthProvider = new OAuthProvider({
  apiRoute: "/mcp",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiHandler: SalesWikiMCP.serve("/mcp") as any,
  defaultHandler: GoogleHandler,
  authorizeEndpoint: "/authorize",
  tokenEndpoint: "/token",
  clientRegistrationEndpoint: "/register",
  scopesSupported: ["read"],
  accessTokenTTL: 86400,
  refreshTokenTTL: 2592000,
});

// ── Worker fetch handler ──────────────────────────────────────────────────────
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    const contentLength = parseInt(request.headers.get("Content-Length") ?? "0", 10);
    if (contentLength > 1_048_576) {
      return withSecurityHeaders(new Response(
        JSON.stringify({ error: "Request too large." }),
        { status: 413, headers: { "Content-Type": "application/json" } }
      ));
    }

    if (url.pathname === "/mcp") {
      const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
      const { success } = await env.MCP_RATE_LIMITER.limit({ key: ip });
      if (!success) {
        return withSecurityHeaders(new Response(
          JSON.stringify({ error: "Too many requests. Please wait a moment." }),
          { status: 429, headers: { "Content-Type": "application/json", "Retry-After": "60" } }
        ));
      }
    }

    const response = await oauthProvider.fetch(request, env, ctx);
    return withSecurityHeaders(response);
  },
};
