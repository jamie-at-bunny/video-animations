import { useCurrentFrame, interpolate, Easing } from "remotion";
import { LAYOUT, brandA, inkA } from "@/shared/theme";
import { BunnyLogo } from "@/shared/brand";

const H = LAYOUT.shieldBottom - LAYOUT.shieldTop;
const LOGO_W = 210;
const LOGO_H = LOGO_W * (42.71 / 148.17);

// The glowing Bunny Edge layer — a vertical brand-orange energy barrier that
// ignites, then continuously shimmers while intercepting traffic. The
// bunny.net logo crowns the barrier.
export const Shield: React.FC = () => {
  const frame = useCurrentFrame();

  const ignite = interpolate(frame, [34, 64], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const fade = interpolate(frame, [184, 206], [1, 0.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pulse = 0.85 + 0.15 * Math.sin(frame * 0.18);
  const intensity = ignite * fade;

  return (
    <>
      {/* the beam (vertically scales up as it ignites) */}
      <div
        style={{
          position: "absolute",
          left: LAYOUT.shieldX,
          top: LAYOUT.shieldTop,
          height: H,
          transform: `translateX(-50%) scaleY(${0.3 + 0.7 * ignite})`,
          transformOrigin: "center",
          opacity: intensity,
        }}
      >
        {/* wide soft halo */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            height: "100%",
            width: 130,
            transform: "translateX(-50%)",
            background: `radial-gradient(ellipse 64px 50% at center, ${brandA(0.3)}, ${brandA(0)} 70%)`,
            opacity: pulse,
          }}
        />
        {/* bright core line */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            height: "100%",
            width: 3,
            transform: "translateX(-50%)",
            background: `linear-gradient(to bottom, ${brandA(0)}, #FFB088 12%, #FF9157 50%, #FFB088 88%, ${brandA(0)})`,
            boxShadow: `0 0 ${10 + 14 * pulse}px ${2 + 3 * pulse}px ${brandA(0.85)}`,
          }}
        />
        {/* travelling scan highlight along the barrier */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: `${(0.5 + 0.5 * Math.sin(frame * 0.07)) * 100}%`,
            width: 7,
            height: 90,
            transform: "translate(-50%,-50%)",
            borderRadius: 4,
            background: "#FFCBA8",
            filter: "blur(3px)",
            opacity: 0.55 * intensity,
          }}
        />
      </div>

      {/* bunny.net logo crowning the barrier (kept crisp, not beam-scaled) */}
      <BunnyLogo
        width={LOGO_W}
        style={{
          position: "absolute",
          left: LAYOUT.shieldX - LOGO_W / 2,
          top: LAYOUT.shieldTop - LOGO_H - 30 + (1 - ignite) * 10,
          height: LOGO_H,
          opacity: intensity,
          filter: `drop-shadow(0 0 14px ${inkA(0.25)}) drop-shadow(0 0 10px ${brandA(0.4)})`,
        }}
      />
    </>
  );
};
