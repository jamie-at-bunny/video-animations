// "Shield features" composition. Two sequential beats:
//   1. the feature blocks appear, hold, then drop off
//   2. a big "<1ms at the edge" stat appears, holds, then drops off
import { FEATURES, FeatureId } from "@/shared/features";

export const STACK_DURATION = 210; // 7s @ 30fps

// the big edge-latency stat fades in on the right
export const STAT_IN = 54;

export type Box = {
  id: FeatureId;
  label: string;
  y: number; // row centre (cards are a vertical stack on the left)
  appear: number;
};

// Six features stacked vertically on the left.
export const STACK_X = 430; // card centre x
const TOP = 232;
const STEP = 122;

export const BOXES: Box[] = FEATURES.map((f, i) => ({
  id: f.id,
  label: f.label,
  y: TOP + i * STEP,
  appear: 12 + i * 7,
}));
