import { LegalLayout } from "./LegalLayout";

export function Cookies() {
  return (
    <LegalLayout title="Cookies" updated="LAST UPDATED · 2025-07-03">
      <p>
        <strong>This site does not use cookies.</strong>
      </p>
      <p>
        No first-party cookies, no third-party cookies, no session cookies,
        no advertising cookies. There is nothing to consent to and no consent
        banner is shown because none is required under the ePrivacy Directive,
        GDPR, CCPA, or TDPSA when no such technologies are used.
      </p>
      <h2 className="font-serif text-2xl">What we do store locally</h2>
      <p>
        A single <code>localStorage</code> entry named{" "}
        <code>koji-theme</code> remembers your light / grey / dark theme
        preference. <code>localStorage</code> is not a cookie: it is a purely
        local browser mechanism, never transmitted in HTTP requests, and
        contains no personal data. You can clear it at any time in your
        browser's site-settings panel.
      </p>
    </LegalLayout>
  );
}
