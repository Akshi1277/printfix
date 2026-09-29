import { intro } from "../../content";
import { Label, MoreLink, Reveal } from "../ui";

/**
 * Brand introduction — the statement and its copy on the left, one large real piece on the right,
 * so the three parts read as one composition instead of three corners of an empty block.
 */
export default function Intro() {
  return (
    <section className="section" aria-labelledby="intro-title">
      <div className="wrap grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-6">
          <Label>{intro.label}</Label>
          <h2 id="intro-title" className="display mt-7 text-[clamp(36px,4.6vw,76px)] text-ink [text-wrap:balance]">
            The first thing your customer holds is <span className="whitespace-nowrap text-red">the box.</span>
          </h2>
          <div className="mt-10 max-w-[480px]">
            {intro.body.map((p) => (
              <p key={p.slice(0, 16)} className="mb-5 text-[17px] leading-relaxed text-ink-2 md:text-[18px]">{p}</p>
            ))}
            <div className="mt-6">
              <MoreLink href="/about/">About Printfix</MoreLink>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-6">
          <figure>
            <img src={intro.detail.src} alt={intro.detail.alt} width={2016} height={1892} loading="lazy" className="aspect-[1008/946] w-full bg-stone object-cover" />
            <figcaption className="label mt-3 text-muted">{intro.detailCaption}</figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
