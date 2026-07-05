/**
 * Postbuild: writes per-route static HTML by cloning dist/index.html and
 * patching <title>, meta description, canonical, and og:url so social
 * crawlers (Slack, LinkedIn, X, Facebook) — which don't run JavaScript —
 * see route-accurate previews. Googlebot benefits too.
 *
 * Routes are handled by the SPA router at runtime; we just deposit an
 * index.html at each route path so the static host serves that file for
 * the crawler's HEAD/GET and React Router takes over from there for humans.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";

const SITE_URL = "https://koji.coffee";

interface Route {
  path: string;
  title: string;
  description: string;
}

const routes: Route[] = [
  {
    path: "/privacy",
    title: "Privacy — koji.coffee",
    description:
      "koji.coffee collects no personal data: no cookies, no analytics, no tracking, no accounts. Our full privacy statement.",
  },
  {
    path: "/cookies",
    title: "Cookies — koji.coffee",
    description:
      "koji.coffee uses no cookies. A single localStorage entry stores your light/grey/dark theme preference. Nothing is transmitted.",
  },
  {
    path: "/terms",
    title: "Terms — koji.coffee",
    description:
      "Informational front door to the koji.coffee Discord. Community participation, content ownership, and safety disclaimers.",
  },
];

const distDir = resolve("dist");
const indexHtml = readFileSync(resolve(distDir, "index.html"), "utf8");

function patch(html: string, route: Route): string {
  const abs = `${SITE_URL}${route.path}`;
  let out = html;

  // <title>
  out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${route.title}</title>`);

  // <meta name="description" content="..." /> — attribute order-insensitive, single or multiline
  out = out.replace(
    /<meta\s+name="description"[\s\S]*?\/>/,
    `<meta name="description" content="${route.description}" />`,
  );

  // og:title / og:description / og:url
  out = out.replace(
    /<meta\s+property="og:title"[\s\S]*?\/>/,
    `<meta property="og:title" content="${route.title}" />`,
  );
  out = out.replace(
    /<meta\s+property="og:description"[\s\S]*?\/>/,
    `<meta property="og:description" content="${route.description}" />`,
  );
  out = out.replace(
    /<meta\s+property="og:url"[\s\S]*?\/>/,
    `<meta property="og:url" content="${abs}" />`,
  );

  // twitter:title / twitter:description
  out = out.replace(
    /<meta\s+name="twitter:title"[\s\S]*?\/>/,
    `<meta name="twitter:title" content="${route.title}" />`,
  );
  out = out.replace(
    /<meta\s+name="twitter:description"[\s\S]*?\/>/,
    `<meta name="twitter:description" content="${route.description}" />`,
  );

  // Inject canonical right before </head> (index.html has none because Vite
  // treats <link rel="canonical" href="/"> as an asset reference and errors).
  const canonical = `<link rel="canonical" href="${abs}" />`;
  out = out.replace("</head>", `    ${canonical}\n  </head>`);

  return out;
}

// Patch the root index.html so the homepage has an absolute canonical + og:url too.
const rootPatched = patch(indexHtml, {
  path: "/",
  title:
    "koji.coffee — A small room for people who brew coffee like a laboratory",
  description:
    "koji.coffee is an open Discord for roasters, home brewers, and one stubborn microbiologist — trading fermentation logs, extraction heresies, and blind cupping data.",
});
writeFileSync(resolve(distDir, "index.html"), rootPatched);
// 404.html is the SPA fallback; keep it as the (patched) homepage.
writeFileSync(resolve(distDir, "404.html"), rootPatched);

for (const route of routes) {
  const outPath = resolve(distDir, `.${route.path}/index.html`);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, patch(indexHtml, route));
  // eslint-disable-next-line no-console
  console.log(`prerendered ${route.path} -> ${outPath}`);
}

// eslint-disable-next-line no-console
console.log(`prerendered ${routes.length + 1} route(s)`);
