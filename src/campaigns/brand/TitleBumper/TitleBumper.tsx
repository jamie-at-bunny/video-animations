import { BrandBumper, BRAND_BUMPER_DURATION } from "@/shared/BrandBumper";
import { BunnyLogo } from "@/shared/brand";

export const TITLE_BUMPER_DURATION = BRAND_BUMPER_DURATION; // 7s

const LOGO_W = 560;

// Generic bunny.net title card — the logo as the hero, on the brand-blue background.
export const BunnyBumper: React.FC = () => (
  <BrandBumper artwork={<BunnyLogo variant="light" width={LOGO_W} />} theme="navy" glow={false} />
);

// Same title card on chroma green, for keying onto footage — navy wordmark.
export const BunnyBumperGreen: React.FC = () => (
  <BrandBumper artwork={<BunnyLogo variant="dark" width={LOGO_W} />} theme="green" />
);

// Green-screen variant with the white wordmark, for keying onto darker footage.
export const BunnyBumperGreenWhite: React.FC = () => (
  <BrandBumper artwork={<BunnyLogo variant="light" width={LOGO_W} />} theme="green" />
);
