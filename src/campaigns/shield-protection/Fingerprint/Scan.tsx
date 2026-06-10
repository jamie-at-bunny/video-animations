import { useCurrentFrame, interpolate } from "remotion";
import { brandA } from "@/shared/theme";
import { scanX, SCAN_START, SCAN_END } from "./data";

const TOP = 250;
const BOT = 830;

// A vertical analysis sweep that passes across the fingerprint grid.
export const Scan: React.FC = () => {
  const frame = useCurrentFrame();
  const x = scanX(frame);
  const opacity = interpolate(
    frame,
    [SCAN_START - 10, SCAN_START, SCAN_END, SCAN_END + 12],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  if (opacity <= 0) return null;

  return (
    <div style={{ position: "absolute", inset: 0, opacity }}>
      {/* soft trailing glow */}
      <div
        style={{
          position: "absolute",
          left: x - 60,
          top: TOP,
          width: 60,
          height: BOT - TOP,
          background: `linear-gradient(90deg, ${brandA(0)}, ${brandA(0.18)})`,
        }}
      />
      {/* bright leading line */}
      <div
        style={{
          position: "absolute",
          left: x,
          top: TOP,
          width: 2.5,
          height: BOT - TOP,
          background: "#FFCBA8",
          boxShadow: `0 0 16px 3px ${brandA(0.8)}`,
        }}
      />
    </div>
  );
};
