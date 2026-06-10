import { z } from "zod";
import { FEATURES } from "./features";

// Props schema for <FeatureList>. Kept in its own (component-free) module so Root
// can import the schema + defaults eagerly while the component stays lazy-loaded.
export const FEATURE_LIST_DURATION = 210; // 7s

export const featureItemSchema = z.object({
  // svg filename in /public (e.g. "feat-waf.svg"), optional
  icon: z.string().optional(),
  // card text, optional
  label: z.string().optional(),
});

export const featureListSchema = z.object({
  theme: z.enum(["dark", "green", "light"]),
  features: z.array(featureItemSchema),
});

export type FeatureItem = z.infer<typeof featureItemSchema>;
export type FeatureListProps = z.infer<typeof featureListSchema>;

// The default bunny.net Shield feature set, mapped to the schema shape.
export const BUNNY_FEATURES: FeatureItem[] = FEATURES.map((f) => ({
  icon: `feat-${f.id}.svg`,
  label: f.label,
}));
