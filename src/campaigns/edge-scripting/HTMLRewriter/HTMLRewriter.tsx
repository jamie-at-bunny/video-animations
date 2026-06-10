import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { COLORS, FONT, brandA, inkA } from "@/shared/theme";
import { SceneTransition } from "@/shared/SceneTransition";
import { BunnyLogo } from "@/shared/brand";
import { CODE, STEPS, TokRole } from "./data";

export { HTML_REWRITER_DURATION } from "./data";

const MONO = loadMono("normal", { weights: ["400", "500", "700"], subsets: ["latin"] }).fontFamily;

const TOK_COLOR: Record<TokRole, string> = {
  kw: COLORS.brand, // import / new / return / async
  str: "#9FE0C2", // strings
  fn: "#8FB7FF", // calls / properties
  punc: inkA(0.55),
  txt: COLORS.ink,
};

// Editor panel geometry.
const PANEL_X = 110;
const PANEL_Y = 260;
const PANEL_W = 900;
const PANEL_H = 624;
const CODE_TOP = 60; // inside the panel (below the title bar)
const LINE_H = 42;
const FONT_SIZE = 26;

// Walkthrough timing.
const CODE_IN_END = 26;
const START = 30;
const STEP_LEN = 52;

const lerp = (a: number, b: number, x: number) => a + (b - a) * x;
const topOf = (r: readonly [number, number]) => r[0] * LINE_H;
const heightOf = (r: readonly [number, number]) => (r[1] - r[0] + 1) * LINE_H;

export const HTMLRewriter: React.FC = () => {
  const frame = useCurrentFrame();

  const codeIn = interpolate(frame, [6, CODE_IN_END], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const idx = Math.max(0, Math.min(STEPS.length - 1, Math.floor((frame - START) / STEP_LEN)));
  const localInStep = frame - START - idx * STEP_LEN;
  const slideT = interpolate(localInStep, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const cur = STEPS[idx].range;
  const prev = STEPS[Math.max(0, idx - 1)].range;

  const hlTop = lerp(topOf(prev), topOf(cur), slideT);
  const hlH = lerp(heightOf(prev), heightOf(cur), slideT);
  // Vertical centre of the highlight, in screen space — the text tracks this.
  const hlCenter = PANEL_Y + CODE_TOP + hlTop + hlH / 2;

  // Per-step text reveal — drops in from above (following the code's top-down flow).
  const textIn = interpolate(localInStep, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const textRise = interpolate(textIn, [0, 1], [-16, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <SceneTransition>
        {/* bunny.net logo, top-right */}
        <div style={{ position: "absolute", top: 84, right: 110 }}>
          <BunnyLogo width={150} style={{ display: "block" }} />
        </div>

        {/* header, top-left */}
        <div style={{ position: "absolute", left: PANEL_X, top: 112 }}>
          <div style={{ fontFamily: FONT, color: COLORS.ink, fontSize: 58, fontWeight: 700, letterSpacing: "-0.01em" }}>
            HTMLRewriter
          </div>
          <div style={{ fontFamily: FONT, color: inkA(0.62), fontSize: 24, fontWeight: 500, marginTop: 8 }}>
            Transform HTML as it streams through your edge script.
          </div>
        </div>

        {/* code editor panel */}
        <div
          style={{
            position: "absolute",
            left: PANEL_X,
            top: PANEL_Y,
            width: PANEL_W,
            height: PANEL_H,
            borderRadius: 24,
            background: "#0C0E2B",
            border: `1px solid ${inkA(0.12)}`,
            boxShadow: "0 30px 80px rgba(0,0,0,0.38)",
            opacity: codeIn,
            transform: `translateY(${interpolate(codeIn, [0, 1], [16, 0])}px)`,
            overflow: "hidden",
          }}
        >
          {/* title bar */}
          <div style={{ position: "absolute", top: 22, left: 24, display: "flex", gap: 9 }}>
            {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
              <div key={c} style={{ width: 13, height: 13, borderRadius: "50%", background: c, opacity: 0.92 }} />
            ))}
          </div>
          <div
            style={{
              position: "absolute",
              top: 20,
              left: 0,
              right: 0,
              textAlign: "center",
              fontFamily: MONO,
              fontSize: 18,
              color: inkA(0.5),
            }}
          >
            index.js
          </div>

          {/* code + highlight */}
          <div style={{ position: "absolute", left: 36, right: 36, top: CODE_TOP }}>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  left: -12,
                  right: -12,
                  top: hlTop,
                  height: hlH,
                  borderRadius: 10,
                  background: brandA(0.13),
                  opacity: codeIn,
                }}
              />
              {CODE.map((line, i) => {
                const activeNow = i >= cur[0] && i <= cur[1];
                const activePrev = i >= prev[0] && i <= prev[1];
                const op =
                  activeNow && activePrev
                    ? 1
                    : activeNow
                      ? lerp(0.34, 1, slideT)
                      : activePrev
                        ? lerp(1, 0.34, slideT)
                        : 0.34;
                return (
                  <div
                    key={i}
                    style={{
                      position: "relative",
                      height: LINE_H,
                      display: "flex",
                      alignItems: "center",
                      whiteSpace: "pre",
                      fontFamily: MONO,
                      fontSize: FONT_SIZE,
                      lineHeight: 1,
                      opacity: op * codeIn,
                    }}
                  >
                    {line.toks.map((tk, j) => (
                      <span key={j} style={{ color: TOK_COLOR[tk.c] }}>
                        {tk.x}
                      </span>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* explanation, synced to the highlighted block */}
        <div
          style={{
            position: "absolute",
            left: 1075,
            width: 740,
            top: hlCenter,
            opacity: textIn * codeIn,
            transform: `translateY(calc(-50% + ${textRise}px))`,
          }}
        >
          <div style={{ fontFamily: FONT, color: COLORS.ink, fontSize: 46, fontWeight: 700, lineHeight: 1.1 }}>
            {STEPS[idx].title}
          </div>
          <div style={{ fontFamily: FONT, color: inkA(0.78), fontSize: 28, fontWeight: 400, lineHeight: 1.5, marginTop: 20 }}>
            {STEPS[idx].body}
          </div>
        </div>
      </SceneTransition>
    </AbsoluteFill>
  );
};
