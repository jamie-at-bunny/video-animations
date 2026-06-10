import { useCurrentFrame, interpolate, Easing } from "remotion";
import { THREATS, Threat, lerp, rand } from "@/shared/util";
import { LAYOUT, RED, redA } from "@/shared/theme";
import { ImpactRing } from "@/shared/ImpactRing";

const DISSOLVE = 10; // frames a threat takes to disintegrate at the shield

const ThreatItem: React.FC<{ t: Threat }> = ({ t }) => {
  const frame = useCurrentFrame();
  const age = frame - t.spawn;
  if (age < 0 || age > t.travel + DISSOLVE) return null;

  const p = Math.min(age / t.travel, 1);
  const eased = Easing.in(Easing.quad)(p);

  const x = lerp(t.startX, LAYOUT.shieldX, eased);
  const y = lerp(t.startY, t.targetY, eased);

  const fadeIn = interpolate(age, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (p < 1) {
    // travelling toward the shield — a red (rejected) request
    const size = 12 + Math.round(rand(t.id * 5 + 2) * 6);
    return (
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2,
          borderRadius: "50%",
          background: RED,
          opacity: fadeIn * 0.95,
          boxShadow: `0 0 9px 2px ${redA(0.75)}`,
        }}
      />
    );
  }

  // reached the shield -> dissolve into scattering particles + impact ring
  const dage = age - t.travel;
  const d = dage / DISSOLVE; // 0..1
  const particles = 7;

  return (
    <div style={{ position: "absolute", left: LAYOUT.shieldX, top: t.targetY }}>
      {/* impact ring as the shield rejects the request */}
      <ImpactRing
        x={0}
        y={0}
        width={40}
        progress={d}
        color={RED}
        glow={redA(0.6)}
        fromScale={0.3}
        toScale={2.4}
        fromOpacity={0.85}
      />
      {/* scatter particles */}
      {Array.from({ length: particles }).map((_, i) => {
        const ang = (i / particles) * Math.PI * 2 + rand(t.id * 7 + i);
        const dist = lerp(0, 46, Easing.out(Easing.quad)(d)) * (0.6 + rand(t.id + i) * 0.6);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: Math.cos(ang) * dist,
              top: Math.sin(ang) * dist,
              width: 4,
              height: 4,
              marginLeft: -2,
              marginTop: -2,
              borderRadius: "50%",
              background: RED,
              opacity: (1 - d) * 0.9,
            }}
          />
        );
      })}
    </div>
  );
};

export const Threats: React.FC = () => (
  <>
    {THREATS.map((t) => (
      <ThreatItem key={t.id} t={t} />
    ))}
  </>
);
