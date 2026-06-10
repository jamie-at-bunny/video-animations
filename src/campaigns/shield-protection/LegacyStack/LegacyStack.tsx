import { AbsoluteFill } from "remotion";
import { SceneTransition } from "@/shared/SceneTransition";
import { BOXES } from "./data";
import { ProductBox } from "./ProductBox";
import { EdgeStat } from "./EdgeStat";

// Chroma-key green background so the feature grid can be keyed out.
const LIGHT_BG = "#00B140";

export const LegacyStack: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: LIGHT_BG }}>
      <SceneTransition>
        {BOXES.map((b) => (
          <ProductBox key={b.id} box={b} />
        ))}
        <EdgeStat />
      </SceneTransition>
    </AbsoluteFill>
  );
};
