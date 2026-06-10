import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS, FONT, brandA } from "@/shared/theme";
import { STAT_IN } from "./data";

const TEXT_DIM = "rgba(18,20,63,0.6)";

// Big "sub-1ms at the edge" stat on the right, beside the feature stack.
export const EdgeStat: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - STAT_IN;
  if (local < -2) return null;

  const enter = spring({ frame: local, fps, config: { damping: 16, mass: 0.9 }, durationInFrames: 28 });
  const scale = interpolate(enter, [0, 1], [0.85, 1]);

  return (
    <div
      style={{
        position: "absolute",
        left: 720,
        right: 70,
        top: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
        opacity: enter,
        transform: `scale(${scale})`,
      }}
    >
      <span
        style={{
          fontFamily: FONT,
          color: COLORS.brand,
          fontSize: 230,
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: "0.005em",
          textShadow: `0 0 60px ${brandA(0.45)}`,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {"<1"}
        <span style={{ fontSize: 96, fontWeight: 500 }}>ms</span>
      </span>
      <span
        style={{
          fontFamily: FONT,
          color: TEXT_DIM,
          fontSize: 30,
          fontWeight: 500,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
        }}
      >
        Latency at the edge
      </span>
    </div>
  );
};
