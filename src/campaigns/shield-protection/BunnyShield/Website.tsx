import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { LAYOUT, COLORS, inkA, brandA } from "@/shared/theme";

// The protected site assembling quickly once the request arrives.
const W = 300;
const H = 220;

const blocks = [
  { x: 18, y: 18, w: 120, h: 16, at: 0 }, // logo/header
  { x: 162, y: 20, w: 120, h: 12, at: 2 }, // nav
  { x: 18, y: 52, w: 264, h: 70, at: 5 }, // hero
  { x: 18, y: 134, w: 80, h: 70, at: 9 }, // card
  { x: 110, y: 134, w: 80, h: 70, at: 11 }, // card
  { x: 202, y: 134, w: 80, h: 70, at: 13 }, // card
];

export const Website: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = 84;
  const local = frame - start;

  const frameIn = spring({
    frame: local,
    fps,
    config: { damping: 200 },
    durationInFrames: 22,
  });
  if (local < -5) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: LAYOUT.site.x - W / 2,
        top: LAYOUT.site.y - H / 2,
        width: W,
        height: H,
        opacity: frameIn,
        transform: `scale(${interpolate(frameIn, [0, 1], [0.85, 1])})`,
        transformOrigin: "center",
        border: `1.5px solid ${inkA(0.5)}`,
        borderRadius: 14,
        background: inkA(0.04),
        // soft Bunny-orange glow: the site is protected & delivered fast
        boxShadow: `0 0 55px ${brandA(0.2)}`,
        overflow: "hidden",
      }}
    >
      {blocks.map((b, i) => {
        const o = interpolate(local, [b.at, b.at + 8], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: b.x,
              top: b.y,
              width: b.w,
              height: b.h,
              borderRadius: 6,
              background: i === 2 ? inkA(0.5) : COLORS.steel,
              border: `1px solid ${inkA(0.15)}`,
              opacity: o,
              transform: `translateY(${interpolate(o, [0, 1], [8, 0])}px)`,
            }}
          />
        );
      })}
    </div>
  );
};
