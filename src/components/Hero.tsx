import { siteConfig } from "@/config/site";
import heroLab from "@/assets/hero-lab.jpg";

export function Hero() {
  return (
    <section className="section-y">
      <figure className="mb-label">
        <img
          src={heroLab}
          alt="Erlenmeyer flask filled with brewed coffee beside a beaker, pipette, and scattered beans"
          width={1600}
          height={1024}
          className="block w-full grayscale"
        />
      </figure>
      <h1 className="font-display text-[42px] leading-[1.04] tracking-[-0.035em] sm:text-[60px] sm:leading-[1.02] md:text-[72px] md:leading-[1.0] md:tracking-[-0.04em]">
        A small room for people who brew coffee like a laboratory.
      </h1>
      <p className="prose-body mt-block max-w-[56ch]">
        koji.coffee is an open Discord for roasters, home brewers, and one
        stubborn microbiologist — trading fermentation logs, extraction
        heresies, and blind cupping data.
      </p>
      <div className="mt-cta flex flex-wrap items-center gap-x-8 gap-y-4">
        <a
          href={siteConfig.discordInviteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          Join the Discord
          <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </section>
  );
}
