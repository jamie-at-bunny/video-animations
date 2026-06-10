import { useCurrentFrame, interpolate, Easing } from "remotion";
import { FONT, COLORS, HEIGHT, inkA } from "@/shared/theme";

// Minimal lower-third caption that fades in/out over a frame window.
export const Caption: React.FC<{
  text: string;
  from: number;
  to: number;
}> = ({ text, from, to }) => {
  const frame = useCurrentFrame();
  if (frame < from - 4 || frame > to + 4) return null;

  const fadeIn = 12;
  const fadeOut = 14;
  const opacity = interpolate(
    frame,
    [from, from + fadeIn, to - fadeOut, to],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.ease),
    },
  );
  const rise = interpolate(frame, [from, from + fadeIn], [10, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: HEIGHT * 0.085,
        left: 0,
        right: 0,
        textAlign: "center",
        opacity,
        transform: `translateY(${rise}px)`,
      }}
    >
      <span
        style={{
          fontFamily: FONT,
          color: COLORS.ink,
          fontSize: 28,
          fontWeight: 400,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          textShadow: `0 0 18px ${inkA(0.35)}`,
        }}
      >
        {text}
      </span>
    </div>
  );
};
