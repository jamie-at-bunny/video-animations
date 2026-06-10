import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { FONT } from "@/shared/theme";
import { Box, STACK_X } from "./data";
import { FeatureIcon } from "@/shared/FeatureIcon";

const W = 430;
const H = 100;

// light card colours
const CARD_BG = "#FFFFFF";
const CARD_BORDER = "rgba(18,20,63,0.10)";
const TEXT = "#12143F";

// A compact feature row in the left-hand stack.
export const ProductBox: React.FC<{ box: Box }> = ({ box }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - box.appear;
  if (local < -2) return null;

  const enter = spring({ frame: local, fps, config: { damping: 18, mass: 0.7 }, durationInFrames: 24 });
  const dx = interpolate(enter, [0, 1], [-34, 0]);

  return (
    <div
      style={{
        position: "absolute",
        left: STACK_X - W / 2,
        top: box.y - H / 2,
        width: W,
        height: H,
        opacity: enter,
        transform: `translateX(${dx}px)`,
        borderRadius: 16,
        border: `1px solid ${CARD_BORDER}`,
        background: CARD_BG,
        boxShadow: "0 10px 26px rgba(18,20,63,0.10)",
        display: "flex",
        alignItems: "center",
        gap: 20,
        paddingLeft: 22,
      }}
    >
      <FeatureIcon id={box.id} size={62} />
      <span
        style={{
          fontFamily: FONT,
          color: TEXT,
          fontSize: 26,
          fontWeight: 600,
          letterSpacing: "0.01em",
        }}
      >
        {box.label}
      </span>
    </div>
  );
};
