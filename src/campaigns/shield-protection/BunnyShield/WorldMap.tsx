import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";
import { WIDTH, DURATION } from "@/shared/theme";

// bunny.net official POPs world map (equirectangular ~2:1), recoloured into
// the palette. Sits dim behind the action as the "dark global map".
const RATIO = 6995 / 3521;

export const WorldMap: React.FC = () => {
  const frame = useCurrentFrame();

  const reveal = interpolate(frame, [0, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  // very slow drift so the map feels alive without distracting
  const scale = interpolate(frame, [0, DURATION], [1.04, 1.0]);

  const w = WIDTH * 1.02;
  const h = w / RATIO;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <Img
        src={staticFile("world-map.svg")}
        style={{
          width: w,
          height: h,
          opacity: reveal * 0.55,
          transform: `scale(${scale})`,
        }}
      />
    </AbsoluteFill>
  );
};
