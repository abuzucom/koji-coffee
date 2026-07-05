import { useEffect } from "react";

import { TopBar } from "@/components/TopBar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Footer } from "@/components/Footer";
import { siteConfig } from "@/config/site";

export function Home() {
  useEffect(() => {
    document.title = `${siteConfig.name} — Experimental brewing community`;
  }, []);

  return (
    <>
      <TopBar />
      <main className="mx-auto max-w-[720px] px-6">
        <Hero />
        <About />
      </main>
      <Footer />
    </>
  );
}
