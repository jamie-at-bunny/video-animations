import { LIGHT } from "./light";

// Line glyphs for the value pillars (orange accent on white cards).
export const PillarIcon: React.FC<{ id: string; size?: number; color?: string }> = ({
  id,
  size = 60,
  color = LIGHT.accent,
}) => {
  const c = { width: size, height: size, viewBox: "0 0 30 30" };
  const S = { fill: "none", stroke: color, strokeWidth: 2, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
  switch (id) {
    case "delivery": // paper plane
      return (
        <svg {...c}>
          <path {...S} d="M27 4 L3 13 L12 16 L15 25 L27 4 Z" />
          <path {...S} d="M12 16 L27 4" />
        </svg>
      );
    case "protection": // shield
      return (
        <svg {...c}>
          <path {...S} d="M15 3 L25 7 V15 C25 22 20 26 15 27 C10 26 5 22 5 15 V7 Z" />
        </svg>
      );
    case "layer": // single unified bar / stacked layers merged
      return (
        <svg {...c}>
          <path {...S} d="M15 4 L26 9 L15 14 L4 9 Z" />
          <path {...S} d="M4 15 L15 20 L26 15" />
        </svg>
      );
    case "infrastructure": // server stack
      return (
        <svg {...c}>
          <rect x={5} y={6} width={20} height={7} rx={1.5} {...S} />
          <rect x={5} y={17} width={20} height={7} rx={1.5} {...S} />
          <circle cx={9} cy={9.5} r={1} fill={color} stroke="none" />
          <circle cx={9} cy={20.5} r={1} fill={color} stroke="none" />
        </svg>
      );
    case "privacy": // padlock
      return (
        <svg {...c}>
          <rect x={6} y={13} width={18} height={13} rx={2} {...S} />
          <path {...S} d="M10 13 V9 a5 5 0 0 1 10 0 V13" />
          <circle cx={15} cy={19} r={1.4} fill={color} stroke="none" />
        </svg>
      );
    case "transparency": // eye
      return (
        <svg {...c}>
          <path {...S} d="M3 15 C7 8 23 8 27 15 C23 22 7 22 3 15 Z" />
          <circle cx={15} cy={15} r={3.5} {...S} />
        </svg>
      );
    case "clean": // sparkle
      return (
        <svg {...c}>
          <path {...S} d="M15 4 C15.5 11 19 14.5 26 15 C19 15.5 15.5 19 15 26 C14.5 19 11 15.5 4 15 C11 14.5 14.5 11 15 4 Z" />
        </svg>
      );
    case "understandable": // lightbulb
      return (
        <svg {...c}>
          <path {...S} d="M15 4 a8 8 0 0 1 5 14 c-1 1-1.3 2-1.3 3 H11.3 c0-1-.3-2-1.3-3 a8 8 0 0 1 5-14 Z" />
          <line x1={12} y1={26} x2={18} y2={26} {...S} />
        </svg>
      );
    case "fast": // lightning bolt
    default:
      return (
        <svg {...c}>
          <path {...S} d="M16 3 L7 17 H14 L13 27 L23 12 H16 Z" />
        </svg>
      );
  }
};
