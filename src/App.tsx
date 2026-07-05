import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import { ThemeProvider } from "@/lib/theme";
import { Home } from "@/pages/Home";

const Privacy = lazy(() =>
  import("@/pages/Privacy").then((mod) => ({ default: mod.Privacy })),
);
const Cookies = lazy(() =>
  import("@/pages/Cookies").then((mod) => ({ default: mod.Cookies })),
);
const Terms = lazy(() =>
  import("@/pages/Terms").then((mod) => ({ default: mod.Terms })),
);
const NotFound = lazy(() =>
  import("@/pages/NotFound").then((mod) => ({ default: mod.NotFound })),
);

export function App() {
  return (
    <ThemeProvider>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ThemeProvider>
  );
}
