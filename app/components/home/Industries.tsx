"use client";

import Link from "next/link";
import { Fragment, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { industries } from "../../content";
import { EASE, Preload, Reveal } from "../ui";
import { useFinePointer } from "../useChoreo";

/**
 * Industries as one sentence. The industries are the words that matter; hover one and a real
 * Printfix job for that industry floats beside the cursor. No list, no numbers, no pinned scroll.
 * Phone (or no hover): the sentence, then a swipeable row of the same jobs.
 */
export default function Industries() {
  const fine = useFinePointer();
  const [hover, setHover] = useState<number | null>(null);

  // the preview card trails the cursor on a soft spring
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 });
  const move = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
  };

  const words = industries.map((ind, i) => (
    <Link
      key={ind.n}
      href="/work/"
      onMouseEnter={() => setHover(i)}
      onFocus={() => setHover(i)}
      onBlur={() => setHover(null)}
      className={`whitespace-nowrap underline decoration-[0.06em] underline-offset-[0.12em] transition-colors duration-300 ${
        hover === null || hover === i ? "text-ink decoration-red/70" : "text-ink/30 decoration-transparent"
      }`}
    >
      {ind.title.toLowerCase()}
    </Link>
  ));

  return (
    <section id="industries" className="section overflow-hidden" aria-labelledby="industries-title">
      <Preload srcs={industries.map((x) => x.image.src.replace(".webp", "-sm.webp"))} />
      <div className="wrap">
        <h2 id="industries-title" className="sr-only">Industries we serve</h2>
        <Reveal>
          <div className="relative" onPointerMove={fine ? move : undefined} onMouseLeave={() => setHover(null)}>
            <p className="display max-w-[26ch] text-[clamp(34px,5.2vw,88px)] leading-[1.02] text-ink/30 [text-wrap:balance]">
              Packaging and print for{" "}
              {words.map((w, i) => (
                <Fragment key={i}>
                  {w}
                  {i < words.length - 2 ? ", " : i === words.length - 2 ? " and " : " brands."}
                </Fragment>
              ))}
            </p>

            {/* the floating preview: a real job for the hovered industry */}
            {fine && (
              <motion.div aria-hidden="true" style={{ x: sx, y: sy }} className="pointer-events-none absolute left-0 top-0 z-10">
                <AnimatePresence>
                  {hover !== null && (
                    <motion.figure
                      key={hover}
                      initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className="absolute left-6 top-6 w-[clamp(220px,20vw,300px)] bg-white p-2 shadow-[0_24px_48px_-16px_rgba(40,30,20,0.35)]"
                    >
                      <img src={industries[hover].image.src.replace(".webp", "-sm.webp")} alt="" width={640} height={600} className="aspect-[4/5] w-full object-cover" />
                      <figcaption className="px-1 pb-1 pt-3 text-[13px] leading-snug text-muted">{industries[hover].note}</figcaption>
                    </motion.figure>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </Reveal>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
          <Link href="/work/" className="group inline-flex items-center gap-2 border-b border-ink/30 pb-1 text-[13px] font-semibold uppercase tracking-[0.12em] text-ink hover:border-red hover:text-red">
            View our work
          </Link>
          {fine && <p className="text-[14px] text-muted">Hover an industry to see a job we made for it.</p>}
        </div>

        {/* no hover (phones, tablets): the same jobs as a swipeable row */}
        {!fine && (
          <ul className="-mx-4 mt-10 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none]">
            {industries.map((ind) => (
              <li key={ind.n} className="w-[64vw] max-w-[280px] shrink-0 snap-start">
                <Link href="/work/" className="block">
                  <img src={ind.image.src.replace(".webp", "-sm.webp")} alt={ind.image.alt} width={640} height={600} loading="lazy" className="aspect-[4/5] w-full bg-stone object-cover" />
                  <p className="mt-3 text-[17px] font-semibold text-ink [font-stretch:108%]">{ind.title}</p>
                  <p className="mt-1 text-[14px] leading-snug text-muted">{ind.note}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
