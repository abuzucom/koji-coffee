/**
 * Single source of truth for site-wide constants.
 *
 * The Discord invite is intentionally centralised here so that updating it
 * requires exactly one edit and cannot drift between components.
 *
 * Replace `REPLACE_ME` with your real Discord invite code before deploying.
 */
export const siteConfig = {
  name: "koji.coffee",
  tagline: "Coffee, cultured.",
  description:
    "A Discord community for craft coffee enthusiasts exploring experimental brewing and scientific methodology.",
  discordInviteUrl: "https://discord.gg/REPLACE_ME",
  githubUrl: "https://github.com/koji-coffee/koji.coffee",
  contactEmail: "hello@koji.coffee",
  founded: "2024",
} as const;

export type SiteConfig = typeof siteConfig;
