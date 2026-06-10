import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Easing } from "remotion";
import { FONT } from "@/shared/theme";
import { SceneTransition } from "@/shared/SceneTransition";

export const STATS_DURATION = 210; // 7s

// Chroma-key green background so the numbers can be keyed out.
const GREEN_BG = "#00B140";
// Numbers sit in the lower third.
const ROW_TOP = 760;
const ROW_H = 240;
const whiteA = (a: number) => `rgba(255,255,255,${a})`;

type Stat = { x: number; target: number; dec: number; suffix: string; label: string; appear: number };

const STATS: Stat[] = [
  { x: 250, target: 119, dec: 0, suffix: "", label: "Scrubbing centers", appear: 16 },
  { x: 723, target: 250, dec: 0, suffix: "Tbps+", label: "Network capacity", appear: 28 },
  { x: 1197, target: 1.5, dec: 1, suffix: "M", label: "Protected sites", appear: 40 },
  { x: 1670, target: 4.2, dec: 1, suffix: "Tbps", label: "Peak attack stopped", appear: 52 },
];

const StatBlock: React.FC<{ s: Stat }> = ({ s }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - s.appear;
  if (local < -2) return null;

  const enter = spring({ frame: local, fps, config: { damping: 18, mass: 0.7 }, durationInFrames: 20 });
  const v = interpolate(frame, [s.appear, s.appear + 54], [0, s.target], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div
      style={{
        position: "absolute",
        left: s.x - 220,
        top: ROW_TOP,
        height: ROW_H,
        width: 440,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 14,
        opacity: enter,
        transform: `scale(${interpolate(enter, [0, 1], [0.85, 1])})`,
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          color: "#FFFFFF",
          fontSize: 108,
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: "0.005em",
          fontVariantNumeric: "tabular-nums",
          whiteSpace: "nowrap",
        }}
      >
        {v.toFixed(s.dec)}
        {s.suffix && <span style={{ fontSize: 46, fontWeight: 600, marginLeft: 4 }}>{s.suffix}</span>}
      </div>
      <div
        style={{
          fontFamily: FONT,
          color: whiteA(0.85),
          fontSize: 22,
          fontWeight: 500,
          letterSpacing: "0.26em",
          textTransform: "uppercase",
        }}
      >
        {s.label}
      </div>
    </div>
  );
};

// Scale & reliability stats — the numbers count up.
export const Stats: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: GREEN_BG }}>
    <SceneTransition>
      {STATS.map((s) => (
        <StatBlock key={s.label} s={s} />
      ))}
    </SceneTransition>
  </AbsoluteFill>
);
