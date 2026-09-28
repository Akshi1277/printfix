import { craft } from "../../content";
import { Label, Reveal } from "../ui";

/** One large real photograph with quiet material labels pinned around it. */
export default function Craft() {
  return (
    <section className="bg-stone" aria-labelledby="craft-title">
      <div className="wrap grid gap-10 py-20 md:py-28 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-4 lg:self-end">
          <Label>{craft.label}</Label>
          <h2 id="craft-title" className="display mt-6 text-[clamp(34px,4.4vw,68px)] text-ink">{craft.title}</h2>
          <p className="mt-6 max-w-[380px] text-[16px] leading-relaxed text-ink-2">{craft.body}</p>
        </Reveal>
        <Reveal delay={0.1} className="relative lg:col-span-8">
          <img src={craft.image.src} alt={craft.image.alt} width={1008} height={946} loading="lazy" className="aspect-[1008/946] w-full object-cover" />
          <ul aria-hidden="true">
            {craft.labels.map((l) => (
              <li
                key={l.text}
                style={{ left: l.x, top: l.y }}
                className="label absolute hidden items-center gap-2 bg-white/90 px-3 py-2 text-ink sm:flex"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-red" />
                {l.text}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
