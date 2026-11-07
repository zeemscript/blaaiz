import { Cta } from "@/components/landing/Cta";
import { Faq } from "@/components/landing/Faq";
import { Features } from "@/components/landing/Features";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { ProductShowcase } from "@/components/landing/ProductShowcase";
import { Marquee } from "@/components/landing/Marquee";
import { Nav } from "@/components/landing/Nav";
import { Stats } from "@/components/landing/Stats";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans dark:bg-black">
      <Nav />
      <main className="flex flex-1 flex-col">
        <Hero />
        <ProductShowcase />
        <Marquee />
        <Stats />
        <HowItWorks />
        <Features />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
