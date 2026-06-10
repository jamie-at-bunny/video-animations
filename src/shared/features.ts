// The real Bunny Shield feature grid (bunny.net/shield).
// Shared across FeatureList and UnifiedEdge so both scenes use the same set.

export type FeatureId =
  | "waf"
  | "ddos"
  | "ratelimit"
  | "bot"
  | "access"
  | "upload";

export const FEATURES: { id: FeatureId; label: string }[] = [
  { id: "waf", label: "AI WAF" },
  { id: "ddos", label: "DDoS Protection" },
  { id: "ratelimit", label: "Rate Limiting" },
  { id: "bot", label: "Bot Mitigation" },
  { id: "access", label: "Access Lists" },
  { id: "upload", label: "Upload Scanning" },
];
