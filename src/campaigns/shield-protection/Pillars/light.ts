// Shared light-mode palette for the value-pillar sequences.
import { FONT } from "@/shared/theme";

export const LIGHT = {
  bg: "#E0F2FF",
  card: "#FFFFFF",
  border: "rgba(18,20,63,0.10)",
  shadow: "0 12px 34px rgba(18,20,63,0.12)",
  text: "#12143F",
  dim: "rgba(18,20,63,0.55)",
  accent: "#FF9157",
} as const;

export const accentA = (a: number) => `rgba(255,145,87,${a})`;

export { FONT };
