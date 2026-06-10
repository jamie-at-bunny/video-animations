import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { LIGHT } from "./light";

const STAR =
  "M12 2 L14.6 8.6 L21.5 9 L16.2 13.4 L18 20.2 L12 16.4 L6 20.2 L7.8 13.4 L2.5 9 L9.4 8.6 Z";

// The 12-star EU circle — a recognisable "European" motif.
export const EUStars: React.FC<{ cx: number; cy: number; radius?: number; appear?: number }> = ({
  cx,
  cy,
  radius = 120,
  appear = 12,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <>
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
        const x = cx + Math.cos(a) * radius;
        const y = cy + Math.sin(a) * radius;
        const local = frame - (appear + i * 2);
        const enter = spring({ frame: local, fps, config: { damping: 16, mass: 0.6 }, durationInFrames: 20 });
        if (local < -2) return null;
        return (
          <svg
            key={i}
            width={34}
            height={34}
            viewBox="0 0 24 24"
            style={{
              position: "absolute",
              left: x - 17,
              top: y - 17,
              opacity: enter,
              transform: `scale(${interpolate(enter, [0, 1], [0.3, 1])})`,
              filter: `drop-shadow(0 0 6px ${LIGHT.accent}55)`,
            }}
          >
            <path d={STAR} fill={LIGHT.accent} />
          </svg>
        );
      })}
    </>
  );
};
