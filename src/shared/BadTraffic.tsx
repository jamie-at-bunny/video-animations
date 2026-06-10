import { useCurrentFrame, interpolate, Easing } from "remotion";
import { RED, redA } from "./theme";
import { rand } from "./util";
import { ImpactRing } from "./ImpactRing";

// Shared "bad request" motion: a red dot flies in along a line, is rejected at an
// impact point, then bounces back arcing under gravity. Used by Frictionless,
// UnifiedEdge and any future "rejected traffic" scene.

export const BAD_APPROACH = 28; // frames flying in toward the gate
export const BAD_BOUNCE = 42; // frames bouncing away after rejection
export const BAD_GRAVITY = 300; // downward arc on the bounce

export type BadDef = { launch: number; vx: number; vy: number; size: number };

// Deterministic fleet of bad requests. `start` is the first launch frame, `step`
// the spacing between launches.
export const makeBads = (count: number, start: number, step: number): BadDef[] =>
  Array.from({ length: count }, (_, i) => {
    const r1 = rand(i * 2 + 1);
    const r2 = rand(i * 2 + 2);
    const r3 = rand(i * 7 + 5);
    return {
      launch: start + i * step,
      vx: 70 + r1 * 160, // leftward speed
      vy: (r2 - 0.5) * 760, // initial vertical (up or down)
      size: 12 + Math.round(r3 * 8),
    };
  });

// The frame each bad request strikes the gate — drive gate/shield flashes off this.
export const impactFrames = (bads: BadDef[]): number[] => bads.map((b) => b.launch + BAD_APPROACH);

// A single bad request travelling `startX` → `impactX` along `y`, then bouncing back.
export const BadDot: React.FC<{ def: BadDef; startX: number; impactX: number; y: number }> = ({
  def,
  startX,
  impactX,
  y,
}) => {
  const frame = useCurrentFrame();
  const age = frame - def.launch;
  if (age < 0 || age > BAD_APPROACH + BAD_BOUNCE) return null;

  let x: number;
  let yy: number;
  let opacity: number;
  if (age < BAD_APPROACH) {
    const t = Easing.in(Easing.quad)(age / BAD_APPROACH);
    x = startX + (impactX - startX) * t;
    yy = y;
    opacity = interpolate(age, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  } else {
    const tau = (age - BAD_APPROACH) / BAD_BOUNCE;
    x = impactX - def.vx * tau; // reflect back
    yy = y + def.vy * tau + BAD_GRAVITY * tau * tau; // arc up or down
    opacity = 1 - tau;
  }

  const ringT = interpolate(age, [BAD_APPROACH, BAD_APPROACH + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <>
      <ImpactRing x={impactX} y={y} width={34} progress={ringT} color={redA(0.9)} fromScale={0.5} toScale={2} />
      <div
        style={{
          position: "absolute",
          left: x,
          top: yy,
          width: def.size,
          height: def.size,
          marginLeft: -def.size / 2,
          marginTop: -def.size / 2,
          borderRadius: "50%",
          background: RED,
          opacity,
          boxShadow: `0 0 9px 2px ${redA(0.8)}`,
        }}
      />
    </>
  );
};
