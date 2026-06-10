import { interpolate, Easing } from "remotion";
import { LAYOUT } from "./theme";

// Deterministic pseudo-random in [0,1) — safe for rendering (no Math.random).
export const rand = (seed: number): number => {
  const x = Math.sin(seed * 99991.123) * 43758.5453;
  return x - Math.floor(x);
};

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const REQ_START_X = LAYOUT.browser.x + 60;
const REQ_END_X = LAYOUT.site.x - 40;

// Progress (0..1) at which a request reaches the shield line.
export const T_SHIELD = (LAYOUT.shieldX - REQ_START_X) / (REQ_END_X - REQ_START_X);

export type GoodReq = {
  id: number;
  launch: number; // frame it leaves the browser
  travel: number; // frames to reach the site
  y0: number; // start height near browser
  y1: number; // end height near site
  arc: number; // signed bow of the path (so the stream fans out)
  size: number;
};

// A stream of legitimate requests. #0 is the lone opening request; the rest
// join during the interception phase so it is clear good traffic keeps
// flowing straight through while threats dissolve.
export const GOOD: GoodReq[] = [
  // the single opening request
  { id: 0, launch: 12, travel: 76, y0: 540, y1: 540, arc: 90, size: 16 },
  ...Array.from({ length: 6 }, (_, k) => {
    const i = k + 1;
    const r1 = rand(i * 3 + 1);
    const r2 = rand(i * 3 + 2);
    const r3 = rand(i * 3 + 3);
    return {
      id: i,
      launch: 58 + k * 15,
      travel: 56 + Math.round(r1 * 17),
      y0: 540 + (r2 - 0.5) * 70,
      y1: 540 + (r3 - 0.5) * 150,
      arc: (r1 - 0.5) * 240,
      size: 12 + Math.round(r2 * 3),
    };
  }),
];

// Constant-speed-ish progress: gentle ease at launch/landing, fastest through
// the middle — NEVER pausing at the shield.
export const goodProgress = (req: GoodReq, frame: number): number =>
  interpolate(frame, [req.launch, req.launch + req.travel], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.ease),
  });

// Position of a request along its arc.
export const goodPos = (req: GoodReq, t: number) => {
  const x = lerp(REQ_START_X, REQ_END_X, t);
  const y = lerp(req.y0, req.y1, t) - Math.sin(Math.PI * Math.min(Math.max(t, 0), 1)) * req.arc;
  return { x, y };
};

export type ThreatType = "ddos" | "bot" | "scanner" | "malicious";

export type Threat = {
  id: number;
  type: ThreatType;
  startX: number;
  startY: number;
  targetY: number; // where it hits the shield
  spawn: number; // frame it appears
  travel: number; // frames to reach the shield
};

const TYPES: ThreatType[] = ["ddos", "bot", "scanner", "malicious"];

// Precomputed swarm of hostile traffic converging on the shield from the left,
// top and bottom. Deterministic so renders are stable.
export const THREATS: Threat[] = Array.from({ length: 16 }, (_, i) => {
  const r1 = rand(i + 1);
  const r2 = rand(i + 11);
  const r3 = rand(i + 23);
  const r4 = rand(i + 37);
  return {
    id: i,
    type: TYPES[i % TYPES.length],
    startX: lerp(-220, 320, r1),
    startY: lerp(40, 1040, r2),
    targetY: lerp(LAYOUT.shieldTop + 40, LAYOUT.shieldBottom - 40, r3),
    spawn: Math.round(lerp(60, 156, i / 15)),
    travel: Math.round(lerp(25, 38, r4)),
  };
});
