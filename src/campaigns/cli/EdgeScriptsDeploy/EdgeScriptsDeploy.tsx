import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { COLORS, brandA, inkA } from "@/shared/theme";
import { rand } from "@/shared/util";
import { SceneTransition } from "@/shared/SceneTransition";
import { BunnyLogo } from "@/shared/brand";

export const EDGE_SCRIPTS_DEPLOY_DURATION = 270; // 9s — holds on the lit map before fading

const MONO = loadMono("normal", { weights: ["400", "500", "700"], subsets: ["latin"] }).fontFamily;

const MAP_RATIO = 6995 / 3521;

// Terminal lines (cmd lines type out char-by-char; out lines fade in).
type Line = { t: "cmd" | "out"; text: string; start: number; bright?: boolean };
const LINES: Line[] = [
  { t: "cmd", text: "bunny scripts init", start: 6 },
  { t: "out", text: "✓ Edge Script project created", start: 28 },
  { t: "cmd", text: "npm run deploy", start: 42 },
  { t: "out", text: "✓ Built dist/index.js", start: 66 },
  { t: "cmd", text: "bunny scripts deploy dist/index.js", start: 80 },
  { t: "out", text: "→ Deploying to the edge…", start: 116 },
  { t: "out", text: "✓ Live in 119 locations", start: 150, bright: true },
];

const DEPLOY_FRAME = 116;

// Edge POP locations on the map (frame coords, on land).
const POPS = [
  [300, 320], [370, 360], [260, 400], [430, 340], [340, 300], [400, 430],
  [450, 620], [490, 700], [460, 560],
  [930, 320], [975, 300], [905, 350], [1000, 360],
  [980, 470], [1010, 560], [960, 640], [1030, 430],
  [1180, 360], [1280, 330], [1360, 400], [1220, 440], [1320, 300], [1420, 360],
  [1500, 720], [1560, 690],
];

const WorldMap: React.FC = () => {
  const w = 1920 * 1.02;
  const h = w / MAP_RATIO;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <Img src={staticFile("world-map.svg")} style={{ width: w, height: h, opacity: 0.32 }} />
    </AbsoluteFill>
  );
};

const PopDots: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      {POPS.map(([x, y], i) => {
        const lightAt = DEPLOY_FRAME + 4 + rand(i + 1) * 30;
        const t = interpolate(frame, [lightAt, lightAt + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
        if (t <= 0) return null;
        // continuous per-node pulse (runs until the scene transitions out)
        const p01 = 0.5 + 0.5 * Math.sin(frame * 0.22 + i * 1.3);
        return (
          <div key={i}>
            {/* ripple */}
            <div
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: 28,
                height: 28,
                marginLeft: -14,
                marginTop: -14,
                borderRadius: "50%",
                border: `2px solid ${brandA(0.7)}`,
                transform: `scale(${interpolate(t, [0, 1], [0.3, 1.8])})`,
                opacity: (1 - t) * 0.8,
              }}
            />
            {/* dot */}
            <div
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: 8,
                height: 8,
                marginLeft: -4,
                marginTop: -4,
                borderRadius: "50%",
                background: COLORS.brand,
                opacity: t * (0.55 + 0.45 * p01),
                transform: `scale(${interpolate(t, [0, 1], [0.4, 1]) * (0.88 + 0.24 * p01)})`,
                boxShadow: `0 0 ${8 + 11 * p01}px ${brandA(0.85)}`,
              }}
            />
          </div>
        );
      })}
    </>
  );
};

const Terminal: React.FC = () => {
  const frame = useCurrentFrame();
  const W = 1000;
  const H = 452;
  const TX = 960;
  const TY = 318;
  // dim after deploy so the map lights through
  const dim = interpolate(frame, [DEPLOY_FRAME + 8, DEPLOY_FRAME + 28], [1, 0.66], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // which line is the latest active (for the cursor)
  let activeIdx = 0;
  LINES.forEach((l, i) => {
    if (frame >= l.start) activeIdx = i;
  });
  const cursorBlink = Math.floor(frame / 14) % 2 === 0;

  return (
    <div style={{ position: "absolute", left: TX - W / 2, top: TY, width: W, height: H, borderRadius: 14, overflow: "hidden" }}>
      {/* panel background — dims after deploy */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 14,
          border: `1px solid ${inkA(0.14)}`,
          background: "rgba(9,11,32,0.92)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
          opacity: dim,
        }}
      />
      {/* title bar */}
      <div style={{ position: "relative", height: 46, borderBottom: `1px solid ${inkA(0.1)}`, display: "flex", alignItems: "center", gap: 9, paddingLeft: 20, opacity: dim }}>
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
          <div key={c} style={{ width: 13, height: 13, borderRadius: "50%", background: c, opacity: 0.85 }} />
        ))}
        <span style={{ fontFamily: MONO, color: inkA(0.5), fontSize: 16, marginLeft: 14 }}>bunny — edge scripting</span>
      </div>
      {/* content */}
      <div style={{ position: "relative", padding: "26px 30px", display: "flex", flexDirection: "column", gap: 13, fontFamily: MONO, fontSize: 27, lineHeight: 1.4 }}>
        {LINES.map((l, i) => {
          if (frame < l.start) return null;
          if (l.t === "cmd") {
            const chars = Math.min(Math.max(frame - l.start, 0), l.text.length);
            const typing = chars < l.text.length;
            const showCursor = i === activeIdx && (typing || cursorBlink);
            return (
              <div key={i} style={{ color: COLORS.ink, opacity: dim, whiteSpace: "pre" }}>
                <span style={{ color: COLORS.brand }}>$ </span>
                {l.text.slice(0, chars)}
                {showCursor && <span style={{ background: COLORS.ink, color: COLORS.ink }}>▏</span>}
              </div>
            );
          }
          const op = interpolate(frame, [l.start, l.start + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          // the success line stays at full opacity even as the rest dims
          return (
            <div key={i} style={{ opacity: l.bright ? op : op * dim, whiteSpace: "pre" }}>
              <span style={{ color: COLORS.brand }}>{l.text.slice(0, 1)}</span>
              <span style={{ color: l.bright ? COLORS.brand : inkA(0.78) }}>{l.text.slice(1)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const LogoBottom: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [4, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 72, display: "flex", justifyContent: "center", opacity: o }}>
      <BunnyLogo width={220} />
    </div>
  );
};

// "Bunny Edge Scripts Deploy" — deploy from the CLI, live across the global edge.
export const EdgeScriptsDeploy: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
    <SceneTransition>
      <WorldMap />
      <PopDots />
      <LogoBottom />
      <Terminal />
    </SceneTransition>
  </AbsoluteFill>
);
