# Releasing

This document describes how **koji.coffee** ships to production and preview
environments. All deploys are driven by GitHub Actions — there is no manual
`bun run deploy` step, and no maintainer credentials are required beyond the
per-provider secrets listed below.

The app is a fully static Vite build. Every deploy target consumes the same
`dist/` artifact produced by `bun run build`; only the `base` path and the
hosting provider differ.

---

## TL;DR

| Trigger                          | Workflow                         | Target                                  | Artifact                          |
| -------------------------------- | -------------------------------- | --------------------------------------- | --------------------------------- |
| Push to `main`                   | `deploy-pages.yml`               | GitHub Pages (production)               | `dist/` via Pages Actions upload  |
| Push to `main`                   | `deploy-cloudflare.yml`          | Cloudflare Pages (`koji-coffee`)        | `dist/` via `wrangler pages deploy` |
| Pull request (opened/updated)    | `preview-pages.yml`              | `gh-pages/pr-<n>/` on GitHub Pages      | `dist/` committed to `gh-pages`   |
| Pull request closed              | `preview-pages.yml` (cleanup)    | Removes `gh-pages/pr-<n>/`              | —                                 |
| Push / PR / manual               | `ci.yml`                         | No deploy — quality gate only           | —                                 |
| Weekly + lockfile change         | `security-scan.yml`              | No deploy — SARIF + tracking issue      | SARIF upload to Code scanning     |

Every deploy workflow reuses the `./.github/actions/setup-bun-cached`
composite action so warm runs skip install, Vite dep pre-bundling, and
full TypeScript typechecks.

---

## Build output

`bun run build` produces a `dist/` directory containing:

- `index.html` — the SPA entry (title/meta driven by `index.html` + React)
- Hashed JS/CSS chunks under `dist/assets/`
- Static assets copied from `public/` (`robots.txt`, `sitemap.xml`,
  `.well-known/security.txt`, `_headers`, optional `CNAME`)

The `base` path is controlled by the `VITE_BASE` environment variable at
build time. Each workflow sets it to match its hosting target (see below).

---

## Production: GitHub Pages (`deploy-pages.yml`)

**Trigger:** push to `main`, or manual `workflow_dispatch`.

**Base path resolution** (computed in the `Compute base path` step):

1. If `public/CNAME` exists → `VITE_BASE=/` (custom domain).
2. Else if the repo is `<user>.github.io` → `VITE_BASE=/` (user/org site).
3. Else → `VITE_BASE=/<repo-name>/` (project site).

**Steps:**

1. Checkout (no persisted credentials).
2. `setup-bun-cached` composite action (Bun install + three caches).
3. `bun run build` with the computed `VITE_BASE`.
4. `cp dist/index.html dist/404.html` — SPA fallback so client-side routes
   don't 404 on refresh.
5. `touch dist/.nojekyll` — disable Jekyll processing.
6. `actions/upload-pages-artifact@v3` uploads `dist/`.
7. The `deploy` job consumes the artifact with `actions/deploy-pages@v4`
   and publishes to the `github-pages` environment.

**Repository setting required:** Settings → Pages → Source: **GitHub
Actions**.

**Published URL:** `https://<owner>.github.io/<repo>/` (or your custom
domain if `public/CNAME` is set).

**Concurrency:** grouped as `pages` with `cancel-in-progress: false` so
concurrent pushes queue rather than clobber each other.

---

## Secondary: Cloudflare Pages (`deploy-cloudflare.yml`)

**Trigger:** push to `main`, or manual `workflow_dispatch`.

**Secrets required:**

| Secret                   | Where to get it                                                              |
| ------------------------ | ---------------------------------------------------------------------------- |
| `CLOUDFLARE_API_TOKEN`   | Cloudflare dashboard → My Profile → API Tokens → "Edit Cloudflare Pages"     |
| `CLOUDFLARE_ACCOUNT_ID`  | Cloudflare dashboard → any zone → right sidebar                              |

If either secret is missing, the guard step logs a warning and the rest of
the job is skipped via `if: env.SKIP != 'true'`. The workflow **does not
fail** — Cloudflare is a secondary target and its absence should not block
GitHub Pages.

**Steps:**

1. Guard — verify secrets, else set `SKIP=true`.
2. Checkout + `oven-sh/setup-bun@v2`.
3. `bun install --frozen-lockfile`.
4. `bun run build` with `VITE_BASE=/` (Cloudflare serves at the domain
   root).
5. `cloudflare/wrangler-action@v3` runs `wrangler pages deploy dist
   --project-name=koji-coffee --branch=main`.

