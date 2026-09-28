import { why } from "../../content";
import { Label, Reveal } from "../ui";

export default function Why() {
  return (
    <section className="section bg-white" aria-labelledby="why-title">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <Label>{why.label}</Label>
            <h2 id="why-title" className="display mt-6 max-w-[13ch] text-[clamp(34px,4.4vw,68px)] text-ink">{why.title}</h2>
          </div>
        </Reveal>
        <ol className="border-t border-line lg:col-span-6 lg:col-start-7">
          {why.points.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 0.05} className="grid grid-cols-[2.5rem_1fr] gap-x-4 border-b border-line py-7 md:grid-cols-[3.5rem_1fr_1.1fr] md:gap-x-8">
              <span className="num pt-1 text-[13px] text-red">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="text-[20px] font-semibold leading-snug text-ink [font-stretch:108%] md:text-[22px]">{p.title}</h3>
              <p className="col-start-2 mt-2 text-[15px] leading-relaxed text-muted md:col-start-3 md:mt-0.5">{p.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
