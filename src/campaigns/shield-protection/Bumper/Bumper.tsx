import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Easing } from "remotion";
import { COLORS, FONT, brandA } from "@/shared/theme";
import { SceneTransition } from "@/shared/SceneTransition";
import { Glow } from "@/shared/Glow";
import { BunnyLogo, ShieldMascot } from "@/shared/brand";

export const BUMPER_DURATION = 210; // 7s

const MW = 300;
const MH = MW * (552 / 470);

// "Bunny Shield" — centred mascot + title on a dark background, bunny.net at the foot.
export const Bumper: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mascotIn = spring({ frame, fps, config: { damping: 18, mass: 0.9 }, durationInFrames: 30 });
  const mascotRise = interpolate(mascotIn, [0, 1], [38, 0]);

  const textIn = interpolate(frame, [26, 52], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const textRise = interpolate(textIn, [0, 1], [22, 0]);

  const logoIn = interpolate(frame, [48, 74], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <SceneTransition>
        {/* centred column: mascot + title + tagline */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            paddingBottom: 120,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 26,
          }}
        >
          {/* mascot with glow */}
          <div
            style={{
              position: "relative",
              width: MW,
              height: MH,
              opacity: mascotIn,
              transform: `translateY(${mascotRise}px)`,
            }}
          >
            <Glow x={MW / 2} y={MH / 2} radius={360} alpha={0.16} whiteCore edgeStop={62} />
            <ShieldMascot width={MW} height={MH} style={{ position: "relative" }} />
          </div>

          {/* title */}
          <div
            style={{
              fontFamily: FONT,
              color: COLORS.ink,
              fontSize: 84,
              fontWeight: 700,
              lineHeight: 1.0,
              letterSpacing: "-0.01em",
              textAlign: "center",
              textShadow: `0 0 40px ${brandA(0.25)}`,
              opacity: textIn,
              transform: `translateY(${textRise}px)`,
            }}
          >
            Bunny
            <br />
            Shield
          </div>
        </div>

        {/* bunny.net logo at the foot */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 84,
            display: "flex",
            justifyContent: "center",
            opacity: logoIn,
          }}
        >
          <BunnyLogo width={220} />
        </div>
      </SceneTransition>
    </AbsoluteFill>
  );
};
