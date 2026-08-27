import { ScrollProgress } from "@/components/scroll-progress";
import { SideRail } from "@/components/side-rail";
import { SiteHeader } from "@/components/sections/site-header";
import { HeroSection } from "@/components/sections/hero-section";
import { OrgSection } from "@/components/sections/org-section";
import { NumbersSection } from "@/components/sections/numbers-section";
import { AboutSection } from "@/components/sections/about-section";
import { BenefitsSection } from "@/components/sections/benefits-section";
import { PhasesSection } from "@/components/sections/phases-section";
import { CalendarSection } from "@/components/sections/calendar-section";
import { ScoutingSection } from "@/components/sections/scouting-section";
import { AwardsSection } from "@/components/sections/awards-section";
import { PartnersSection } from "@/components/sections/partners-section";
import { FinalCtaSection } from "@/components/sections/final-cta-section";
import { SiteFooter } from "@/components/sections/site-footer";

export default function Page() {
  return (
    <div className="bg-bg text-text vl-texture-page md:pl-[clamp(30px,4vw,54px)]">
      <div
        className="pointer-events-none fixed inset-0 -z-1 bg-[radial-gradient(120%_70%_at_50%_0%,rgba(46,123,255,0.08),rgba(0,0,0,0)_58%),radial-gradient(100%_100%_at_50%_45%,rgba(0,0,0,0)_50%,rgba(0,0,0,0.55))]"
        aria-hidden
      />

      <ScrollProgress />
      <SideRail />
      <SiteHeader />

      <main>
        <HeroSection />
        <OrgSection />
        <AboutSection />
        <BenefitsSection />
        <PhasesSection />
        <CalendarSection />
        <ScoutingSection />
        <AwardsSection />
        <PartnersSection />
        <NumbersSection />
        <FinalCtaSection />
      </main>

      <SiteFooter />
    </div>
  );
}
