import Link from "next/link";
import { ArrowDown, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { process, why } from "../../content";
import { Reveal } from "../ui";

type Point = (typeof why.points)[number];
const P = (k: number) => why.points[k] as Point;

/**
 * Why Printfix: five promises as a grid of proof tiles of different sizes and kinds: two real
 * photographs, the real five-step sequence, what a price is built from, and a client who saw a
 * promise kept. No numbered list, no pinned scroll.
 */
export default function Why() {
  const [onTime, unified, custom, value, mgmt] = [0, 1, 2, 3, 4].map(P);

  return (
    <section className="section bg-white" aria-labelledby="why-title">
      <div className="wrap">
        <Reveal>
          <h2 id="why-title" className="display max-w-[16ch] text-[clamp(34px,4.6vw,72px)] text-ink [text-wrap:balance]">{why.title}</h2>
          <p className="mt-6 max-w-[440px] text-[17px] leading-relaxed text-ink-2">{why.lede}</p>
        </Reveal>

        <div className="mt-14 grid gap-3 lg:mt-16 lg:grid-cols-12 lg:grid-rows-[auto_auto_auto]">
          {/* on time: the big photograph */}
          <Reveal className="lg:col-span-7 lg:row-span-2">
            <PhotoTile p={onTime} tall />
          </Reveal>

          {/* print & pack: the actual sequence */}
          <Reveal delay={0.05} className="lg:col-span-5">
            <div className="flex h-full flex-col bg-paper p-7 md:p-8">
              <TileHead p={unified} />
              <ol className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-2" aria-label="The five steps">
                {process.map((s, i) => (
                  <li key={s.n} className="flex items-center gap-2">
                    <span className="border border-line bg-white px-3 py-1.5 text-[14px] font-medium text-ink">{s.title}</span>
                    {i < process.length - 1 && <ArrowRight aria-hidden="true" className="hidden h-3.5 w-3.5 text-ink/30 sm:block" />}
                  </li>
                ))}
              </ol>
              {unified.proof.kind === "steps" && (
                <a href={unified.proof.href} className="group mt-auto inline-flex w-fit items-center gap-2 border-b border-ink/30 pb-1 pt-6 text-[13px] font-semibold uppercase tracking-[0.12em] text-ink hover:border-red hover:text-red">
                  {unified.proof.cta} <ArrowDown aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                </a>
              )}
            </div>
          </Reveal>

          {/* value: the one dark tile, what a price is built from */}
          <Reveal delay={0.1} className="lg:col-span-5">
            <div className="flex h-full flex-col bg-ink p-7 text-white md:p-8">
              <TileHead p={value} dark />
              {value.proof.kind === "spec" && (
                <>
                  <p className="label mt-6 text-white/55">Your price is built from</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {value.proof.items.map((x) => (
                      <li key={x} className="border border-white/25 px-3 py-1.5 text-[14px] font-medium">{x}</li>
                    ))}
                    <li className="bg-red px-3 py-1.5 text-[14px] font-medium">Low MOQ</li>
                  </ul>
                  <div className="mt-auto pt-7">
                    <ClientLink client={value.proof.client} logo={value.proof.logo} text="on pricing" dark />
                  </div>
                </>
              )}
            </div>
          </Reveal>

          {/* customisation: the Glide insert */}
          <Reveal className="lg:col-span-5">
            <PhotoTile p={custom} />
          </Reveal>

          {/* management: a client who saw it happen */}
          <Reveal delay={0.05} className="lg:col-span-7">
            <div className="flex h-full flex-col justify-between gap-8 bg-paper p-7 md:p-8">
              <TileHead p={mgmt} />
              {mgmt.proof.kind === "review" && (
                <div className="grid gap-6 border-l-2 border-red pl-6 sm:grid-cols-[1fr_auto] sm:items-end">
                  <p className="text-[clamp(19px,1.6vw,24px)] font-medium leading-snug text-ink">{mgmt.proof.note}</p>
                  <ClientLink client={mgmt.proof.client} logo={mgmt.proof.logo} text="in their words" />
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function TileHead({ p, dark = false }: { p: Point; dark?: boolean }) {
  return (
    <div>
      <h3 className={`display text-[clamp(26px,2.4vw,38px)] ${dark ? "text-white" : "text-ink"}`}>{p.title}</h3>
      <p className={`mt-3 max-w-[520px] text-[16px] leading-relaxed ${dark ? "text-white/75" : "text-ink-2"}`}>{p.body}</p>
    </div>
  );
}

/** A promise told over its photograph, text on a soft scrim at the foot. */
function PhotoTile({ p, tall = false }: { p: Point; tall?: boolean }) {
  if (p.proof.kind !== "image") return null;
  return (
    <figure className={`group relative h-full overflow-hidden bg-stone ${tall ? "min-h-[460px] lg:min-h-[620px]" : "min-h-[400px]"}`}>
      <img
        src={p.proof.src}
        alt={p.proof.alt}
        width={2016}
        height={1892}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
      <figcaption className="absolute inset-x-0 bottom-0 p-7 text-white md:p-8">
        <h3 className="display text-[clamp(28px,2.8vw,44px)]">{p.title}</h3>
        <p className="mt-3 max-w-[460px] text-[16px] leading-relaxed text-white/85">{p.body}</p>
        <p className="label mt-5 text-white/60">{p.proof.caption}</p>
      </figcaption>
    </figure>
  );
}

function ClientLink({ client, logo, text, dark = false }: { client: string; logo: string; text: string; dark?: boolean }) {
  return (
    <Link href="/#testimonials" className="group flex items-center gap-4">
      <span className="flex h-14 w-24 shrink-0 items-center justify-center border border-line bg-white px-3">
        <img src={logo} alt={client} width={160} height={80} loading="lazy" className="max-h-9 w-auto object-contain" />
      </span>
      <span className={`text-[13px] font-semibold uppercase leading-tight tracking-[0.1em] group-hover:text-red ${dark ? "text-white" : "text-ink"}`}>
        {client}
        <br />
        <span className={`inline-flex items-center gap-1 font-medium normal-case tracking-normal group-hover:text-red ${dark ? "text-white/60" : "text-muted"}`}>
          {text} <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </span>
    </Link>
  );
}
