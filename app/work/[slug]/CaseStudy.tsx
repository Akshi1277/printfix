import { img, type Project } from "../../portfolio";
import { Label, Reveal } from "../../components/ui";

// Chapters are assembled only from the project's own specification fields — nothing is invented.
const CHAPTERS: { title: string; keys: string[] }[] = [
  { title: "The product", keys: ["Product", "Use"] },
  { title: "The structure", keys: ["Type", "Style", "Size", "Binding"] },
  { title: "The closure", keys: ["Closure", "Handles"] },
  { title: "The finish", keys: ["Finish", "Colour"] },
  { title: "The industry", keys: ["Industry"] },
];

/** Richer editorial layout for the selected case studies. */
export default function CaseStudy({ p }: { p: Project }) {
  const chapters = CHAPTERS.map((c) => ({ ...c, rows: p.specs.filter((s) => c.keys.includes(s.label)) })).filter((c) => c.rows.length);
  const pic = (k: number) => (k % p.images) + 1;

  return (
    <>
      <section className="wrap">
        <img src={img(p.slug, 1)} alt={p.alt} width={2016} height={1892} fetchPriority="high" className="aspect-[1008/946] w-full bg-stone object-cover lg:w-2/3" />
        <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-ink pt-8 md:grid-cols-4">
          {[...(p.client ? [{ label: "Client", value: p.client }] : []), { label: "Category", value: p.kind }, ...p.specs.slice(0, 2)].map((s) => (
            <div key={s.label}>
              <dt className="label text-muted">{s.label}</dt>
              <dd className="mt-2 text-[clamp(18px,1.6vw,24px)] font-semibold leading-tight text-ink [font-stretch:108%]">{s.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="wrap section" aria-label="Project chapters">
        <div className="grid gap-24">
          {chapters.map((c, k) => (
            <Reveal key={c.title} className="grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
              <div className={`lg:col-span-5 ${k % 2 ? "lg:order-2 lg:col-start-8" : ""}`}>
                <Label>{String(k + 1).padStart(2, "0")} · {c.title}</Label>
                {c.rows.map((r) => (
                  <div key={r.label} className="mt-6 border-t border-line pt-4">
                    <p className="label text-muted">{r.label}</p>
                    <p className="mt-2 text-[clamp(22px,2.2vw,34px)] font-semibold leading-snug text-ink [font-stretch:106%]">{r.value}</p>
                  </div>
                ))}
              </div>
              <div className={`lg:col-span-6 ${k % 2 ? "lg:order-1" : "lg:col-start-7"}`}>
                <img src={img(p.slug, pic(k + 1))} alt={`${p.name}, ${c.title.replace("The ", "").toLowerCase()}`} width={2016} height={1892} loading="lazy" className="aspect-[1008/946] w-full bg-stone object-cover" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-white py-20" aria-labelledby="final-title">
        <div className="wrap">
          <Label>The final piece</Label>
          <h2 id="final-title" className="display mt-6 text-[clamp(30px,3.4vw,52px)] text-ink">{p.name}, finished.</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {Array.from({ length: p.images }, (_, i) => i + 1).map((n) => (
              <img key={n} src={img(p.slug, n)} alt={`${p.name}, view ${n}`} width={2016} height={1892} loading="lazy" className={`w-full bg-stone object-cover ${n === 1 && p.images % 2 === 1 ? "aspect-[16/9] sm:col-span-2" : "aspect-[1008/946]"}`} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
