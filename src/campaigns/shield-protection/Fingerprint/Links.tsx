import { useCurrentFrame, interpolate, Easing } from "remotion";
import { WIDTH, HEIGHT, brandA } from "@/shared/theme";
import { COORDINATED, LINKS_IN } from "./data";

// Orange links connecting the coordinated attackers — same fingerprint,
// different sources — drawn after the scan resolves them.
export const Links: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < LINKS_IN - 2) return null;

  const pulse = 0.6 + 0.4 * Math.sin(frame * 0.18);

  // chain the coordinated tiles together
  const segs = COORDINATED.slice(0, -1).map((t, i) => ({ a: t, b: COORDINATED[i + 1] }));

  return (
    <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0 }}>
      {segs.map((s, i) => {
        const draw = interpolate(frame, [LINKS_IN + i * 8, LINKS_IN + i * 8 + 18], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        });
        const x2 = s.a.x + (s.b.x - s.a.x) * draw;
        const y2 = s.a.y + (s.b.y - s.a.y) * draw;
        return (
          <line
            key={i}
            x1={s.a.x}
            y1={s.a.y}
            x2={x2}
            y2={y2}
            stroke={brandA(0.7 * pulse)}
            strokeWidth={2}
            strokeDasharray="4 6"
            style={{ filter: `drop-shadow(0 0 5px ${brandA(0.5)})` }}
          />
        );
      })}
    </svg>
  );
};
