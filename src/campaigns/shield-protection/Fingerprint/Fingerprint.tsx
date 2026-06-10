import { AbsoluteFill } from "remotion";
import { COLORS } from "@/shared/theme";
import { SceneTransition } from "@/shared/SceneTransition";
import { TILES } from "./data";
import { FingerprintTile } from "./FingerprintTile";
import { Scan } from "./Scan";
import { Links } from "./Links";

export const Fingerprint: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <SceneTransition>
        <Links />
        {TILES.map((t) => (
          <FingerprintTile key={t.id} tile={t} />
        ))}
        <Scan />
      </SceneTransition>
    </AbsoluteFill>
  );
};
