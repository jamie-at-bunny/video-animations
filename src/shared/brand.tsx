import { Img, staticFile } from "remotion";

// Single source of truth for brand asset filenames in /public.

type LogoVariant = "light" | "dark";
// light = white wordmark (use on dark backgrounds)
// dark  = navy wordmark  (use on light backgrounds)
const LOGO_SRC: Record<LogoVariant, string> = {
  light: "bunny-logo.svg",
  dark: "bunny-logo-dark.svg",
};

export const BunnyLogo: React.FC<{
  variant?: LogoVariant;
  width?: number;
  style?: React.CSSProperties;
}> = ({ variant = "light", width = 220, style }) => (
  <Img src={staticFile(LOGO_SRC[variant])} style={{ width, ...style }} />
);

// Intrinsic aspect ratio of the Shield mascot artwork (w:h).
export const MASCOT_RATIO = 470 / 552;

// Pass whichever dimension anchors your layout; the other is derived from the ratio.
export const ShieldMascot: React.FC<{
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}> = ({ width, height, style }) => {
  const w = width ?? (height ?? 0) * MASCOT_RATIO;
  const h = height ?? (width ?? 0) / MASCOT_RATIO;
  return <Img src={staticFile("shield-mascot.svg")} style={{ width: w, height: h, ...style }} />;
};
