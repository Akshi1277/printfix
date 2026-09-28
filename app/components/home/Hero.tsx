"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { hero, quoteHref } from "../../content";
import { Button, EASE, Label } from "../ui";

/**
 * Motion moment 1 — the hero reveal.
 * Text rises in sequence; the photograph opens through a mask and settles from 1.03 → 1.
 * On scroll the image drifts up slightly. Nothing else.
 */
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const drift = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);

  const rise = (i: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: EASE, delay: 0.15 + i * 0.1 },
  });

  return (
    <section ref={ref} className="relative overflow-hidden pt-24 md:pt-28">
      <div className="wrap grid items-end gap-10 pb-14 md:pb-20 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5 lg:pb-6">
          <motion.div {...rise(0)}>
            <Label>{hero.label}</Label>
          </motion.div>
          <h1 className="display mt-6 text-[clamp(42px,5.6vw,88px)] text-ink">
            {hero.title.map((line, i) => (
              <motion.span key={line} {...rise(i + 1)} className="block">
                {line}
              </motion.span>
            ))}
          </h1>
          <motion.p {...rise(3)} className="mt-7 max-w-[460px] text-[17px] leading-relaxed text-ink-2 md:text-[18px]">
            {hero.body}
          </motion.p>
          <motion.div {...rise(4)} className="mt-9 flex flex-wrap gap-3">
            <Button href={quoteHref}>Get a quote</Button>
            <Button href="/work/" variant="outline">Explore our work</Button>
          </motion.div>
        </div>

        <div className="relative lg:col-span-7">
          <motion.div
            initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            transition={{ duration: 1.2, ease: EASE, delay: 0.1 }}
            className="relative aspect-[1008/946] overflow-hidden bg-stone"
          >
            <motion.img
              src={hero.image.src}
              alt={hero.image.alt}
              width={1008}
              height={946}
              fetchPriority="high"
              initial={{ scale: 1.03 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.8, ease: EASE, delay: 0.1 }}
              style={{ y: drift }}
              className="h-[108%] w-full object-cover"
            />
          </motion.div>

          {/* inset detail — a second real piece, overlapping the frame */}
          <motion.figure
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.75 }}
            className="absolute -bottom-8 -left-6 hidden w-[30%] border-[6px] border-paper bg-paper md:block lg:-left-16"
          >
            <img src={hero.inset.src} alt={hero.inset.alt} width={1008} height={946} className="aspect-square w-full object-cover" />
            <figcaption className="label px-1 pb-1 pt-3 text-muted">Rigid box · Die-cut insert</figcaption>
          </motion.figure>
        </div>
      </div>
    </section>
  );
}
