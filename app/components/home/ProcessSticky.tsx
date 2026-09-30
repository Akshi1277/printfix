"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useTransform } from "framer-motion";
import { process } from "../../content";
import { EASE, Label, Preload } from "../ui";
import { useChoreo, useSectionProgress } from "../useChoreo";

// a quiet background shift per step: paper → stone and back
const tints = ["#F4F3F0", "#EFEDE8", "#E9E6DF", "#EFEDE8", "#F4F3F0"];

/**
 * Moment 8 — the process, as the page's main scroll story (≈300vh, sticky).
 * Scrolling advances Understand → Design & sample → Material & print → Finish & pack → Check & deliver:
 * the big word changes, the photograph of that stage crossfades, the line of copy changes,
 * the background shifts a shade, and a progress rule fills.
 */
// Remount when switching between static and scroll-driven modes so useScroll binds to the live element.
export default function ProcessSticky() {
  const choreo = useChoreo();
  return <ProcessStickyImpl key={choreo ? "choreo" : "static"} choreo={choreo} />;
}

function ProcessStickyImpl({ choreo }: { choreo: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const [i, setI] = useState(0);
  const scrollYProgress = useSectionProgress(ref);
  useMotionValueEvent(scrollYProgress, "change", (v) => setI(Math.min(process.length - 1, Math.floor(v * process.length))));
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const s = process[i];

  if (!choreo) {
    return (
      <section id="process" ref={ref} className="section" aria-labelledby="process-title">
        <div className="wrap">
          <Label>How we work</Label>
          <h2 id="process-title" className="display mt-6 text-[clamp(34px,6vw,72px)] text-ink">Five steps, one sequence.</h2>
          <ol className="mt-12 grid gap-12">
            {process.map((x) => (
              <li key={x.n} className="grid gap-5 sm:grid-cols-2 sm:items-end">
                <img src={x.image.src.replace(".webp", "-sm.webp")} alt={x.image.alt} width={640} height={600} loading="lazy" className="aspect-[4/3] w-full bg-stone object-cover" />
                <div>
                  <span className="num text-[13px] text-red">{x.n}</span>
                  <h3 className="display mt-2 uppercase text-[clamp(30px,8vw,52px)] text-ink">{x.title}</h3>
                  <p className="mt-3 text-[16px] leading-relaxed text-ink-2">{x.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <motion.section
      id="process"
      ref={ref}
      animate={{ backgroundColor: tints[i] }}
      transition={{ duration: 0.8 }}
      className="relative h-[320vh]"
      aria-labelledby="process-title"
    >
      <div className="sticky top-0 flex h-[100dvh] items-center overflow-hidden">
        <Preload srcs={process.map((x) => x.image.src)} />
        <div className="wrap grid grid-cols-12 items-center gap-8">
          <div className="col-span-6">
            <Label>How we work</Label>
            <h2 id="process-title" className="sr-only">Our five-step process</h2>
            <ol className="mt-8 flex gap-2" aria-label="Steps">
              {process.map((x, k) => (
                <li key={x.n} aria-current={k === i ? "step" : undefined} className={`num text-[13px] transition-colors ${k === i ? "text-red" : k < i ? "text-ink" : "text-ink/25"}`}>
                  {x.n}{k < process.length - 1 && <span aria-hidden="true" className="mx-2 inline-block h-px w-4 bg-ink/20 align-middle" />}
                </li>
              ))}
            </ol>
            <div className="relative mt-6 h-[clamp(96px,11.5vw,176px)] overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.p
                  key={s.title}
                  initial={{ y: "70%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-70%", opacity: 0 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="display absolute inset-x-0 top-0 uppercase text-[clamp(40px,5.2vw,84px)] text-ink"
                >
                  {s.title}
                </motion.p>
              </AnimatePresence>
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={s.body}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="mt-6 max-w-[440px] text-[18px] leading-relaxed text-ink-2"
              >
                {s.body}
              </motion.p>
            </AnimatePresence>
            <div className="mt-10 h-[2px] w-full max-w-[440px] bg-ink/10">
              <motion.div style={{ width: bar }} className="h-full bg-red" />
            </div>
          </div>

          <div className="relative col-span-5 col-start-8 aspect-[1008/946] max-h-[72vh] overflow-hidden bg-stone">
            <AnimatePresence initial={false}>
              <motion.img
                key={s.image.src}
                src={s.image.src}
                alt={s.image.alt}
                width={2016}
                height={1892}
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: EASE }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>
          </div>
        </div>
      </div>
      {/* the steps as plain text for screen readers and search engines */}
      <ol className="sr-only">
        {process.map((x) => (
          <li key={x.n}>{x.n} {x.title}: {x.body}</li>
        ))}
      </ol>
    </motion.section>
  );
}
