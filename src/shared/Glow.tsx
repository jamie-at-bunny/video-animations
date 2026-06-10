import { brandA } from "./theme";

// Soft radial glow — the "bubble of light" behind a focal element. Centred on (x, y).
export const Glow: React.FC<{
  x: number;
  y: number;
  radius: number; // glow extends this far from the centre
  color?: (a: number) => string; // alpha → rgba string; defaults to brand orange
  alpha?: number; // core alpha
  edgeStop?: number; // % of the radius where it has fully faded
  whiteCore?: boolean; // include a faint white core (warm bloom look)
  opacity?: number;
  scale?: number;
  style?: React.CSSProperties;
}> = ({ x, y, radius, color = brandA, alpha = 0.16, edgeStop = 60, whiteCore = false, opacity = 1, scale = 1, style }) => {
  const gradient = whiteCore
    ? `radial-gradient(circle, ${color(alpha)}, rgba(255,255,255,0.05) 30%, rgba(0,0,0,0) ${edgeStop}%)`
    : `radial-gradient(circle, ${color(alpha)}, ${color(0)} ${edgeStop}%)`;
  return (
    <div
      style={{
        position: "absolute",
        left: x - radius,
        top: y - radius,
        width: radius * 2,
        height: radius * 2,
        borderRadius: "50%",
        background: gradient,
        opacity,
        transform: scale === 1 ? undefined : `scale(${scale})`,
        ...style,
      }}
    />
  );
};
