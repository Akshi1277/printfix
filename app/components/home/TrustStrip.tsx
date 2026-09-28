import { trust } from "../../content";
import { Reveal } from "../ui";

/** Verified facts only — see content.ts. */
export default function TrustStrip() {
  return (
    <section aria-label="At a glance" className="border-y border-line bg-white">
      <ul className="wrap grid sm:grid-cols-2 lg:grid-cols-4">
        {trust.map((t, i) => (
          <Reveal
            as="li"
            key={t.big}
            delay={i * 0.06}
            className={`py-8 sm:px-6 lg:py-10 ${i > 0 ? "border-t border-line sm:border-t-0" : ""} ${i % 2 === 1 ? "sm:border-l" : ""} ${
              i > 1 ? "sm:border-t lg:border-t-0" : ""
            } lg:border-l lg:first:border-l-0 lg:first:pl-0 border-line`}
          >
            <p className="display text-[clamp(26px,2.4vw,36px)] text-ink">{t.big}</p>
            <p className="mt-3 max-w-[280px] text-[14px] leading-relaxed text-muted">{t.small}</p>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
