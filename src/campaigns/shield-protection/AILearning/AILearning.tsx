import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Easing,
} from "remotion";
import { COLORS, brandA, inkA } from "@/shared/theme";
import { rand } from "@/shared/util";
import { SceneTransition } from "@/shared/SceneTransition";

export const AILEARNING_DURATION = 210; // 7s

const CX = 960;
const CY = 540;
const TICKS_Y = 720;

// classic 4-point sparkle, centred in a 24x24 box
const SPARKLE = "M12 1 C12.7 9 15 11.3 23 12 C15 12.7 12.7 15 12 23 C11.3 15 9 12.7 1 12 C9 11.3 11.3 9 12 1 Z";

// the circle's current radius (grows as it absorbs / learns)
const radiusAt = (frame: number) => interpolate(frame, [10, 196], [70, 102], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) + Math.sin(frame * 0.18) * 3;

// Data bits flying in from all directions and being absorbed.
const BITS = Array.from({ length: 28 }, (_, i) => {
  const r1 = rand(i * 3 + 1);
  const r2 = rand(i * 3 + 2);
  const r3 = rand(i * 3 + 3);
  return {
    angle: r1 * Math.PI * 2,
    startDist: 360 + r2 * 320,
    launch: 6 + i * 6.6,
    travel: 30 + Math.round(r3 * 16),
    size: 4 + Math.round(r2 * 5),
  };
});

const DataBits: React.FC = () => {
  const frame = useCurrentFrame();
  const edge = radiusAt(frame) + 2;
  return (
    <>
      {BITS.map((b, i) => {
        const t = (frame - b.launch) / b.travel;
        if (t < 0 || t > 1) return null;
        const dist = interpolate(Easing.in(Easing.quad)(t), [0, 1], [b.startDist, edge]);
        const x = CX + Math.cos(b.angle) * dist;
        const y = CY + Math.sin(b.angle) * dist;
        const opacity = interpolate(t, [0, 0.12, 0.82, 1], [0, 0.9, 0.9, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: b.size,
              height: b.size,
              marginLeft: -b.size / 2,
              marginTop: -b.size / 2,
              borderRadius: "50%",
              background: inkA(0.85),
              opacity,
            }}
          />
        );
      })}
    </>
  );
};

const AICore: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 18, mass: 0.8 }, durationInFrames: 22 });
  const R = radiusAt(frame);
  const pulse = 0.85 + 0.15 * Math.sin(frame * 0.18);

  return (
    <div
      style={{
        position: "absolute",
        left: CX - R,
        top: CY - R,
        width: R * 2,
        height: R * 2,
        borderRadius: "50%",
        border: `2px solid ${COLORS.brand}`,
        background: "rgba(18,20,63,0.88)",
        boxShadow: `0 0 ${26 + 16 * pulse}px ${brandA(0.6)}, inset 0 0 30px ${brandA(0.22)}`,
        opacity: enter,
        transform: `scale(${interpolate(enter, [0, 1], [0.6, 1])})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* classic double sparkle (big + small offset upper-left) */}
      <div style={{ position: "relative", width: 120, height: 100 }}>
        <svg width={70} height={70} viewBox="0 0 24 24" style={{ position: "absolute", left: 42, top: 26 }}>
          <path d={SPARKLE} fill={COLORS.brand} />
        </svg>
        <svg width={34} height={34} viewBox="0 0 24 24" style={{ position: "absolute", left: 8, top: 6 }}>
          <path d={SPARKLE} fill={COLORS.brand} />
        </svg>
      </div>
    </div>
  );
};

// 7-day learning ticks, centred under the circle.
const DayTicks: React.FC = () => {
  const frame = useCurrentFrame();
  const W = 40;
  const GAP = 10;
  const total = 7 * W + 6 * GAP;
  const startX = CX - total / 2;
  return (
    <>
      {Array.from({ length: 7 }).map((_, i) => {
        const on = interpolate(frame, [20 + i * 13, 20 + i * 13 + 10], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div key={i} style={{ position: "absolute", left: startX + i * (W + GAP), top: TICKS_Y, width: W, height: 7, borderRadius: 4, background: inkA(0.14) }}>
            <div style={{ width: `${on * 100}%`, height: "100%", borderRadius: 4, background: COLORS.brand, boxShadow: `0 0 8px ${brandA(0.6)}` }} />
          </div>
        );
      })}
    </>
  );
};

// "AI learning mode" — data flies into the AI core, which grows as it learns.
export const AILearning: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
    <SceneTransition>
      <DataBits />
      <AICore />
      <DayTicks />
    </SceneTransition>
  </AbsoluteFill>
);
