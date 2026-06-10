import { interpolate } from "remotion";

// An expanding, fading ring — the "rejected / impact" beat. Drives off a 0..1
// progress value so callers own the timing. Circle by default; pass height for a pill.
export const ImpactRing: React.FC<{
  x: number;
  y: number;
  width: number;
  height?: number;
  progress: number; // 0..1
  color: string;
  borderWidth?: number;
  fromScale?: number;
  toScale?: number;
  fromOpacity?: number;
  glow?: string; // optional box-shadow colour
}> = ({ x, y, width, height, progress, color, borderWidth = 2, fromScale = 0.5, toScale = 2, fromOpacity = 0.85, glow }) => {
  if (progress <= 0 || progress >= 1) return null;
  const h = height ?? width;
  const scale = interpolate(progress, [0, 1], [fromScale, toScale]);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height: h,
        marginLeft: -width / 2,
        marginTop: -h / 2,
        borderRadius: h / 2,
        border: `${borderWidth}px solid ${color}`,
        boxShadow: glow ? `0 0 12px ${glow}` : undefined,
        transform: `scale(${scale})`,
        opacity: fromOpacity * (1 - progress),
      }}
    />
  );
};
