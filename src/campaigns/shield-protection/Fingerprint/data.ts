// Request-fingerprinting composition: a grid of incoming requests, each with a
// multi-signal fingerprint. A scan analyses them, then malicious patterns are
// flagged and coordinated ones (same fingerprint, different sources) are linked.
import { interpolate } from "remotion";
import { rand } from "@/shared/util";

export const FP_DURATION = 210; // 7s @ 30fps

export type TileType = "legit" | "bot" | "scanner" | "abusive" | "coordinated";

export type Tile = {
  id: number;
  x: number;
  y: number;
  appear: number;
  pattern: boolean[]; // 9-cell fingerprint signature
  type: TileType;
};

const COLS = [660, 810, 960, 1110, 1260];
const ROWS = [315, 465, 615, 765];

// classification per grid index (row-major, 5 cols x 4 rows = 20)
const TYPES: TileType[] = [
  "legit", "legit", "coordinated", "legit", "bot",
  "legit", "scanner", "coordinated", "legit", "legit",
  "bot", "coordinated", "legit", "legit", "legit",
  "abusive", "legit", "coordinated", "legit", "legit",
];

// the coordinated attackers all share one identical fingerprint
const COORD_PATTERN = [true, false, true, false, true, true, false, true, false];

const patternFor = (seed: number): boolean[] =>
  Array.from({ length: 9 }, (_, i) => rand(seed * 9.17 + i * 3.1) > 0.5);

export const TILES: Tile[] = TYPES.map((type, i) => {
  const c = i % 5;
  const r = Math.floor(i / 5);
  return {
    id: i,
    x: COLS[c],
    y: ROWS[r],
    appear: 8 + i * 2,
    pattern: type === "coordinated" ? COORD_PATTERN : patternFor(i + 1),
    type,
  };
});

export const COORDINATED = TILES.filter((t) => t.type === "coordinated");

// Scan sweep across the grid.
export const SCAN_START = 56;
export const SCAN_END = 92;
const GRID_L = 600;
const GRID_R = 1320;

export const scanX = (frame: number) =>
  interpolate(frame, [SCAN_START, SCAN_END], [GRID_L - 30, GRID_R + 30], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// Frame at which the scan line crosses a given x (when that tile resolves).
export const scannedAt = (x: number) =>
  interpolate(x, [GRID_L - 30, GRID_R + 30], [SCAN_START, SCAN_END], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

export const LINKS_IN = 100; // coordinated links start drawing
export const OUTRO_START = 180;
export const OUTRO_END = 208;
