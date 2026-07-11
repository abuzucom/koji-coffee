# koji.coffee

<!--
  Badges point at workflow files by filename, so they keep working if the
  default branch is renamed. Replace OWNER/REPO with your GitHub slug
  (e.g. `koji-cafe/koji.coffee`). Once the repo is public, the SVGs render
  automatically on github.com and most Markdown viewers.
-->

[![CI](https://github.com/OWNER/REPO/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/OWNER/REPO/actions/workflows/ci.yml)
[![Deploy to GitHub Pages](https://github.com/OWNER/REPO/actions/workflows/deploy-pages.yml/badge.svg?branch=main)](https://github.com/OWNER/REPO/actions/workflows/deploy-pages.yml)
[![Deploy to Cloudflare Pages](https://github.com/OWNER/REPO/actions/workflows/deploy-cloudflare.yml/badge.svg?branch=main)](https://github.com/OWNER/REPO/actions/workflows/deploy-cloudflare.yml)

Static landing page for the **koji.coffee** Discord community — coffee, but
treated like a lab notebook.

## Stack

- Vite 8 + React 19 + TypeScript (strict)
- Tailwind CSS v4 (native `@import`, tokens in `src/styles.css`)
- `react-router-dom` v7 for client-side routing
- Self-hosted Instrument Serif + Inter Tight + JetBrains Mono
  (via `@fontsource*`, no CDNs)

**Fully portable** — no proprietary app-builder platform, no Supabase, no
TanStack Start, no serverless runtime. `bun run build` emits a static `dist/`
deployable to any static host.

## Local development

```bash
bun install
bun run dev        # http://localhost:8080
bun run build      # emits dist/
bun run preview
```

## Before first deploy

Edit `src/config/site.ts`:

1. Replace `discordInviteUrl` with your real invite URL.
2. Update `contactEmail` and `githubUrl`.

Also update `public/.well-known/security.txt` with your security contact.

## Deployment

Four GitHub Actions workflows ship out of the box:

- **`.github/workflows/ci.yml`** — runs on every PR and push to `main`. Five
  jobs execute in **parallel** on separate runners (`pins`, `lint`,
  `typecheck`, `audit`, `build`) and roll up into a single `ci` aggregator
  check suitable for branch protection. Total wall-clock time is roughly
  the slowest single job.
- **`.github/workflows/deploy-pages.yml`** — GitHub Pages (primary). Zero
  configuration required for a public repo with Pages enabled
  (Settings → Pages → Source: GitHub Actions). Automatically computes the
  correct `base` path for user-site, org-site, project-site, and
  custom-domain deployments.
- **`.github/workflows/preview-pages.yml`** — deploys each PR to
  `gh-pages/pr-<number>/` and sticky-comments the preview URL on the PR;
  tears the preview down on close. Requires switching Pages source to
  "Deploy from a branch → `gh-pages`" (mutually exclusive with the primary
  `deploy-pages.yml` workflow — pick one strategy).
- **`.github/workflows/deploy-cloudflare.yml`** — Cloudflare Pages
  (secondary). Requires two repo secrets:

  | Secret | Where to get it |
  | --- | --- |
  | `CLOUDFLARE_API_TOKEN` | Cloudflare dashboard → My Profile → API Tokens → Create Token → "Edit Cloudflare Pages" template |
  | `CLOUDFLARE_ACCOUNT_ID` | Cloudflare dashboard → any zone → right sidebar |

  If either secret is missing the workflow logs a warning and skips
  gracefully — it does not fail the run.

The Cloudflare project name is `koji-coffee` (edit the `--project-name` flag
in `deploy-cloudflare.yml` if yours differs).

## Custom domain on GitHub Pages

Create `public/CNAME` containing your domain (e.g. `koji.coffee`). The
Pages workflow detects it and builds with `base: /` instead of the repo
subpath.

## Security

See [`SECURITY.md`](./SECURITY.md).

- **`.github/workflows/security-scan.yml`** runs weekly (Mon 06:00 UTC),
  on lockfile changes, and on manual dispatch. It runs `bun audit` plus
  Google **OSV-Scanner** (SARIF uploaded to Security → Code scanning) and
  opens a `security`-labeled tracking issue on any finding.

## Privacy

See [`PRIVACY.md`](./PRIVACY.md) or the deployed `/privacy` page.

## Code quality

- ESLint 9 flat config with rules for max function length, nesting depth,
  line length, param reassignment, empty catches, and identifier length.
- Prettier for formatting.
- **Exact dependency versions.** Every entry in `package.json` is pinned
  to an exact semver (no `^`/`~`/ranges). The `check:pins` script in CI
  enforces this so Dependabot bumps show up as explicit exact-version
  diffs and every environment resolves the identical tree.
- **Frozen lockfile.** All CI installs use `bun install --frozen-lockfile`,
  and `packageManager` in `package.json` pins the Bun version used across
  local, CI, and deploy runs.
- **Cached CI.** The composite action
  `.github/actions/setup-bun-cached` restores three caches on every job:
  `~/.bun/install/cache` (Bun global module store), `node_modules/.vite`
  (Vite dep pre-bundle), and `.tscache/` (TypeScript `--incremental`
  buildinfo). Warm runs skip install, dep-optimize, and full-project
  typechecks.
- **Weekly SCA.** `security-scan.yml` catches newly disclosed
  vulnerabilities even without code changes (see Security above).
- Dependabot opens weekly grouped PRs for npm minor/patch and GitHub
  Actions.

## Repository settings checklist

One-time setup after cloning to a new org/repo:

1. **Settings → Actions → General → Workflow permissions:** Read and write.
2. **Settings → Pages → Source:** either "GitHub Actions" (production
   deploys via `deploy-pages.yml`) or "Deploy from a branch → `gh-pages`"
   (PR previews via `preview-pages.yml`). Not both.
3. **Settings → Code security → Code scanning:** enable so OSV-Scanner
   SARIF results appear in the Security tab.
4. **Settings → Branches → Branch protection:** protect `main`, require
   PR review, require the aggregated `CI` check to pass, and disable
   force-pushes.
5. Replace `OWNER/REPO` in the README badges with your actual
   `<owner>/<repo>` slug.

