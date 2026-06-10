import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { FONT, brandA } from "@/shared/theme";
import { SceneTransition } from "@/shared/SceneTransition";
import { Glow } from "@/shared/Glow";
import { ShieldMascot } from "@/shared/brand";
import { USER_X, SITE_X, EDGE_X, AXIS_Y, NODE_R, BAD_IMPACTS } from "./data";
import { Flow } from "./Flow";
import { UserNode, WebsiteNode } from "./Nodes";

const LIGHT_BG = "#E0F2FF";
const TEXT = "#12143F";
const MH = 262;
const MW = MH * (470 / 552);

// The clean axis line User — Bunny Shield — Website, drawn out from the centre.
const Axis: React.FC = () => {
  const frame = useCurrentFrame();
  const grow = interpolate(frame, [34, 56], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const left = USER_X + NODE_R;
  const right = SITE_X - NODE_R;
  return (
    <div
      style={{
        position: "absolute",
        left,
        top: AXIS_Y - 1,
        width: right - left,
        height: 2,
        transformOrigin: `${EDGE_X - left}px center`,
        transform: `scaleX(${grow})`,
        background: `linear-gradient(90deg, rgba(18,20,63,0), rgba(18,20,63,0.16) 18%, ${brandA(0.7)} 50%, rgba(18,20,63,0.16) 82%, rgba(18,20,63,0))`,
        opacity: grow,
        boxShadow: `0 0 10px ${brandA(0.18)}`,
      }}
    />
  );
};

// The central Bunny Shield — the mascot. Good traffic flows through it.
const MascotCenter: React.FC = () => {
  const frame = useCurrentFrame();
  const bloom = interpolate(frame, [2, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const pulse = 0.85 + 0.15 * Math.sin(frame * 0.16);
  const flash = BAD_IMPACTS.reduce(
    (m, imp) => Math.max(m, interpolate(Math.abs(frame - imp), [0, 12], [1, 0], { extrapolateRight: "clamp" })),
    0,
  );

  return (
    <>
      {/* soft brand glow behind the mascot — flares when it rejects bad traffic */}
      <Glow x={EDGE_X} y={AXIS_Y} radius={210} alpha={0.16 * pulse + 0.28 * flash} whiteCore edgeStop={60} opacity={bloom} />
      <ShieldMascot
        width={MW}
        height={MH}
        style={{
          position: "absolute",
          left: EDGE_X - MW / 2,
          top: AXIS_Y - MH / 2,
          opacity: bloom,
          transform: `scale(${interpolate(bloom, [0, 1], [0.7, 1])})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: EDGE_X - 200,
          width: 400,
          top: AXIS_Y + MH / 2 + 28,
          textAlign: "center",
          fontFamily: FONT,
          color: TEXT,
          fontSize: 56,
          fontWeight: 700,
          lineHeight: 1.0,
          letterSpacing: "-0.01em",
          opacity: bloom,
        }}
      >
        Bunny
        <br />
        Shield
      </div>
    </>
  );
};

export const UnifiedEdge: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: LIGHT_BG }}>
      <SceneTransition>
        <Axis />
        <Flow />
        <UserNode />
        <WebsiteNode />
        <MascotCenter />
      </SceneTransition>
    </AbsoluteFill>
  );
};
