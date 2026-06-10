import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS, brandA, inkA } from "@/shared/theme";
import { BadDot, makeBads, impactFrames } from "@/shared/BadTraffic";
import { SceneTransition } from "@/shared/SceneTransition";

export const FRICTIONLESS_DURATION = 210; // 7s

const Y = 540;
const START = 300;
const END = 1620;
const CHECK = 960;

const BADS = makeBads(10, 26, 16);
const BAD_IMPACTS = impactFrames(BADS);

// A legitimate request that glides straight through the checkpoint.
const Good: React.FC<{ launch: number }> = ({ launch }) => {
  const frame = useCurrentFrame();
  const travel = 66;
  const t = (frame - launch) / travel;
  if (t < 0 || t > 1) return null;
  const x = START + (END - START) * t;
  const opacity = interpolate(t, [0, 0.06, 0.94, 1], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: Y,
        width: 13,
        height: 13,
        marginLeft: -6.5,
        marginTop: -6.5,
        borderRadius: "50%",
        background: COLORS.brand,
        opacity,
        boxShadow: `0 0 10px 3px ${brandA(0.85)}`,
      }}
    />
  );
};

const Checkpoint: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 0.8 + 0.2 * Math.sin(frame * 0.16);
  const flash = BAD_IMPACTS.reduce(
    (m, imp) => Math.max(m, interpolate(Math.abs(frame - imp), [0, 12], [1, 0], { extrapolateRight: "clamp" })),
    0,
  );
  return (
    <>
      <div style={{ position: "absolute", left: START, top: Y - 1, width: END - START, height: 2, background: inkA(0.18) }} />
      <div
        style={{
          position: "absolute",
          left: CHECK,
          top: Y - 80,
          width: 3 + flash * 2,
          height: 160,
          marginLeft: -(3 + flash * 2) / 2,
          background: `linear-gradient(to bottom, ${brandA(0)}, ${brandA(0.8 + flash * 0.2)}, ${brandA(0)})`,
          boxShadow: `0 0 ${10 + 8 * pulse + flash * 24}px ${brandA(0.6 + flash * 0.4)}`,
        }}
      />
    </>
  );
};

export const Frictionless: React.FC = () => {
  const goods = Array.from({ length: 18 }, (_, i) => 14 + i * 11);
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <SceneTransition>
        <Checkpoint />
        {goods.map((l, i) => (
          <Good key={`g${i}`} launch={l} />
        ))}
        {BADS.map((b, i) => (
          <BadDot key={`b${i}`} def={b} startX={START} impactX={CHECK} y={Y} />
        ))}
      </SceneTransition>
    </AbsoluteFill>
  );
};
