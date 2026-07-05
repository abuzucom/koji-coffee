import { siteConfig } from "@/config/site";
import { LegalLayout } from "./LegalLayout";

export function Terms() {
  return (
    <LegalLayout title="Terms" updated="LAST UPDATED · 2025-07-03">
      <p>
        This website is provided "as is" as an informational front door to
        the {siteConfig.name} Discord community. It offers no product,
        service, or transaction and does not create any account or user
        relationship with you.
      </p>
      <h2 className="font-serif text-2xl">Community participation</h2>
      <p>
        Participation in the Discord community is governed by the server's
        internal rules and by Discord's own Terms of Service. Moderators may
        remove members who violate those rules. Nothing on this page grants
        any right of admission or continued membership.
      </p>
      <h2 className="font-serif text-2xl">Content and trademarks</h2>
      <p>
        All content on this page is © {siteConfig.founded}–present the
        maintainers of {siteConfig.name}. Trademarks and brand names of third
        parties (including Discord) remain the property of their owners.
      </p>
      <h2 className="font-serif text-2xl">Disclaimers</h2>
      <p>
        Brewing coffee involves hot liquids, sharp objects, and — in some of
        our experiments — laboratory equipment. Any protocols you find here
        or in the community are shared for educational and enthusiast
        purposes. You are responsible for your own safety, your own
        equipment, and your own kitchen.
      </p>
      <h2 className="font-serif text-2xl">Contact</h2>
      <p>
        Legal or security correspondence:{" "}
        <a href={`mailto:${siteConfig.contactEmail}`} className="underline">
          {siteConfig.contactEmail}
        </a>
        .
      </p>
    </LegalLayout>
  );
}
