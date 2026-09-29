import { intro } from "../../content";
import { Label, MoreLink, Reveal } from "../ui";

/** Brand introduction — one large statement, a short paragraph, one real detail. */
export default function Intro() {
  return (
    <section className="section" aria-labelledby="intro-title">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-8">
          <Label>{intro.label}</Label>
          <h2 id="intro-title" className="display mt-7 text-[clamp(36px,5vw,80px)] text-ink">{intro.title}</h2>
        </Reveal>
        <Reveal delay={0.1} className="grid gap-8 sm:grid-cols-2 lg:col-span-12 lg:grid-cols-12 lg:gap-8">
          <figure className="lg:col-span-3 lg:col-start-1">
            <img src={intro.detail.src} alt={intro.detail.alt} width={2016} height={1892} loading="lazy" className="aspect-square w-full bg-stone object-cover" />
            <figcaption className="label mt-3 text-muted">{intro.detailCaption}</figcaption>
          </figure>
          <div className="self-end lg:col-span-5 lg:col-start-8">
            {intro.body.map((p) => (
              <p key={p.slice(0, 16)} className="mb-5 text-[17px] leading-relaxed text-ink-2 md:text-[18px]">{p}</p>
            ))}
            <div className="mt-6">
              <MoreLink href="/about/">About Printfix</MoreLink>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
