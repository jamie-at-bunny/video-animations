import {
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Img,
  staticFile,
  Easing,
} from "remotion";
import { FONT, COLORS, brandA } from "@/shared/theme";
import { EdgeIcon } from "./icons";
import { USER_X, SITE_X, EDGE_X, AXIS_Y, NODE_R, EDGE_R } from "./data";

// light-scene node colours
const TEXT = "#12143F";

// Label centred under a node at horizontal position cx.
const Label: React.FC<{
  text: string;
  cx: number;
  y: number;
  opacity: number;
  strong?: boolean;
}> = ({ text, cx, y, opacity, strong }) => (
  <div
    style={{
      position: "absolute",
      left: cx - 150,
      width: 300,
      top: y,
      textAlign: "center",
      opacity,
      fontFamily: FONT,
      fontSize: strong ? 19 : 16,
      fontWeight: strong ? 600 : 400,
      letterSpacing: "0.26em",
      textTransform: "uppercase",
      color: TEXT,
      textShadow: strong ? `0 0 18px ${brandA(0.4)}` : "none",
    }}
  >
    {text}
  </div>
);

// Synced cycle state — icon + label swap together.
type CycleItem = { label: string; icon: string };
const cycleState = (frame: number, start: number, period: number, fade: number, count: number) => {
  const t = frame - start;
  if (t < 0) return { idx: 0, env: 1 };
  const idx = Math.floor(t / period) % count;
  const local = t % period;
  const isFirst = t < period;
  const fin = isFirst ? 1 : interpolate(local, [0, fade], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fout = interpolate(local, [period - fade, period], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { idx, env: Math.min(fin, fout) };
};

// User / Website endpoint node.
export const EndNode: React.FC<{
  x: number;
  appear: number;
  icon: string;
  label: string;
  cycle?: CycleItem[];
}> = ({ x, appear, icon, label, cycle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - appear;
  const cyc = cycleState(frame, 48, 50, 10, cycle ? cycle.length : 1);
  if (local < -2) return null;
  const enter = spring({ frame: local, fps, config: { damping: 200 }, durationInFrames: 22 });

  const curIcon = cycle ? cycle[cyc.idx].icon : icon;
  const curLabel = cycle ? cycle[cyc.idx].label : label;
  const env = cycle ? cyc.env : 1;

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x - NODE_R,
          top: AXIS_Y - NODE_R,
          width: NODE_R * 2,
          height: NODE_R * 2,
          borderRadius: "50%",
          border: `1px solid rgba(18,20,63,0.16)`,
          background: "#FFFFFF",
          boxShadow: "0 10px 26px rgba(18,20,63,0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: enter,
          transform: `scale(${interpolate(enter, [0, 1], [0.7, 1])})`,
        }}
      >
        <div style={{ opacity: env, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <EdgeIcon id={curIcon} size={52} color={TEXT} />
        </div>
      </div>
      {cycle ? (
        <div
          style={{
            position: "absolute",
            left: x - 150,
            width: 300,
            top: AXIS_Y + NODE_R + 22,
            textAlign: "center",
            opacity: enter * env,
            transform: `translateY(${interpolate(env, [0, 1], [5, 0])}px)`,
            fontFamily: FONT,
            fontSize: 16,
            fontWeight: 400,
            letterSpacing: "0.26em",
            textTransform: "uppercase",
            color: TEXT,
          }}
        >
          {curLabel}
        </div>
      ) : (
        <Label text={label} cx={x} y={AXIS_Y + NODE_R + 22} opacity={enter} />
      )}
    </>
  );
};

// The central Bunny Edge node — the single delivery layer.
export const EdgeNode: React.FC = () => {
  const frame = useCurrentFrame();

  // blooms in immediately
  const bloom = interpolate(frame, [2, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const pulse = 0.85 + 0.15 * Math.sin(frame * 0.16);

  return (
    <>
      {/* outer halo */}
      <div
        style={{
          position: "absolute",
          left: EDGE_X - 150,
          top: AXIS_Y - 150,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${brandA(0.28 * pulse)}, ${brandA(0)} 65%)`,
          opacity: bloom,
        }}
      />
      {/* node ring */}
      <div
        style={{
          position: "absolute",
          left: EDGE_X - EDGE_R,
          top: AXIS_Y - EDGE_R,
          width: EDGE_R * 2,
          height: EDGE_R * 2,
          borderRadius: "50%",
          border: `2px solid ${COLORS.brand}`,
          background: "rgba(18,20,63,0.85)",
          boxShadow: `0 0 ${22 + 14 * pulse}px ${brandA(0.7)}, inset 0 0 26px ${brandA(0.25)}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: bloom,
          transform: `scale(${interpolate(bloom, [0, 1], [0.4, 1])})`,
        }}
      >
        <Img
          src={staticFile("bunny-rabbit.svg")}
          style={{ width: 64, height: 64, filter: `drop-shadow(0 0 8px ${brandA(0.7)})` }}
        />
      </div>
      <Label text="bunny.net" cx={EDGE_X} y={AXIS_Y + EDGE_R + 26} opacity={bloom} strong />
    </>
  );
};

export const UserNode: React.FC = () => (
  <EndNode x={USER_X} appear={28} icon="user" label="User" />
);
export const WebsiteNode: React.FC = () => (
  <EndNode
    x={SITE_X}
    appear={34}
    icon="website"
    label="Website"
    cycle={[
      { label: "Website", icon: "website" },
      { label: "API", icon: "api" },
      { label: "App", icon: "app" },
    ]}
  />
);
