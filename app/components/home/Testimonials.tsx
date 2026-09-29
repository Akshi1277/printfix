"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { clients, testimonials } from "../../content";
import { Reveal } from "../ui";

/** Real client quotes from printfix.co.in — one at a time, no autoplay. The client logos double as the tabs. */
export default function Testimonials() {
  const [i, setI] = useState(0);
  const t = testimonials[i];
  const go = (d: number) => setI((v) => (v + d + testimonials.length) % testimonials.length);

  return (
    <section className="section bg-white" aria-labelledby="clients-title">
      <div className="wrap">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          {/* opener: a single oversized quote mark instead of the usual label */}
          <div className="flex items-end gap-5">
            <span aria-hidden="true" className="display text-[clamp(110px,12vw,190px)] leading-[0.6] text-red">&ldquo;</span>
            <h2 id="clients-title" className="display text-[clamp(34px,4.4vw,68px)] text-ink">In their words.</h2>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => go(-1)} aria-label="Previous testimonial" className="flex h-12 w-12 items-center justify-center border border-ink/20 text-ink transition-colors hover:bg-ink hover:text-white">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next testimonial" className="flex h-12 w-12 items-center justify-center border border-ink/20 text-ink transition-colors hover:bg-ink hover:text-white">
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-8">
          <div className="relative min-h-[300px] md:min-h-[200px] lg:col-span-9" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.figure
                key={t.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35 }}
              >
                <blockquote className="text-[clamp(22px,2.4vw,36px)] font-medium leading-[1.3] tracking-[-0.01em] text-ink">
                  <span aria-hidden="true" className="mr-1 text-red">&ldquo;</span>
                  {t.quote}
                  <span aria-hidden="true" className="text-red">&rdquo;</span>
                </blockquote>
                <figcaption className="mt-8 flex flex-wrap items-baseline gap-x-3 text-[15px]">
                  <span className="font-semibold text-ink">{t.name}</span>
                  <span className="text-muted">{t.role}, {t.company}</span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>
          <p className="label self-end text-muted lg:col-span-3 lg:text-right">
            <span className="num text-ink">{String(i + 1).padStart(2, "0")}</span> / {String(testimonials.length).padStart(2, "0")}
          </p>
        </div>

        <div role="tablist" aria-label="Clients" className="mt-14 grid grid-cols-3 border-l border-t border-line sm:grid-cols-5">
          {clients.map((c, k) => (
            <button
              key={c.name}
              role="tab"
              type="button"
              aria-selected={k === i}
              aria-label={`${c.name} testimonial`}
              onClick={() => setI(k)}
              className={`relative flex h-24 items-center justify-center border-b border-r border-line p-4 transition-colors md:h-28 ${k === i ? "bg-paper" : "hover:bg-paper/60"}`}
            >
              <img
                src={c.src}
                alt=""
                loading="lazy"
                className={`max-h-14 w-auto max-w-[78%] object-contain mix-blend-multiply transition-[filter,opacity] duration-500 md:max-h-16 ${k === i ? "opacity-100 grayscale-0" : "opacity-75 grayscale"}`}
              />
              <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-[2px] bg-red transition-transform duration-500 ${k === i ? "scale-x-100" : "scale-x-0"}`} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
