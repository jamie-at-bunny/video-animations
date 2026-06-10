import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate, spring, useVideoConfig, Easing } from "remotion";
import { COLORS, FONT, brandA } from "./theme";
import { SceneTransition } from "./SceneTransition";
import { BunnyLogo } from "./brand";

export const BRAND_BUMPER_DURATION = 210; // 7s

// Background presets. navy = the deep brand blue; green = chroma key; light = soft blue.
export type BumperTheme = "navy" | "green" | "light";

type ThemeDef = { bg: string; text: string; footerLogo: "light" | "dark"; glow: boolean; titleShadow?: string };
const THEMES: Record<BumperTheme, ThemeDef> = {
  navy: { bg: COLORS.bg, text: COLORS.ink, footerLogo: "light", glow: true, titleShadow: `0 0 40px ${brandA(0.25)}` },
  green: { bg: "#00B140", text: "#12143F", footerLogo: "dark", glow: false },
  light: { bg: "#E0F2FF", text: "#12143F", footerLogo: "dark", glow: false },
};

const WIPE = 24; // frames for the wipe reveal / exit

// A reusable brand/product bumper: a hero (mascot, product logo, or the bunny.net
// logo) springs in, an optional title rises under it, and the bunny.net wordmark
// can sit at the foot. Swap the hero per product via `artwork` / `artworkSrc`.
//
// reveal "fade" (default) eases in/out; "wipe" reveals the whole card left→right
// and exits right→left.
export const BrandBumper: React.FC<{
  artwork?: React.ReactNode; // hero node (e.g. <ShieldMascot/> or <BunnyLogo/>)
  artworkSrc?: string; // …or an svg filename in /public, rendered as an <Img>
  artworkWidth?: number;
  artworkHeight?: number;
  title?: string | string[]; // line(s) under the hero
  theme?: BumperTheme;
  showFooterLogo?: boolean; // bunny.net wordmark at the foot
  glow?: boolean; // override the theme's glow default
  glowRadius?: number;
  reveal?: "fade" | "wipe";
  gap?: number; // vertical space between hero and title
}> = ({
  artwork,
  artworkSrc,
  artworkWidth,
  artworkHeight,
  title,
  theme = "navy",
  showFooterLogo = false,
  glow,
  glowRadius = 360,
  reveal = "fade",
  gap = 26,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = THEMES[theme];
  const showGlow = glow ?? t.glow;
  const wipe = reveal === "wipe";

  // Entrance of the individual elements — skipped in wipe mode (the wipe does it).
  const heroIn = wipe ? 1 : spring({ frame, fps, config: { damping: 18, mass: 0.9 }, durationInFrames: 30 });
  const heroRise = wipe ? 0 : interpolate(heroIn, [0, 1], [38, 0]);

  const titleIn = wipe
    ? 1
    : interpolate(frame, [26, 52], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const titleRise = wipe ? 0 : interpolate(titleIn, [0, 1], [22, 0]);

  const footerIn = wipe ? 1 : interpolate(frame, [48, 74], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Wipe: a single right-inset that shrinks to reveal (left→right), then grows to exit (right→left).
  const revealRight = interpolate(frame, [0, WIPE], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const exitRight = interpolate(frame, [durationInFrames - WIPE, durationInFrames], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  const rightPct = Math.max(revealRight, exitRight);

  const lines = Array.isArray(title) ? title : title ? [title] : [];
  const hero =
    artwork ??
    (artworkSrc ? (
      <Img src={staticFile(artworkSrc)} style={{ width: artworkWidth, height: artworkHeight, display: "block" }} />
    ) : null);

  const content = (
    <>
      {/* centred column: hero + optional title */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          paddingBottom: showFooterLogo ? 120 : 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap,
        }}
      >
        {hero && (
          <div
            style={{ position: "relative", display: "inline-flex", opacity: heroIn, transform: `translateY(${heroRise}px)` }}
          >
            {showGlow && (
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: glowRadius * 2,
                  height: glowRadius * 2,
                  marginLeft: -glowRadius,
                  marginTop: -glowRadius,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${brandA(0.16)}, rgba(255,255,255,0.05) 30%, rgba(0,0,0,0) 62%)`,
                  pointerEvents: "none",
                }}
              />
            )}
            <div style={{ position: "relative" }}>{hero}</div>
          </div>
        )}

        {lines.length > 0 && (
          <div
            style={{
              fontFamily: FONT,
              color: t.text,
              fontSize: 84,
              fontWeight: 700,
              lineHeight: 1.0,
              letterSpacing: "-0.01em",
              textAlign: "center",
              textShadow: showGlow ? t.titleShadow : undefined,
              opacity: titleIn,
              transform: `translateY(${titleRise}px)`,
            }}
          >
            {lines.map((l, i) => (
              <span key={i} style={{ display: "block" }}>
                {l}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* bunny.net logo at the foot */}
      {showFooterLogo && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 84,
            display: "flex",
            justifyContent: "center",
            opacity: footerIn,
          }}
        >
          <BunnyLogo variant={t.footerLogo} width={220} />
        </div>
      )}
    </>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: t.bg, clipPath: wipe ? `inset(0 ${rightPct}% 0 0)` : undefined }}>
      {wipe ? content : <SceneTransition>{content}</SceneTransition>}
    </AbsoluteFill>
  );
};
