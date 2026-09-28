import { intro } from "../../content";
import { Label, MoreLink, Reveal } from "../ui";

export default function Intro() {
  return (
    <section className="section">
      <div className="wrap grid gap-10 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-7">
          <Label>{intro.label}</Label>
          <h2 className="display mt-6 max-w-[14ch] text-[clamp(34px,4.4vw,68px)] text-ink">{intro.title}</h2>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9 lg:pt-14">
          {intro.body.map((p) => (
            <p key={p.slice(0, 20)} className="mb-5 text-[17px] leading-relaxed text-ink-2">{p}</p>
          ))}
          <div className="mt-8">
            <MoreLink href="/about/">About Printfix</MoreLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
