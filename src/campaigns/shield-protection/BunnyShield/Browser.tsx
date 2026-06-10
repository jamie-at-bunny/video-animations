import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { LAYOUT, COLORS, inkA } from "@/shared/theme";

// Minimal browser window from which the request originates.
export const Browser: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 25 });
  const scale = interpolate(enter, [0, 1], [0.8, 1]);
  const w = 230;
  const h = 160;

  return (
    <div
      style={{
        position: "absolute",
        left: LAYOUT.browser.x - w / 2,
        top: LAYOUT.browser.y - h / 2,
        width: w,
        height: h,
        opacity: enter,
        transform: `scale(${scale})`,
        transformOrigin: "center",
        border: `1.5px solid ${inkA(0.45)}`,
        borderRadius: 12,
        background: inkA(0.04),
        boxShadow: `0 0 40px ${inkA(0.08)}`,
        overflow: "hidden",
      }}
    >
      {/* title bar */}
      <div
        style={{
          height: 30,
          borderBottom: `1px solid ${inkA(0.15)}`,
          display: "flex",
          alignItems: "center",
          gap: 7,
          paddingLeft: 14,
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              border: `1px solid ${inkA(0.4)}`,
            }}
          />
        ))}
        <div
          style={{
            marginLeft: 12,
            height: 11,
            flex: 1,
            marginRight: 16,
            borderRadius: 6,
            background: COLORS.steel,
          }}
        />
      </div>
      {/* page content lines */}
      <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ height: 10, width: "55%", borderRadius: 4, background: inkA(0.5) }} />
        <div style={{ height: 8, width: "85%", borderRadius: 4, background: COLORS.steel }} />
        <div style={{ height: 8, width: "70%", borderRadius: 4, background: COLORS.steel }} />
        <div style={{ height: 8, width: "78%", borderRadius: 4, background: COLORS.steel }} />
      </div>
    </div>
  );
};
