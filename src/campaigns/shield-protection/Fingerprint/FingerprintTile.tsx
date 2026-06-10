import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS, inkA, brandA } from "@/shared/theme";
import { Tile, scanX, scannedAt } from "./data";

const T = 92; // tile size
const PAD = 24;
const STEP = 22;
const DOT = 5.5;

// Small glyph marking the detected threat type.
const TypeGlyph: React.FC<{ type: Tile["type"] }> = ({ type }) => {
  const s = { fill: "none", stroke: COLORS.brand, strokeWidth: 1.7, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
  const box = { width: 16, height: 16, viewBox: "0 0 16 16" };
  switch (type) {
    case "bot":
      return (
        <svg {...box}>
          <rect x={3} y={5} width={10} height={8} rx={1.6} {...s} />
          <line x1={8} y1={2} x2={8} y2={5} {...s} />
          <circle cx={6} cy={9} r={0.9} fill={COLORS.brand} stroke="none" />
          <circle cx={10} cy={9} r={0.9} fill={COLORS.brand} stroke="none" />
        </svg>
      );
    case "scanner":
      return (
        <svg {...box}>
          <circle cx={7} cy={7} r={4} {...s} />
          <line x1={10} y1={10} x2={14} y2={14} {...s} />
        </svg>
      );
    case "coordinated":
      return (
        <svg {...box}>
          <circle cx={4} cy={8} r={2} {...s} />
          <circle cx={12} cy={8} r={2} {...s} />
          <line x1={6} y1={8} x2={10} y2={8} {...s} />
        </svg>
      );
    case "abusive":
    default:
      return (
        <svg {...box}>
          <path d="M8 2 L15 14 H1 Z" {...s} />
          <line x1={8} y1={6} x2={8} y2={10} {...s} />
          <circle cx={8} cy={12} r={0.7} fill={COLORS.brand} stroke="none" />
        </svg>
      );
  }
};

export const FingerprintTile: React.FC<{ tile: Tile }> = ({ tile }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - tile.appear;
  if (local < -2) return null;

  const enter = spring({ frame: local, fps, config: { damping: 14, mass: 0.7 }, durationInFrames: 22 });

  // scan flash as the sweep passes this tile's column
  const flash = interpolate(Math.abs(scanX(frame) - tile.x), [0, 55], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // malicious tiles get flagged once the scan has crossed them
  const malicious = tile.type !== "legit";
  const tsf = scannedAt(tile.x);
  const flag = malicious
    ? interpolate(frame, [tsf, tsf + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;
  const flagPulse = 0.85 + 0.15 * Math.sin(frame * 0.2);

  const dots = [0, 1, 2].flatMap((r) =>
    [0, 1, 2].map((c) => ({ on: tile.pattern[r * 3 + c], cx: PAD + c * STEP, cy: PAD + r * STEP })),
  );

  return (
    <div
      style={{
        position: "absolute",
        left: tile.x - T / 2,
        top: tile.y - T / 2,
        width: T,
        height: T,
        opacity: enter,
        transform: `scale(${interpolate(enter, [0, 1], [0.6, 1])})`,
        transformOrigin: "center",
        borderRadius: 12,
        border: `1.5px solid ${inkA(0.35 + flash * 0.4)}`,
        background: "rgba(34,61,106,0.4)",
        boxShadow: flag > 0 ? `0 0 ${18 * flag * flagPulse}px ${brandA(0.5 * flag)}` : "none",
      }}
    >
      {/* flagged ring overlay */}
      {flag > 0 && (
        <div
          style={{
            position: "absolute",
            inset: -1.5,
            borderRadius: 12,
            border: `2px solid ${COLORS.brand}`,
            opacity: flag * flagPulse,
          }}
        />
      )}

      {/* fingerprint signature */}
      <svg width={T} height={T} style={{ position: "absolute", inset: 0 }}>
        {dots.map((d, i) => (
          <g key={i}>
            <circle cx={d.cx} cy={d.cy} r={DOT} fill={COLORS.ink} opacity={d.on ? 0.85 * (1 - flag) : 0.16} />
            {d.on && <circle cx={d.cx} cy={d.cy} r={DOT} fill={COLORS.brand} opacity={0.95 * flag} />}
          </g>
        ))}
      </svg>

      {/* type glyph badge */}
      {flag > 0 && (
        <div style={{ position: "absolute", right: -8, top: -8, opacity: flag, filter: `drop-shadow(0 0 5px ${brandA(0.7)})` }}>
          <TypeGlyph type={tile.type} />
        </div>
      )}
    </div>
  );
};
