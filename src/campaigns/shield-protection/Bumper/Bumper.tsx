import { BrandBumper, BRAND_BUMPER_DURATION } from "@/shared/BrandBumper";
import { ShieldMascot } from "@/shared/brand";

export const BUMPER_DURATION = BRAND_BUMPER_DURATION; // 7s

const MW = 300;
const MH = MW * (552 / 470);

// "Bunny Shield" — centred mascot + title on the brand-blue background, bunny.net at the
// foot. Eased fade in/out, no glow.
export const Bumper: React.FC = () => (
  <BrandBumper artwork={<ShieldMascot width={MW} height={MH} />} title={["Bunny", "Shield"]} theme="navy" showFooterLogo glow={false} gap={64} />
);
