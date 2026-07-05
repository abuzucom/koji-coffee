import { Link } from "react-router-dom";

import { siteConfig } from "@/config/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="rule">
      <div className="mx-auto max-w-[720px] px-6 py-16">
        <nav aria-label="Footer" className="label flex flex-wrap gap-x-6 gap-y-2">
          <Link to="/privacy" className="hover:text-[color:var(--color-foreground)]">
            Privacy
          </Link>
          <Link to="/cookies" className="hover:text-[color:var(--color-foreground)]">
            Cookies
          </Link>
          <Link to="/terms" className="hover:text-[color:var(--color-foreground)]">
            Terms
          </Link>
        </nav>
        <p className="label mt-block">
          {siteConfig.name} &mdash; &copy; {year}
        </p>
      </div>
    </footer>
  );
}
