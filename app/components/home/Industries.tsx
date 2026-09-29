"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { industries } from "../../content";
import { EASE, Label, Preload, Reveal } from "../ui";
import { useChoreo, useSectionProgress } from "../useChoreo";

/**
 * Moment 7 — industries.
 * Desktop: a short sticky run (~1.7 screens). As you scroll, the active industry advances,
 * the large image crossfades and the list highlights — hover jumps to any line.
 * Mobile / reduced motion: a plain list with a thumbnail per industry.
 */
// Remount when switching between static and scroll-driven modes so useScroll binds to the live element.
export default function Industries() {
  const choreo = useChoreo();
  return <IndustriesImpl key={choreo ? "choreo" : "static"} choreo={choreo} />;
}

function IndustriesImpl({ choreo }: { choreo: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const scrollYProgress = useSectionProgress(ref);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (choreo) setActive(Math.min(industries.length - 1, Math.floor(v * industries.length)));
  });
  useEffect(() => setHover(null), [active]);
  const i = hover ?? active;
  const ind = industries[i];

  const head = (
    <Reveal className="grid gap-6 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <Label>Industries we serve</Label>
        <h2 id="industries-title" className="display mt-6 text-[clamp(34px,4.6vw,72px)] text-ink">Made for different worlds.</h2>
      </div>
    </Reveal>
  );

  if (!choreo) {
    return (
      <section id="industries" ref={ref} className="section" aria-labelledby="industries-title">
        <div className="wrap">
          {head}
          <ul className="mt-12 border-t border-line">
            {industries.map((x) => (
              <li key={x.n} className="flex items-center gap-5 border-b border-line py-5">
                <span className="num w-6 shrink-0 text-[13px] text-red">{x.n}</span>
                <div className="min-w-0 flex-1">
                  <h3 className="display text-[clamp(24px,6vw,40px)] text-ink">{x.title}</h3>
                  <p className="mt-1 text-[14px] text-muted">{x.note}</p>
                </div>
                <img src={x.image.src.replace(".webp", "-sm.webp")} alt={x.image.alt} width={640} height={600} loading="lazy" className="h-20 w-24 shrink-0 bg-stone object-cover" />
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  return (
    <section id="industries" ref={ref} className="relative h-[170vh]" aria-labelledby="industries-title">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <Preload srcs={industries.map((x) => x.image.src)} />
        <div className="wrap">
          {head}
          <div className="mt-10 grid grid-cols-12 gap-8">
            <div className="relative col-span-5 aspect-[1008/946] max-h-[58vh] overflow-hidden bg-stone">
              <AnimatePresence initial={false}>
                <motion.img
                  key={ind.n}
                  src={ind.image.src}
                  alt={ind.image.alt}
                  width={1008}
                  height={946}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>
            </div>
            <ul className="col-span-7 self-center border-t border-line" onMouseLeave={() => setHover(null)}>
              {industries.map((x, k) => {
                const on = k === i;
                return (
                  <li key={x.n} onMouseEnter={() => setHover(k)} className={`border-b border-line transition-colors duration-500 ${on ? "bg-white" : ""}`}>
                    <Link href="/work/" className="flex items-center gap-6 px-4 py-4">
                      <span className={`num w-8 text-[13px] transition-[color,transform] duration-500 ${on ? "translate-x-1 text-red" : "text-muted"}`}>{x.n}</span>
                      <div className="flex-1">
                        <h3 className={`display text-[clamp(24px,2.6vw,40px)] transition-colors duration-500 ${on ? "text-ink" : "text-ink/35"}`}>{x.title}</h3>
                        <p className={`overflow-hidden text-[15px] text-muted transition-[max-height,opacity] duration-500 ${on ? "max-h-10 opacity-100" : "max-h-0 opacity-0"}`}>{x.note}</p>
                      </div>
                      <ArrowRight aria-hidden="true" className={`h-5 w-5 transition-[transform,color] duration-500 ${on ? "translate-x-0 text-red" : "-translate-x-2 text-ink/20"}`} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
