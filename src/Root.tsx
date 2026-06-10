import "./index.css";
import { Composition, Folder } from "remotion";
import { WIDTH, HEIGHT, FPS } from "@/shared/theme";

// Standard scene length: 7s @ 30fps. Override per-scene where needed.
const SEC7 = 210;

type Scene = {
  id: string;
  durationInFrames: number;
  // Lazy importer — a scene's code is only fetched when its composition is opened or rendered,
  // so the Studio doesn't load every animation at once.
  load: () => Promise<{ default: React.ComponentType }>;
};

// ── Shield Protection campaign ──────────────────────────────────────────────
const SHIELD_PROTECTION: Scene[] = [
  {
    id: "BunnyShield",
    durationInFrames: SEC7,
    load: () =>
      import("@/campaigns/shield-protection/BunnyShield/BunnyShield").then((m) => ({ default: m.BunnyShield })),
  },
  {
    id: "LegacyStack",
    durationInFrames: SEC7,
    load: () =>
      import("@/campaigns/shield-protection/LegacyStack/LegacyStack").then((m) => ({ default: m.LegacyStack })),
  },
  {
    id: "UnifiedEdge",
    durationInFrames: SEC7,
    load: () =>
      import("@/campaigns/shield-protection/UnifiedEdge/UnifiedEdge").then((m) => ({ default: m.UnifiedEdge })),
  },
  {
    id: "Fingerprint",
    durationInFrames: SEC7,
    load: () =>
      import("@/campaigns/shield-protection/Fingerprint/Fingerprint").then((m) => ({ default: m.Fingerprint })),
  },
  {
    id: "OneLayer",
    durationInFrames: SEC7,
    load: () => import("@/campaigns/shield-protection/Pillars/OneLayer").then((m) => ({ default: m.OneLayer })),
  },
  {
    id: "EuropeanTrust",
    durationInFrames: SEC7,
    load: () => import("@/campaigns/shield-protection/Pillars/EuropeanTrust").then((m) => ({ default: m.EuropeanTrust })),
  },
  {
    id: "Stats",
    durationInFrames: SEC7,
    load: () => import("@/campaigns/shield-protection/Stats/Stats").then((m) => ({ default: m.Stats })),
  },
  {
    id: "Frictionless",
    durationInFrames: SEC7,
    load: () =>
      import("@/campaigns/shield-protection/Frictionless/Frictionless").then((m) => ({ default: m.Frictionless })),
  },
  {
    id: "Bumper",
    durationInFrames: SEC7,
    load: () => import("@/campaigns/shield-protection/Bumper/Bumper").then((m) => ({ default: m.Bumper })),
  },
  {
    id: "AILearning",
    durationInFrames: SEC7,
    load: () => import("@/campaigns/shield-protection/AILearning/AILearning").then((m) => ({ default: m.AILearning })),
  },
];

// ── Brand (reusable title cards) ─────────────────────────────────────────────
const BRAND: Scene[] = [
  {
    id: "BunnyBumper",
    durationInFrames: SEC7,
    load: () => import("@/campaigns/brand/TitleBumper/TitleBumper").then((m) => ({ default: m.BunnyBumper })),
  },
  {
    id: "BunnyBumperGreen",
    durationInFrames: SEC7,
    load: () => import("@/campaigns/brand/TitleBumper/TitleBumper").then((m) => ({ default: m.BunnyBumperGreen })),
  },
  {
    id: "BunnyBumperGreenWhite",
    durationInFrames: SEC7,
    load: () => import("@/campaigns/brand/TitleBumper/TitleBumper").then((m) => ({ default: m.BunnyBumperGreenWhite })),
  },
];

// ── CLI campaign ────────────────────────────────────────────────────────────
const CLI: Scene[] = [
  {
    id: "EdgeScriptsDeploy",
    durationInFrames: 270, // 9s — holds on the lit map before fading
    load: () =>
      import("@/campaigns/cli/EdgeScriptsDeploy/EdgeScriptsDeploy").then((m) => ({ default: m.EdgeScriptsDeploy })),
  },
];

const Scenes: React.FC<{ scenes: Scene[] }> = ({ scenes }) => (
  <>
    {scenes.map((s) => (
      <Composition
        key={s.id}
        id={s.id}
        lazyComponent={s.load}
        durationInFrames={s.durationInFrames}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    ))}
  </>
);

export const RemotionRoot: React.FC = () => (
  <>
    <Folder name="Shield-Protection">
      <Scenes scenes={SHIELD_PROTECTION} />
    </Folder>
    <Folder name="Brand">
      <Scenes scenes={BRAND} />
    </Folder>
    <Folder name="CLI">
      <Scenes scenes={CLI} />
    </Folder>
  </>
);
