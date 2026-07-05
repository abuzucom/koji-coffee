import { Link } from "react-router-dom";

import { siteConfig } from "@/config/site";
import { useTheme, type ThemeMode } from "@/lib/theme";

const MODES: readonly Exclude<ThemeMode, "system">[] = ["light", "grey", "dark"];

export function TopBar() {
  const { mode, resolved, setMode } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--color-rule)] bg-[color:var(--color-background)]/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[720px] items-center justify-between px-6">
        <Link
          to="/"
          className="font-display text-[15px] tracking-tight text-[color:var(--color-foreground)]"
        >
          {siteConfig.name}
        </Link>
        <div
          role="group"
          aria-label="Theme"
          className="label flex items-center gap-1 border border-[color:var(--color-rule)] p-[2px]"
        >
          {MODES.map((m) => {
            const isActive =
              mode === m || (mode === "system" && resolved === m);
            return (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                aria-pressed={isActive}
                className={
                  "cursor-pointer px-2 py-1 transition-colors " +
                  (isActive
                    ? "bg-[color:var(--color-foreground)] text-[color:var(--color-background)]"
                    : "text-[color:var(--color-muted-foreground)] hover:text-[color:var(--color-foreground)]")
                }
              >
                {m}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
