import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Theme system.
 *
 * Three explicit modes (light / grey / dark) plus a "system" preference that
 * resolves to light or dark based on the OS setting. The initial theme is
 * resolved by an inline script in index.html before React hydrates to prevent
 * a flash of the wrong theme.
 */

export type ThemeMode = "light" | "grey" | "dark" | "system";
type ResolvedTheme = "light" | "grey" | "dark";

const STORAGE_KEY = "koji-theme";
const CYCLE: ThemeMode[] = ["light", "grey", "dark", "system"];

interface ThemeContextValue {
  readonly mode: ThemeMode;
  readonly resolved: ResolvedTheme;
  setMode: (next: ThemeMode) => void;
  cycle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function resolveMode(mode: ThemeMode): ResolvedTheme {
  if (mode !== "system") return mode;
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function readInitialMode(): ThemeMode {
  if (typeof window === "undefined") return "system";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "grey" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch {
    // localStorage may be blocked (private mode, storage disabled).
    // Falling through to the default keeps the UI functional.
  }
  return "system";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(readInitialMode);
  const [resolved, setResolved] = useState<ResolvedTheme>(() => resolveMode(mode));

  useEffect(() => {
    const next = resolveMode(mode);
    setResolved(next);
    document.documentElement.dataset.theme = next;
    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // Persistence best-effort only.
    }
  }, [mode]);

  useEffect(() => {
    if (mode !== "system") return undefined;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => setResolved(resolveMode("system"));
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [mode]);

  const setMode = useCallback((next: ThemeMode) => setModeState(next), []);
  const cycle = useCallback(() => {
    setModeState((current) => {
      const index = CYCLE.indexOf(current);
      return CYCLE[(index + 1) % CYCLE.length];
    });
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ mode, resolved, setMode, cycle }),
    [mode, resolved, setMode, cycle],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used inside <ThemeProvider>");
  }
  return ctx;
}
