import { useCurrentFrame, interpolate } from "remotion";
import { COLORS, brandA } from "@/shared/theme";
import { BadDot } from "@/shared/BadTraffic";
import { USER_X, SITE_X, EDGE_X, AXIS_Y, NODE_R, FLOW_TRAVEL, FLOW_LAUNCHES, BADS, IMPACT_OFFSET } from "./data";

const START = USER_X + NODE_R;
const END = SITE_X - NODE_R;
const IMPACT_X = EDGE_X - IMPACT_OFFSET;

// One request gliding smoothly User -> Edge -> Website.
const Comet: React.FC<{ launch: number }> = ({ launch }) => {
  const frame = useCurrentFrame();
  const t = (frame - launch) / FLOW_TRAVEL;
  if (t < 0 || t > 1) return null;

  const x = START + (END - START) * t;
  const y = AXIS_Y; // exactly on the User—Website line
  const opacity = interpolate(t, [0, 0.06, 0.94, 1], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // brighten as it passes through the edge
  const boost = interpolate(Math.abs(x - EDGE_X), [0, 90], [1, 0], {
    extrapolateRight: "clamp",
  });

  const trail = [1, 2, 3].map((k) => START + (END - START) * Math.max(0, t - 0.018 * k));

  return (
    <>
      {trail.map((tx, i) => {
        const s = 9 - i * 1.6;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: tx,
              top: y,
              width: s,
              height: s,
              marginLeft: -s / 2,
              marginTop: -s / 2,
              borderRadius: "50%",
              background: COLORS.brand,
              opacity: opacity * (0.28 - i * 0.07),
              filter: "blur(1.5px)",
            }}
          />
        );
      })}
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: 12,
          height: 12,
          marginLeft: -6,
          marginTop: -6,
          borderRadius: "50%",
          background: COLORS.brand,
          opacity,
          boxShadow: `0 0 ${8 + boost * 8}px ${2 + boost * 3}px ${brandA(0.85)}`,
        }}
      />
    </>
  );
};

export const Flow: React.FC = () => (
  <>
    {FLOW_LAUNCHES.map((l, i) => (
      <Comet key={i} launch={l} />
    ))}
    {BADS.map((b, i) => (
      <BadDot key={`bad${i}`} def={b} startX={START} impactX={IMPACT_X} y={AXIS_Y} />
    ))}
  </>
);
