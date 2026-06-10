import { AbsoluteFill } from "remotion";
import { COLORS } from "@/shared/theme";
import { SceneTransition } from "@/shared/SceneTransition";
import { WorldMap } from "./WorldMap";
import { Browser } from "./Browser";
import { GoodTraffic } from "./GoodTraffic";
import { Shield } from "./Shield";
import { Threats } from "./Threats";
import { Website } from "./Website";

export const BunnyShield: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <SceneTransition>
        <WorldMap />
        <Shield />
        <Browser />
        <Threats />
        <GoodTraffic />
        <Website />
      </SceneTransition>
    </AbsoluteFill>
  );
};
