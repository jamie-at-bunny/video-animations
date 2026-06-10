import { AbsoluteFill } from "remotion";
import { LIGHT } from "./light";
import { SceneTransition } from "@/shared/SceneTransition";

// Light-mode stage: soft light-blue background + eased blur in/out.
export const LightStage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ backgroundColor: LIGHT.bg }}>
    <SceneTransition>
      {children}
    </SceneTransition>
  </AbsoluteFill>
);
