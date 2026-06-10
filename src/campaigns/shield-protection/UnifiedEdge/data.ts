// Layout + timing for the unified-edge composition.
import { makeBads, impactFrames } from "@/shared/BadTraffic";

export const EDGE_DURATION = 210; // 7s @ 30fps

export const USER_X = 380;
export const EDGE_X = 960;
export const SITE_X = 1540;
export const AXIS_Y = 500;

export const NODE_R = 68; // user / website node radius
export const EDGE_R = 76; // bunny edge node radius
export const ORBIT_R = 216; // capability ring radius

// Real Bunny Shield features ringing the edge. Angles avoid the horizontal
// axis (0/180) so nothing sits on the request line.
import { FEATURES, FeatureId } from "@/shared/features";

export type Cap = { id: FeatureId; angle: number; appear: number };
const ANGLES = [-90, -30, 30, 90, 150, 210];
const APPEAR = [214, 246, 270, 294, 318, 346];
export const CAPS: Cap[] = FEATURES.map((f, i) => ({
  id: f.id,
  angle: ANGLES[i],
  appear: APPEAR[i],
}));

export const capPos = (angle: number, r: number = ORBIT_R) => {
  const a = (angle * Math.PI) / 180;
  return { x: EDGE_X + Math.cos(a) * r, y: AXIS_Y + Math.sin(a) * r };
};

// Continuous smooth request flow: launch frames + travel time.
// Good requests — a lighter stream that passes through.
export const FLOW_TRAVEL = 30;
export const FLOW_LAUNCHES = Array.from({ length: 13 }, (_, i) => 30 + i * 13);

// Bad requests — the bulk of traffic, bounced off the shield in all directions.
export const IMPACT_OFFSET = 120; // impact at the shield's left edge (in clear view)
export const BADS = makeBads(22, 14, 8);
export const BAD_IMPACTS = impactFrames(BADS);

