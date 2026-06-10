import { useCurrentFrame, interpolate, spring, useVideoConfig, Easing } from "remotion";
import { Glow } from "@/shared/Glow";
import { ImpactRing } from "@/shared/ImpactRing";
import { BunnyLogo } from "@/shared/brand";
import { LightStage } from "./LightStage";
import { LIGHT, FONT, accentA } from "./light";
import { PillarIcon } from "./PillarIcon";

export const ONELAYER_DURATION = 210; // 7s

const CX = 960;
const CY = 540;

const BUBBLE_W = 430;
const BUBBLE_H = 150;

const APPEAR_A = 4;
const APPEAR_B = 12;
const MERGE_S = 24;
const MERGE_E = 58;
const LABEL_OUT_S = 38; // source icon+labels fade as they merge
const LABEL_OUT_E = 56;
const EXPAND_S = 54; // blob widens into the pill
const EXPAND_E = 92;
const BLOB_EXIT_S = 92; // gooey blob firms up into the crisp bubble here
const BLOB_EXIT_E = 116;
const BUBBLE_S = 92;
const GLOW_S = 116; // orange glow blooms with the bubble + logo

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const useTimeline = () => {
  const frame = useCurrentFrame();
  const merge = interpolate(frame, [MERGE_S, MERGE_E], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const expand = interpolate(frame, [EXPAND_S, EXPAND_E], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  // start further apart so the travel + necking is clearly visible
  const yA = lerp(366, CY, merge);
  const yB = lerp(714, CY, merge);
  // expand into the EXACT final bubble footprint so it solidifies in place
  const w = lerp(190, BUBBLE_W, expand);
  const h = lerp(190, BUBBLE_H, expand);
  return { frame, yA, yB, w, h };
};

const Blob: React.FC<{ y: number; w: number; h: number; appear: number }> = ({ y, w, h, appear }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - appear, fps, config: { damping: 16, mass: 0.7 }, durationInFrames: 22 });
  // gooey blob firms up (crossfades) into the crisp bubble at the same footprint
  const exit = interpolate(frame, [BLOB_EXIT_S, BLOB_EXIT_E], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        left: CX - w / 2,
        top: y - h / 2,
        width: w,
        height: h,
        borderRadius: h / 2,
        background: "#FFFFFF",
        transform: `scale(${interpolate(enter, [0, 1], [0.3, 1])})`,
        transformOrigin: "center",
        opacity: enter * exit,
      }}
    />
  );
};

const SourceLabel: React.FC<{ y: number; icon: string; label: string; appear: number }> = ({ y, icon, label, appear }) => {
  const frame = useCurrentFrame();
  const enterO = interpolate(frame, [appear, appear + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const outO = interpolate(frame, [LABEL_OUT_S, LABEL_OUT_E], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = enterO * outO;
  if (opacity <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: CX - 110,
        top: y - 60,
        width: 220,
        height: 120,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        opacity,
      }}
    >
      <PillarIcon id={icon} size={42} color={LIGHT.text} />
      <span style={{ fontFamily: FONT, color: LIGHT.text, fontSize: 22, fontWeight: 600 }}>{label}</span>
    </div>
  );
};

// Orange glow that blooms in after the bubble has formed and the logo placed.
const BubbleGlow: React.FC = () => {
  const frame = useCurrentFrame();
  const glowIn = interpolate(frame, [GLOW_S, GLOW_S + 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  if (glowIn <= 0) return null;
  const pulse = 0.9 + 0.1 * Math.sin(frame * 0.16);
  const s = interpolate(glowIn, [0, 1], [0.65, 1]);
  return <Glow x={CX} y={CY} radius={360} color={accentA} alpha={0.42 * pulse} edgeStop={58} opacity={glowIn} scale={s} />;
};

// The gooey blob solidifies — in place, same footprint — into the crisp
// bunny.net bubble. A logo + impact ring give the moment its energy.
const FinalBubble: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < BUBBLE_S - 2) return null;

  // crossfade from the soft goo blob to the crisp bordered bubble (no scale pop)
  const solidify = interpolate(frame, [BUBBLE_S, BUBBLE_S + 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const logo = interpolate(frame, [BUBBLE_S + 8, BUBBLE_S + 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // one-shot impact ring at the moment it solidifies
  const ringT = interpolate(frame, [BUBBLE_S + 2, BUBBLE_S + 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <>
      <ImpactRing
        x={CX}
        y={CY}
        width={BUBBLE_W}
        height={BUBBLE_H}
        progress={ringT}
        color={accentA(0.9)}
        borderWidth={3}
        fromScale={1}
        toScale={1.5}
        fromOpacity={0.85}
      />
      <div
        style={{
          position: "absolute",
          left: CX - BUBBLE_W / 2,
          top: CY - BUBBLE_H / 2,
          width: BUBBLE_W,
          height: BUBBLE_H,
          borderRadius: BUBBLE_H / 2,
          background: "#FFFFFF",
          border: `1px solid rgba(18,20,63,${0.08 * solidify})`,
          boxShadow: `0 18px 40px rgba(18,20,63,${0.16 * solidify})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: solidify,
        }}
      >
        <BunnyLogo variant="dark" width={250} style={{ opacity: logo }} />
      </div>
    </>
  );
};

// "One layer" — delivery + protection blobs gooily merge into a single layer.
export const OneLayer: React.FC = () => {
  const { yA, yB, w, h } = useTimeline();
  return (
    <LightStage>
      {/* goo filter definition */}
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <defs>
          <filter id="onelayer-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="22" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -11" result="goo" />
          </filter>
        </defs>
      </svg>

      {/* orange glow — blooms after the bubble forms */}
      <BubbleGlow />

      {/* gooey blob layer */}
      <div style={{ position: "absolute", inset: 0, filter: "url(#onelayer-goo) drop-shadow(0 12px 26px rgba(18,20,63,0.16))" }}>
        <Blob y={yA} w={w} h={h} appear={APPEAR_A} />
        <Blob y={yB} w={w} h={h} appear={APPEAR_B} />
      </div>

      {/* crisp labels on top */}
      <SourceLabel y={yA} icon="delivery" label="Delivery" appear={APPEAR_A} />
      <SourceLabel y={yB} icon="protection" label="Protection" appear={APPEAR_B} />
      <FinalBubble />
    </LightStage>
  );
};
