import { useEffect, type ReactNode } from "react";

import { TopBar } from "@/components/TopBar";
import { Footer } from "@/components/Footer";
import { siteConfig } from "@/config/site";

interface LegalLayoutProps {
  readonly title: string;
  readonly updated: string;
  readonly children: ReactNode;
}

export function LegalLayout({ title, updated, children }: LegalLayoutProps) {
  useEffect(() => {
    document.title = `${title} — ${siteConfig.name}`;
  }, [title]);

  return (
    <>
      <TopBar />
      <main className="section-y mx-auto max-w-[720px] px-6">
        <p className="label">{updated}</p>
        <h1 className="mt-4 font-display text-[44px] leading-[1.02] tracking-[-0.035em] sm:text-[56px] sm:leading-[1.0]">
          {title}
        </h1>
        <div className="prose-body mt-label">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
