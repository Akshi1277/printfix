import Link from "next/link";
import { why } from "../../content";
import { Reveal } from "../ui";

/** Why Printfix: each promise sits next to its evidence: a client's words, a real project, or the process. */
export default function Why() {
  return (
    <section className="section bg-white" aria-labelledby="why-title">
      <div className="wrap">
        <Reveal>
          <h2 id="why-title" className="display max-w-[15ch] text-[clamp(34px,4.6vw,72px)] text-ink">{why.title}</h2>
        </Reveal>
        <ol className="mt-14 border-t border-ink lg:mt-20">
          {why.points.map((pt, i) => (
            <Reveal as="li" key={pt.title} className="grid gap-6 border-b border-line py-10 lg:grid-cols-12 lg:gap-8 lg:py-12">
              <span className="num text-[13px] text-red lg:col-span-1">{String(i + 1).padStart(2, "0")}</span>
              <div className="lg:col-span-5">
                <h3 className="display text-[clamp(26px,2.6vw,40px)] text-ink">{pt.title}</h3>
                <p className="mt-4 max-w-[460px] text-[16px] leading-relaxed text-ink-2">{pt.body}</p>
              </div>
              <div className="lg:col-span-5 lg:col-start-8">
                {pt.proof.kind === "quote" && (
                  <figure className="border-l-2 border-red pl-6">
                    <blockquote className="text-[clamp(19px,1.6vw,24px)] font-medium leading-snug text-ink">&ldquo;{pt.proof.text}&rdquo;</blockquote>
                    <figcaption className="mt-3 text-[14px] text-muted">{pt.proof.by}</figcaption>
                  </figure>
                )}
                {pt.proof.kind === "image" && (
                  <figure>
                    <img src={pt.proof.src} alt={pt.proof.alt} width={2016} height={1892} loading="lazy" className="aspect-[16/10] w-full bg-stone object-cover" />
                    <figcaption className="label mt-3 text-muted">Glide V2, die-cut insert</figcaption>
                  </figure>
                )}
                {pt.proof.kind === "link" && (
                  <Link href={pt.proof.href} className="group inline-flex items-center gap-3 text-[clamp(19px,1.6vw,24px)] font-medium text-ink">
                    <span className="border-b border-ink/30 pb-1 transition-colors group-hover:border-red group-hover:text-red">{pt.proof.text}</span>
                    <span aria-hidden="true" className="transition-transform group-hover:translate-y-1">↓</span>
                  </Link>
                )}
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
