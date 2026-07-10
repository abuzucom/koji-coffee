#!/usr/bin/env bun
/**
 * Fails if any dependency in package.json uses a floating version range
 * (^, ~, *, >=, <=, >, <, ||, x/X wildcards, "latest", "next", git/http
 * URLs). Every version must be an exact semver like "1.2.3".
 *
 * Rationale: with the lockfile pinned and `bun install --frozen-lockfile`
 * in CI, floating ranges in package.json still cause drift the moment
 * someone runs `bun install` locally without the lockfile, or when
 * Dependabot proposes a range bump. Exact versions plus a lockfile mean
 * every environment resolves the identical tree.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const EXACT_SEMVER = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;

const pkgPath = resolve(process.cwd(), "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8")) as Record<
  string,
  unknown
>;

const buckets = [
  "dependencies",
  "devDependencies",
  "peerDependencies",
  "optionalDependencies",
  "overrides",
] as const;

const problems: string[] = [];

for (const bucket of buckets) {
  const deps = pkg[bucket];
  if (!deps || typeof deps !== "object") continue;
  for (const [name, raw] of Object.entries(deps as Record<string, string>)) {
    if (typeof raw !== "string") {
      problems.push(`${bucket}.${name}: non-string version (${typeof raw})`);
      continue;
    }
    if (!EXACT_SEMVER.test(raw)) {
      problems.push(`${bucket}.${name}: "${raw}" is not an exact version`);
    }
  }
}

if (problems.length > 0) {
  // eslint-disable-next-line no-console
  console.error(
    `\nFound ${problems.length} non-pinned dependency version(s):\n` +
      problems.map((p) => `  - ${p}`).join("\n") +
      "\n\nPin every version to an exact semver (e.g. \"1.2.3\", not \"^1.2.3\").\n",
  );
  process.exit(1);
}

// eslint-disable-next-line no-console
console.log("All dependency versions are exact semver. \u2713");
