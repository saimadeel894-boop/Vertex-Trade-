import { Advantages } from "@/components/Advantages";
import { ClosingCta } from "@/components/ClosingCta";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { MarketStrip } from "@/components/MarketStrip";
import { Platforms } from "@/components/Platforms";
import { TrustPanel } from "@/components/TrustPanel";

export default function HomePage() {
  return (
    <main className="page-shell">
      <Header />
      <Hero />
      <TrustPanel />
      <Advantages />
      <MarketStrip />
      <Platforms />
      <ClosingCta />
      <Footer />
    </main>
  );
}
