import { siteConfig } from "@/config/site";
import { LegalLayout } from "./LegalLayout";

export function Privacy() {
  return (
    <LegalLayout title="Privacy" updated="LAST UPDATED · 2025-07-03">
      <p>
        This website is a static informational page for the {siteConfig.name}{" "}
        community. It is designed to collect no personal data whatsoever.
      </p>

      <h2 className="font-serif text-2xl">What we collect</h2>
      <p>
        <strong>Nothing.</strong> This site does not use cookies, analytics,
        tracking pixels, session recording, fingerprinting, embedded social
        widgets, third-party fonts, third-party scripts, or advertising
        networks. There are no forms and no user accounts. No requests are
        made to any origin other than the one serving this site.
      </p>
      <p>
        The only browser-storage value written is a single{" "}
        <code>localStorage</code> entry named <code>koji-theme</code> which
        remembers your light / grey / dark preference. It never leaves your
        device.
      </p>

      <h2 className="font-serif text-2xl">Hosting logs</h2>
      <p>
        The static hosting provider (GitHub Pages or Cloudflare Pages) may
        collect standard HTTP request logs including IP address, user agent,
        and requested URL for the purpose of security, abuse prevention, and
        service operation. These logs are controlled by the hosting provider
        under their respective privacy policies; we do not access, aggregate,
        or retain them.
      </p>

      <h2 className="font-serif text-2xl">The Discord platform</h2>
      <p>
        Clicking the Discord invite navigates you to discord.com, which is an
        independent third-party service governed by its own{" "}
        <a
          href="https://discord.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          privacy policy
        </a>
        . Anything you do inside Discord is subject to that policy and to the
        community's server rules. This website is not affiliated with Discord.
      </p>

      <h2 className="font-serif text-2xl">Your rights</h2>
      <p>
        Because we hold no personal data about you, requests under the GDPR
        (EU/UK), the CCPA (California), and the Texas Data Privacy and
        Security Act (TDPSA) to access, correct, delete, or port your data
        will be answered truthfully: we have nothing to return. If you
        interact with us inside the Discord community, please direct
        platform-related requests to Discord, Inc.
      </p>
      <p>
        If you wish to contact us regarding this notice, email{" "}
        <a href={`mailto:${siteConfig.contactEmail}`} className="underline">
          {siteConfig.contactEmail}
        </a>
        .
      </p>

      <h2 className="font-serif text-2xl">Children</h2>
      <p>
        This site is directed at a general audience and does not knowingly
        collect information from anyone, including children under 13.
      </p>

      <h2 className="font-serif text-2xl">Changes</h2>
      <p>
        If the site ever begins collecting data, this page will be updated
        and the "last updated" date at the top will change. Until then, this
        statement is intentionally simple: no data, no tracking.
      </p>
    </LegalLayout>
  );
}
