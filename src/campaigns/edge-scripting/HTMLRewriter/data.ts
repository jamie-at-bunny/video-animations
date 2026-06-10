// HTMLRewriter quickstart walkthrough — based on docs.bunny.net/scripting/html-rewriter.
export const HTML_REWRITER_DURATION = 360; // 12s

// Token colour roles for lightweight syntax highlighting.
export type TokRole = "kw" | "str" | "fn" | "punc" | "txt";
export type Tok = { x: string; c: TokRole };
export type CodeLine = { toks: Tok[] };

const k = (x: string): Tok => ({ x, c: "kw" });
const s = (x: string): Tok => ({ x, c: "str" });
const f = (x: string): Tok => ({ x, c: "fn" });
const p = (x: string): Tok => ({ x, c: "punc" });
const t = (x: string): Tok => ({ x, c: "txt" });

// The quickstart, tokenised line by line. Leading whitespace lives in a punc token
// (rendered with white-space: pre).
export const CODE: CodeLine[] = [
  { toks: [k("import "), p("* "), k("as "), f("BunnySDK "), k("from "), s('"@bunny.net/edgescript-sdk"'), p(";")] },
  { toks: [] },
  { toks: [f("BunnySDK"), p("."), f("net"), p("."), f("http"), p("."), f("servePullZone"), p("()")] },
  { toks: [p("  ."), f("onOriginResponse"), p("("), k("async "), p("({ "), t("response"), p(" }) => {")] },
  { toks: [p("    "), k("return "), k("new "), f("HTMLRewriter"), p("()")] },
  { toks: [p("      ."), f("on"), p("("), s('"h1"'), p(", {")] },
  { toks: [p("        "), f("element"), p("("), t("el"), p(") {")] },
  { toks: [p("          "), t("el"), p("."), f("setInnerContent"), p("("), s('"Modified Title"'), p(");")] },
  { toks: [p("        "), p("},")] },
  { toks: [p("      "), p("})")] },
  { toks: [p("      ."), f("transform"), p("("), t("response"), p(");")] },
  { toks: [p("  "), p("});")] },
];

// Walkthrough steps — each highlights a line range and explains it on the right.
export type Step = { range: [number, number]; title: string; body: string };
export const STEPS: Step[] = [
  { range: [0, 0], title: "Load the SDK", body: "Import the Bunny Edge Scripting SDK into your script." },
  {
    range: [2, 3],
    title: "Hook the response",
    body: "Run on every origin response as it streams back — the document is never buffered in memory.",
  },
  {
    range: [4, 4],
    title: "Create the rewriter",
    body: "HTMLRewriter parses the HTML on the fly, calling your handlers as it encounters matches.",
  },
  {
    range: [5, 6],
    title: "Match elements",
    body: "A CSS selector picks which elements to touch; your handler fires once per match.",
  },
  {
    range: [7, 7],
    title: "Rewrite content",
    body: "Replace the matched element's inner HTML — here every <h1> becomes “Modified Title”.",
  },
  {
    range: [10, 10],
    title: "Stream it out",
    body: "transform() returns the modified response, streamed straight to the visitor.",
  },
];
