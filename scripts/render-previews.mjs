// Render GIF previews for the README — one per composition.
//
//   npm run previews            # all compositions
//   npm run previews -- Bumper  # only the listed composition id(s)
//
// GIFs land in assets/previews/<id>.gif at 480x270 / 15fps.
import path from "path";
import { mkdirSync } from "fs";
import { bundle } from "@remotion/bundler";
import { getCompositions, renderMedia } from "@remotion/renderer";
import { enableTailwind } from "@remotion/tailwind-v4";

const SCALE = 0.25; // 1920x1080 -> 480x270
const EVERY_NTH_FRAME = 2; // 30fps -> 15fps
const OUT_DIR = path.resolve(process.cwd(), "assets/previews");

// Mirror remotion.config.ts (the config file does NOT apply to the Node API):
// Tailwind + the "@/" path alias.
const webpackOverride = (config) => {
  const withTailwind = enableTailwind(config);
  return {
    ...withTailwind,
    resolve: {
      ...withTailwind.resolve,
      alias: { ...withTailwind.resolve?.alias, "@": path.resolve(process.cwd(), "src") },
    },
  };
};

const only = process.argv.slice(2); // optional list of composition ids

mkdirSync(OUT_DIR, { recursive: true });

console.log("Bundling…");
const serveUrl = await bundle({
  entryPoint: path.resolve(process.cwd(), "src/index.ts"),
  webpackOverride,
});

const all = await getCompositions(serveUrl);
const targets = only.length ? all.filter((c) => only.includes(c.id)) : all;

if (only.length) {
  const missing = only.filter((id) => !all.some((c) => c.id === id));
  if (missing.length) {
    console.error(`Unknown composition id(s): ${missing.join(", ")}`);
    process.exit(1);
  }
}

console.log(`Rendering ${targets.length} preview${targets.length === 1 ? "" : "s"}…`);
for (const composition of targets) {
  const outputLocation = path.join(OUT_DIR, `${composition.id}.gif`);
  await renderMedia({
    composition,
    serveUrl,
    codec: "gif",
    outputLocation,
    scale: SCALE,
    everyNthFrame: EVERY_NTH_FRAME,
  });
  console.log(`  ✓ ${composition.id}.gif`);
}

console.log("Done.");
process.exit(0);
