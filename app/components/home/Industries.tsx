import { industries } from "../../content";
import { Label, Reveal } from "../ui";

/**
 * Industries — plain CSS hover (no JS): the row tints, the number nudges,
 * and a thumbnail of real work for that sector opens at the end of the row.
 */
export default function Industries() {
  return (
    <section id="industries" className="section" aria-labelledby="industries-title">
      <div className="wrap">
        <div className="grid gap-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <Label>Industries we serve</Label>
            <h2 id="industries-title" className="display mt-6 max-w-[13ch] text-[clamp(34px,4.4vw,68px)] text-ink">Made for different worlds.</h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9 lg:self-end">
            <p className="text-[16px] leading-relaxed text-muted">
              Packaging and print for the sectors Printfix works with most — each with its own rules for shelf, shipping and presentation.
            </p>
          </Reveal>
        </div>

        <ul className="mt-14 border-t border-line lg:mt-20">
          {industries.map((ind) => (
            <li key={ind.n} className="group border-b border-line transition-colors duration-500 hover:bg-white">
              <div className="flex items-center gap-5 py-5 md:gap-10 md:px-4 md:py-6">
                <span className="num w-6 shrink-0 text-[13px] text-muted transition-[color,transform] duration-500 group-hover:translate-x-1 group-hover:text-red">
                  {ind.n}
                </span>
                <div className="min-w-0 flex-1 md:flex md:items-baseline md:gap-10">
                  <h3 className="display text-[clamp(24px,3.2vw,48px)] text-ink md:w-[46%] md:shrink-0">{ind.title}</h3>
                  <p className="mt-1 text-[14px] text-muted md:mt-0 md:text-[15px]">{ind.note}</p>
                </div>
                <div className="h-16 w-20 shrink-0 overflow-hidden bg-stone md:h-20 md:w-0 md:transition-[width] md:duration-500 md:ease-out md:group-hover:w-32">
                  <img
                    src={ind.image.src.replace(".webp", "-sm.webp")}
                    alt={ind.image.alt}
                    width={640}
                    height={600}
                    loading="lazy"
                    className="h-full w-full object-cover md:w-32 md:max-w-none"
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