**Project name:** `koji-coffee` (edit `--project-name` in the workflow if
your Cloudflare project uses a different slug).

**Concurrency:** grouped as `cloudflare-pages`.

---

## Preview: PR deploys (`preview-pages.yml`)

**Trigger:** `pull_request` events (`opened`, `synchronize`, `reopened`,
`closed`) against `main`.

**Fork PRs are skipped** — forks don't have write access to `GITHUB_TOKEN`,
so preview publishing would fail. This is intentional.

**Build job (opened/updated/reopened):**

1. Checkout.
2. `setup-bun-cached`.
3. `bun run build` with `VITE_BASE=/<repo>/pr-<number>/`.
4. SPA fallback + `.nojekyll` (same as production).
5. `peaceiris/actions-gh-pages@v4` pushes `dist/` to
   `gh-pages/pr-<number>/` with `keep_files: true` so sibling previews
   survive.
6. `marocchino/sticky-pull-request-comment@v2` posts (or updates) a
   preview URL comment on the PR.

**Cleanup job (closed):**

- Checks out `gh-pages`, `git rm -rf pr-<number>/`, pushes.
- Updates the sticky PR comment to note teardown.

**Preview URL:**
`https://<owner>.github.io/<repo>/pr-<number>/`

**Repository setting required:** Settings → Pages → Source: **Deploy from
a branch → `gh-pages`**.

**⚠️ Mutually exclusive with `deploy-pages.yml`.** GitHub Pages only serves
one source per repo. Pick one strategy:

- **Production only** → Pages source = "GitHub Actions"; disable or delete
  `preview-pages.yml`.
- **Previews only** → Pages source = "Deploy from a branch → `gh-pages`";
  disable or delete `deploy-pages.yml` (Cloudflare becomes production).
- **Both** → Pages source = "Deploy from a branch → `gh-pages`", and
  rework `deploy-pages.yml` to also publish to `gh-pages` root instead of
  using the Pages Actions source. Not currently wired up.

**Concurrency:** grouped as `preview-pages-pr-<number>` with
`cancel-in-progress: true` — new pushes to the same PR cancel in-flight
preview builds.

---

## Quality gate: `ci.yml`

**Trigger:** every PR and every push to `main`.

**No deploy.** Five parallel jobs share `setup-bun-cached`:

| Job         | Command                                | Purpose                                       |
| ----------- | -------------------------------------- | --------------------------------------------- |
| `pins`      | `bun run check:pins`                   | Fails if any `package.json` dep uses a range. |
| `lint`      | `bun run lint`                         | ESLint 9 flat config.                         |
| `typecheck` | `bunx tsc --noEmit`                    | Uses cached `.tscache/` buildinfo.            |
| `audit`     | `bun audit --prod --severity high`     | Fails on high/critical CVEs in prod deps.     |
| `build`     | `bun run build`                        | Verifies `dist/` builds.                      |

An aggregator `ci` job with `if: always()` and `needs: [pins, lint,
typecheck, audit, build]` rolls the results into a single required check
suitable for branch protection.

---

## Weekly SCA: `security-scan.yml`

**Trigger:** `schedule` (Mondays 06:00 UTC), pushes that touch `bun.lock`
or `package.json`, and manual `workflow_dispatch`.

**No deploy.** Runs `bun audit` and Google OSV-Scanner, uploads SARIF to
Security → Code scanning, and opens a `security`-labeled tracking issue on
any finding.

---

## First-time repo setup

See the **Repository settings checklist** in [`README.md`](./README.md).
The short version:

1. Actions → General → Workflow permissions: **Read and write**.
2. Pages source: **GitHub Actions** (production) *or* **Deploy from a
   branch → `gh-pages`** (previews). Not both without editing workflows.
3. Code scanning: enable so OSV-Scanner SARIF appears in the Security tab.
4. Branches → Branch protection on `main`: require the aggregated `CI`
   check, require PR review, disable force-pushes.
5. Optional: add `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` to enable
   the Cloudflare Pages deploy.

---

## Rollback

There is no immutable release artifact stored per version — deploys are
produced from the commit at the tip of `main`. To roll back:

1. Revert the offending commit(s) on `main` via PR.
2. Merge — `deploy-pages.yml` and `deploy-cloudflare.yml` re-run
   automatically and republish the previous state.

For an emergency rollback without a revert PR, re-run the last known-good
run of `deploy-pages.yml` via **Actions → deploy-pages → Re-run all
jobs**. Cloudflare Pages also keeps a deploy history in its dashboard
where any previous deployment can be promoted to production directly.
