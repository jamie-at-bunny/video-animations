// Bunny Shield design system — bunny.net palette.
import { loadFont } from "@remotion/google-fonts/Rubik";

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const DURATION = 210; // 7s

export const COLORS = {
  bg: "#12143F", // deep navy background
  ink: "#E0F2FF", // light blue — UI, text, cold threat shapes
  steel: "#223D6A", // structural fills / dim UI
  brand: "#FF9157", // bunny orange — shield, good request, impact, logo
} as const;

export const RED = "#FF3D54"; // rejected / threat traffic

// rgba helpers for glows / translucency
export const inkA = (a: number) => `rgba(224,242,255,${a})`;
export const brandA = (a: number) => `rgba(255,145,87,${a})`;
export const redA = (a: number) => `rgba(255,61,84,${a})`;

const rubik = loadFont("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});
export const FONT = rubik.fontFamily;

// Key stage positions (in 1920x1080 space)
export const LAYOUT = {
  browser: { x: 300, y: 540 },
  shieldX: 1180,
  shieldTop: 210,
  shieldBottom: 870,
  site: { x: 1640, y: 540 },
  midY: 540,
} as const;
