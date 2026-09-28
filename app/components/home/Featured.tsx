"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { bySlug, featured, img } from "../../portfolio";
import { Label, MoreLink, Reveal } from "../ui";

/** Featured project — a slow 0.98 → 1.02 scale as it passes through the viewport. */
export default function Featured() {
  const p = bySlug(featured);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.98, 1.02]);

  return (
    <section className="section pb-0" aria-labelledby="featured-title">
      <div className="wrap grid gap-10 lg:grid-cols-12 lg:gap-8">
        <div ref={ref} className="overflow-hidden bg-stone lg:col-span-8">
          <motion.img
            src={img(p.slug, 1)}
            alt={p.alt}
            width={1008}
            height={946}
            loading="lazy"
            style={{ scale }}
            className="aspect-[4/3] h-full w-full object-cover lg:aspect-auto lg:max-h-[82vh]"
          />
        </div>
        <Reveal className="flex flex-col justify-between gap-10 lg:col-span-4">
          <div>
            <Label>Featured work</Label>
            <h2 id="featured-title" className="display mt-6 text-[clamp(34px,3.6vw,56px)] text-ink">{p.name}</h2>
            <p className="label mt-4 text-red">{p.kind}{p.client ? ` · ${p.client}` : ""}</p>
            <p className="mt-6 max-w-[380px] text-[16px] leading-relaxed text-ink-2">
              A side-opening rigid box with a die-cut foam insert, produced for Vero Forza&rsquo;s Glide V2 finger sleeves.
            </p>
            <dl className="mt-8 border-t border-line">
              {p.specs.map((s) => (
                <div key={s.label} className="flex justify-between gap-6 border-b border-line py-3 text-[14px]">
                  <dt className="text-muted">{s.label}</dt>
                  <dd className="text-right text-ink">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <img src={img(p.slug, 2, true)} alt="The same box closed, standing on red satin" width={640} height={600} loading="lazy" className="aspect-square w-full object-cover" />
            <div className="flex items-end">
              <MoreLink href={`/work/${p.slug}/`}>View project</MoreLink>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
