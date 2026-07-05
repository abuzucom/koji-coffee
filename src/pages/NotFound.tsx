import { useEffect } from "react";
import { Link } from "react-router-dom";

import { TopBar } from "@/components/TopBar";
import { Footer } from "@/components/Footer";
import { siteConfig } from "@/config/site";

export function NotFound() {
  useEffect(() => {
    document.title = `Not found — ${siteConfig.name}`;
  }, []);

  return (
    <>
      <TopBar />
      <main className="mx-auto flex min-h-[calc(100dvh-14rem)] max-w-[720px] items-center justify-center px-6">
        <div className="max-w-md text-center">
          <p className="specimen-label">ERR · 404</p>
          <h1 className="mt-4 font-serif text-6xl">Not brewed.</h1>
          <p className="mt-4 text-[color:var(--color-muted-foreground)]">
            The page you're looking for isn't part of this specimen set.
          </p>
          <Link
            to="/"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[color:var(--color-accent)] px-6 py-3 text-sm text-[color:var(--color-accent-foreground)]"
          >
            Back home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
