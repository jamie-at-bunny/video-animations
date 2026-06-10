import { LightStage } from "./LightStage";
import { PillarCard } from "./PillarCard";
import { EUStars } from "./EUStars";

export const EU_DURATION = 210; // 7s

const X = [560, 960, 1360];
const Y = 660;

// "European trust" — EU infrastructure, privacy, transparency. Its own scene.
export const EuropeanTrust: React.FC = () => (
  <LightStage>
    <EUStars cx={960} cy={326} radius={118} appear={10} />
    <PillarCard x={X[0]} y={Y} appear={62} icon="infrastructure" label="EU Sovereign" />
    <PillarCard x={X[1]} y={Y} appear={82} icon="privacy" label="Private by Design" />
    <PillarCard x={X[2]} y={Y} appear={102} icon="protection" label="Secure by Default" />
  </LightStage>
);
