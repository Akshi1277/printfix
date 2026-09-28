import { offset } from "../../content";
import { offsetProjects } from "../../portfolio";
import { Label, MoreLink, Reveal } from "../ui";

/** Homepage: offset printing, stated plainly. No extra motion — just the standard reveal. */
export default function OffsetBand() {
  const count = offsetProjects().length;
  return (
    <section className="section" aria-labelledby="offset-title">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-8">
        <Reveal className="relative lg:col-span-6">
          <img src={offset.image.src} alt={offset.image.alt} width={1008} height={946} loading="lazy" className="aspect-[1008/946] w-full bg-stone object-cover" />
          <img
            src={offset.detail.src.replace(".webp", "-sm.webp")}
            alt={offset.detail.alt}
            width={640}
            height={600}
            loading="lazy"
            className="absolute -bottom-10 -right-4 hidden w-[34%] border-[6px] border-paper object-cover md:block lg:-right-10"
          />
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-5 lg:col-start-8 lg:self-center">
          <Label>{offset.label}</Label>
          <h2 id="offset-title" className="display mt-6 text-[clamp(34px,4vw,60px)] text-ink">{offset.title}</h2>
          <p className="mt-6 text-[17px] leading-relaxed text-ink-2">{offset.lede}</p>
          <ul className="mt-8 border-t border-line">
            {offset.points.map((pt) => (
              <li key={pt.title} className="flex items-baseline gap-4 border-b border-line py-4">
                <span aria-hidden="true" className="h-[7px] w-[7px] shrink-0 translate-y-[-2px] bg-red" />
                <span className="text-[16px] font-semibold text-ink [font-stretch:106%]">{pt.title}</span>
              </li>
            ))}
          </ul>
          <div className="mt-9 flex flex-wrap gap-x-8 gap-y-4">
            <MoreLink href="/offset-printing/">About our offset printing</MoreLink>
            <MoreLink href="/work/#offset">See {count} offset-printed projects</MoreLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
