# Security Policy

## Reporting a vulnerability

Please email **hello@koji.coffee** with a description of the issue and, if
possible, a proof-of-concept. We aim to acknowledge reports within 72 hours.

A machine-readable version of this policy is served at
`/.well-known/security.txt` (RFC 9116).

## Scope

This repository is a **fully static** informational website. It ships:

- HTML, CSS, JavaScript
- Bundled self-hosted fonts
- No backend, no API, no database, no authentication, no forms

There is no runtime that processes user input, no server-side state, and no
personal data collected or stored. The typical high-impact web risks (SQL
injection, IDOR, SSRF, deserialization, RCE) are not reachable.

## Controls applied

| Control | Implementation |
| --- | --- |
| Content-Security-Policy | `<meta http-equiv>` in `index.html` plus a `_headers` file for Cloudflare deploys. |
| Strict-Transport-Security | Emitted via `_headers` on Cloudflare Pages. GitHub Pages sets HSTS on `*.github.io`. |
| X-Content-Type-Options, Referrer-Policy, Permissions-Policy, X-Frame-Options | `_headers`. |
| SRI / hashed asset filenames | Vite production build. |
| Dependency scanning | `bun audit --audit-level=high` in every CI run (`.github/workflows/ci.yml`), plus a weekly scheduled scan (`.github/workflows/security-scan.yml`) that runs `bun audit` and Google OSV-Scanner (SARIF → Security → Code scanning) and opens a `security`-labeled issue on any finding. Dependabot for weekly grouped updates. |
| Exact-pinned dependencies | Every version in `package.json` is an exact semver; `check:pins` in CI blocks floating ranges. Combined with `bun install --frozen-lockfile` this eliminates version drift between environments. |
| No third-party fonts, scripts, cookies, analytics | Enforced by CSP and by the absence of any such dependencies. |
| Least-privilege GitHub Actions | Every workflow declares an explicit minimal `permissions:` block. |

## Compliance framing

The site is a marketing / informational front door to a Discord community.
The following statements apply to the site itself, not to Discord.

- **OWASP Top 10 (2021):** the application surface is static content; the
  categories that apply reduce to A05 (Security Misconfiguration) and A06
  (Vulnerable and Outdated Components), addressed via the CSP + headers
  policy above and by `bun audit` + OSV-Scanner + Dependabot.
- **ISO/IEC 27001:2022 Annex A:** controls that map to a public static site
  include A.5.7 (threat intelligence contact — `security.txt`), A.5.15
  (access control — none required, no accounts), A.8.9 (configuration
  management — infrastructure-as-code in `.github/workflows`), A.8.28
  (secure coding — ESLint + TypeScript strict + CI enforcement).
- **SOC 2 (Trust Services Criteria):** relevant criteria for a static
  no-PII site are CC6.1 (logical access — n/a, no data), CC7.1 (system
  operations monitoring — hosting provider), CC8.1 (change management —
  PR-gated CI, protected `main` branch recommended).
- **GDPR, CCPA, Texas DPSA:** no personal data is collected or processed.
  See `PRIVACY.md` and `/privacy`.

## What this repository is not

- Not a database of member data.
- Not a login system.
- Not a Discord bot or automation.
- Not audited to any certification standard. Statements above describe the
  design intent, not a formal attestation.

## Recommended repository settings

- Protect the `main` branch, require PR review, require the `CI` check to
  pass, and disable force-pushes.
- Restrict who can add secrets in Actions.
- Enable "Require deployments to succeed" for the `github-pages`
  environment.
- Rotate `CLOUDFLARE_API_TOKEN` on the same cadence as your workspace's
  key-rotation policy.
