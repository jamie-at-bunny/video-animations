import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { LIGHT, FONT } from "./light";
import { PillarIcon } from "./PillarIcon";

const W = 340;
const H = 200;

// A clean light card — icon over label — that blur-fades in.
export const PillarCard: React.FC<{
  x: number;
  y: number;
  appear: number;
  icon: string;
  label: string;
}> = ({ x, y, appear, icon, label }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - appear;
  if (local < -2) return null;

  const enter = spring({ frame: local, fps, config: { damping: 16, mass: 0.7 }, durationInFrames: 26 });

  return (
    <div
      style={{
        position: "absolute",
        left: x - W / 2,
        top: y - H / 2,
        width: W,
        height: H,
        opacity: enter,
        transform: `scale(${interpolate(enter, [0, 1], [0.85, 1])})`,
        borderRadius: 18,
        border: `1px solid ${LIGHT.border}`,
        background: LIGHT.card,
        boxShadow: LIGHT.shadow,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
      }}
    >
      <PillarIcon id={icon} size={62} />
      <span
        style={{
          fontFamily: FONT,
          color: LIGHT.text,
          fontSize: 26,
          fontWeight: 600,
          letterSpacing: "0.01em",
        }}
      >
        {label}
      </span>
    </div>
  );
};
