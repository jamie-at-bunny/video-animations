import { useCurrentFrame, interpolate } from "remotion";
import { GOOD, GoodReq, goodProgress, goodPos, T_SHIELD } from "@/shared/util";
import { COLORS, brandA } from "@/shared/theme";

// One legitimate request: a warm orange comet that flies straight through the
// shield without slowing, then lands at the site.
const Comet: React.FC<{ req: GoodReq }> = ({ req }) => {
  const frame = useCurrentFrame();
  if (frame < req.launch - 2) return null;

  const t = goodProgress(req, frame);
  const { x, y } = goodPos(req, t);

  // fade in just after launch, fade out as it lands
  const opacity = interpolate(t, [0, 0.05, 0.92, 1], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // bright spark exactly as it passes through the barrier
  const cross = interpolate(t, [T_SHIELD - 0.045, T_SHIELD, T_SHIELD + 0.06], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const trail = [1, 2, 3, 4].map((k) => goodPos(req, Math.max(0, t - 0.02 * k)));

  return (
    <>
      {/* pass-through spark on the shield */}
      {cross > 0.01 && (
        <div
          style={{
            position: "absolute",
            left: x,
            top: y,
            width: 46,
            height: 46,
            marginLeft: -23,
            marginTop: -23,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${brandA(0.8 * cross)}, ${brandA(0)} 70%)`,
            opacity,
          }}
        />
      )}

      {/* trail */}
      {trail.map((p, i) => {
        const s = req.size - 2 - i * 1.6;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.x,
              top: p.y,
              width: s,
              height: s,
              marginLeft: -s / 2,
              marginTop: -s / 2,
              borderRadius: "50%",
              background: COLORS.brand,
              opacity: opacity * (0.3 - i * 0.06),
              filter: "blur(2px)",
            }}
          />
        );
      })}

      {/* head */}
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: req.size,
          height: req.size,
          marginLeft: -req.size / 2,
          marginTop: -req.size / 2,
          borderRadius: "50%",
          background: COLORS.brand,
          opacity,
          boxShadow: `0 0 10px 3px ${brandA(0.9)}, 0 0 28px 8px ${brandA(0.4)}`,
        }}
      />
    </>
  );
};

export const GoodTraffic: React.FC = () => (
  <>
    {GOOD.map((r) => (
      <Comet key={r.id} req={r} />
    ))}
  </>
);
