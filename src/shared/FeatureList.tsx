import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS, FONT } from "./theme";
import { SceneTransition } from "./SceneTransition";
import { FeatureItem, FeatureListProps } from "./featureListSchema";

export { FEATURE_LIST_DURATION } from "./featureListSchema";

// Background presets. green = chroma key; dark = brand navy; light = soft blue.
const BG: Record<FeatureListProps["theme"], string> = {
  green: "#00B140",
  dark: COLORS.bg,
  light: "#E0F2FF",
};

const CARD_W = 440;
const CARD_H = 96;
const GAP = 22;
const ICON = 58;
const TEXT = "#12143F";

// A white feature card — optional icon + optional text. Cards hold their slot from
// frame 0 (so the stack never reflows) and just fade in place, top to bottom.
const Card: React.FC<{ item: FeatureItem; index: number }> = ({ item, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - (12 + index * 7);

  const enter = spring({ frame: local, fps, config: { damping: 18, mass: 0.7 }, durationInFrames: 24 });
  const scale = interpolate(enter, [0, 1], [0.96, 1]);

  return (
    <div
      style={{
        width: CARD_W,
        height: CARD_H,
        opacity: enter,
        transform: `scale(${scale})`,
        borderRadius: 16,
        border: "1px solid rgba(18,20,63,0.10)",
        background: "#FFFFFF",
        boxShadow: "0 10px 26px rgba(18,20,63,0.10)",
        display: "flex",
        alignItems: "center",
        gap: 20,
        paddingLeft: 22,
      }}
    >
      {item.icon ? (
        <Img src={staticFile(item.icon)} style={{ width: ICON, height: ICON, objectFit: "contain", flexShrink: 0 }} />
      ) : null}
      {item.label ? (
        <span style={{ fontFamily: FONT, color: TEXT, fontSize: 26, fontWeight: 600, letterSpacing: "0.01em" }}>
          {item.label}
        </span>
      ) : null}
    </div>
  );
};

// A centred, reusable brand feature list. Driven by props (see featureListSchema)
// so each composition can compose its own icon + text per row.
export const FeatureList: React.FC<FeatureListProps> = ({ theme, features }) => (
  <AbsoluteFill style={{ backgroundColor: BG[theme] }}>
    <SceneTransition>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: GAP,
        }}
      >
        {features.map((f, i) => (
          <Card key={i} item={f} index={i} />
        ))}
      </div>
    </SceneTransition>
  </AbsoluteFill>
);
