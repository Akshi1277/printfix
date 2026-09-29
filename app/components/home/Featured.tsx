"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { bySlug, featured, img } from "../../portfolio";
import { Label, MoreLink, Reveal } from "../ui";
import { useChoreo } from "../useChoreo";

/**
 * Featured project — Ruixuecui. The photograph is shown at its own proportions (never cropped),
 * the specification is set as editorial type, and two more views sit beneath the text.
 * A slow 0.97 → 1.02 scale as it passes.
 */
export default function Featured() {
  const p = bySlug(featured);
  const ref = useRef<HTMLDivElement>(null);
  const choreo = useChoreo();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.97, 1.02]);

  return (
    <section className="bg-charcoal py-20 text-white md:py-28" aria-labelledby="featured-title">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div ref={ref} className="overflow-hidden bg-white/5 lg:col-span-7">
          <motion.img src={img(p.slug, 1)} alt={p.alt} width={2016} height={1892} loading="lazy" style={choreo ? { scale } : undefined} className="aspect-[1008/946] w-full object-cover" />
        </div>

        <div className="flex flex-col lg:col-span-5">
          <Reveal>
            <Label light>Featured project</Label>
            <h2 id="featured-title" className="display mt-6 text-[clamp(44px,5.4vw,92px)]">{p.name}</h2>
            <p className="mt-5 max-w-[440px] text-[17px] leading-relaxed text-white/75">
              A book-style rigid box with a hidden magnetic flap — blind embossed, light-gold foil stamped and finished in matte / soft-touch lamination, made for premium brand kits.
            </p>
          </Reveal>

          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8">
            {p.specs.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.05} className={`border-t border-white/20 pt-4 ${s.label === "Finish" ? "col-span-2" : ""}`}>
                <dt className="label text-white/50">{s.label}</dt>
                <dd className="mt-2 text-[clamp(18px,1.5vw,24px)] font-semibold leading-snug [font-stretch:108%]">{s.value}</dd>
              </Reveal>
            ))}
          </dl>

          <div className="mt-10 grid grid-cols-2 gap-3">
            {[2, 4].map((n) => (
              <img key={n} src={img(p.slug, n, true)} alt={`${p.name} — ${n === 2 ? "blind-embossed lettering" : "foil detail"}`} width={640} height={600} loading="lazy" className="aspect-square w-full object-cover" />
            ))}
          </div>
          <div className="mt-8">
            <MoreLink href={`/work/${p.slug}/`} light>Read the case study</MoreLink>
          </div>
        </div>
      </div>
    </section>
  );
}
