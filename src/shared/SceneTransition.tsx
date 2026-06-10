import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";

const IN = 20;
const OUT = 30;

// Wraps a scene's content with a consistent, clean eased fade in and out.
export const SceneTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const opacity =
    interpolate(frame, [0, IN], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    }) *
    interpolate(frame, [durationInFrames - OUT, durationInFrames], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    });

  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};
