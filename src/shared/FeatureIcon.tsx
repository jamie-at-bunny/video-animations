import { Img, staticFile } from "remotion";
import { FeatureId } from "./features";

// Official Bunny Shield feature icons (from bunny.net/shield), one per feature.
export const FeatureIcon: React.FC<{ id: FeatureId; size?: number }> = ({
  id,
  size = 64,
}) => (
  <Img
    src={staticFile(`feat-${id}.svg`)}
    style={{ width: size, height: size, objectFit: "contain" }}
  />
);
