import { Img, staticFile } from "remotion";
import { COLORS } from "@/shared/theme";

// Line glyphs for the node endpoints and the edge capabilities.
const stroke = (c: string) => ({
  fill: "none",
  stroke: c,
  strokeWidth: 2,
  strokeLinejoin: "round" as const,
  strokeLinecap: "round" as const,
});

export const EdgeIcon: React.FC<{ id: string; size?: number; color?: string }> = ({
  id,
  size = 30,
  color = COLORS.ink,
}) => {
  const common = { width: size, height: size, viewBox: "0 0 30 30" };
  const S = stroke(color);
  switch (id) {
    case "api": // OpenAPI Initiative logomark
      return <Img src={staticFile("openapi.svg")} style={{ width: size, height: size }} />;
    case "app": // app tiles
      return (
        <svg {...common}>
          <g {...S}>
            <rect x={5} y={5} width={8} height={8} rx={2} />
            <rect x={17} y={5} width={8} height={8} rx={2} />
            <rect x={5} y={17} width={8} height={8} rx={2} />
            <rect x={17} y={17} width={8} height={8} rx={2} />
          </g>
        </svg>
      );
    case "user":
      return (
        <svg {...common}>
          <g {...S}>
            <circle cx={15} cy={11} r={5} />
            <path d="M5 25 C5 18 25 18 25 25" />
          </g>
        </svg>
      );
    case "website":
      return (
        <svg {...common}>
          <g {...S}>
            <circle cx={15} cy={15} r={11} />
            <ellipse cx={15} cy={15} rx={5} ry={11} />
            <line x1={4} y1={15} x2={26} y2={15} />
            <line x1={6} y1={9} x2={24} y2={9} />
            <line x1={6} y1={21} x2={24} y2={21} />
          </g>
        </svg>
      );
    case "accelerate": // lightning bolt
      return (
        <svg {...common}>
          <path {...S} d="M16 3 L7 17 H14 L13 27 L23 12 H16 Z" />
        </svg>
      );
    case "cache": // stacked layers
      return (
        <svg {...common}>
          <g {...S}>
            <path d="M15 4 L26 9 L15 14 L4 9 Z" />
            <path d="M4 15 L15 20 L26 15" />
            <path d="M4 21 L15 26 L26 21" />
          </g>
        </svg>
      );
    case "inspect": // magnifier
      return (
        <svg {...common}>
          <g {...S}>
            <circle cx={13} cy={13} r={8} />
            <line x1={19} y1={19} x2={26} y2={26} />
          </g>
        </svg>
      );
    case "filter": // funnel
      return (
        <svg {...common}>
          <path {...S} d="M4 6 H26 L17 16 V25 L13 22 V16 Z" />
        </svg>
      );
    case "protect": // shield
      return (
        <svg {...common}>
          <path {...S} d="M15 3 L25 7 V15 C25 22 20 26 15 27 C10 26 5 22 5 15 V7 Z" />
        </svg>
      );
    case "optimize": // gauge
    default:
      return (
        <svg {...common}>
          <g {...S}>
            <path d="M4 22 A11 11 0 0 1 26 22" />
            <line x1={15} y1={22} x2={21} y2={13} />
            <circle cx={15} cy={22} r={1.6} fill={color} stroke="none" />
          </g>
        </svg>
      );
  }
};
