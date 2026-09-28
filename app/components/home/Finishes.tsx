"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { finishes } from "../../content";
import { EASE, Label, Reveal } from "../ui";

/**
 * Motion moment 4 — finishes.
 * Selecting a finish crossfades a macro photograph of it (small scale + a few pixels of drift).
 * It is a real tablist, so it works by keyboard (arrow keys) and by tap.
 */
export default function Finishes() {
  const [active, setActive] = useState(0);
  const f = finishes[active];

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp" && e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const dir = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : -1;
    const next = (active + dir + finishes.length) % finishes.length;
    setActive(next);
    document.getElementById(`finish-tab-${next}`)?.focus();
  };

  return (
    <section className="section bg-charcoal text-white" aria-labelledby="finish-title">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <Reveal>
            <Label light>Materials & finishes</Label>
            <h2 id="finish-title" className="display mt-6 max-w-[12ch] text-[clamp(34px,4.4vw,68px)]">The detail is in the finish.</h2>
            <p className="mt-6 max-w-[400px] text-[16px] leading-relaxed text-white/65">
              Finishes Printfix has used across its rigid boxes, cartons, bags and books.
            </p>
          </Reveal>

          {/* mobile: the selected finish sits right above the list, so a tap shows its photo in view */}
          <div className="relative mt-10 aspect-[4/3] overflow-hidden bg-white/5 lg:hidden">
            <AnimatePresence initial={false}>
              <motion.img
                key={f.key}
                src={f.image.src.replace(".webp", "-sm.webp")}
                alt={f.image.alt}
                width={640}
                height={600}
                loading="lazy"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>
          </div>

          <div role="tablist" aria-orientation="vertical" aria-label="Finishes" onKeyDown={onKey} className="mt-10 border-t border-white/15">
            {finishes.map((x, i) => {
              const on = i === active;
              return (
                <button
                  key={x.key}
                  id={`finish-tab-${i}`}
                  role="tab"
                  type="button"
                  aria-selected={on}
                  aria-controls="finish-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  className="group flex w-full items-baseline gap-5 border-b border-white/15 py-4 text-left"
                >
                  <span className={`num w-6 text-[12px] transition-colors ${on ? "text-red" : "text-white/35"}`}>{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex-1">
                    <span className={`block text-[19px] font-semibold transition-[color,transform] duration-500 [font-stretch:108%] md:text-[21px] ${on ? "translate-x-2 text-white" : "text-white/55 group-hover:text-white/80"}`}>
                      {x.title}
                    </span>
                    <span className={`grid transition-[grid-template-rows,opacity] duration-500 ${on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                      <span className="overflow-hidden">
                        <span className="block max-w-[380px] translate-x-2 pt-2 text-[14px] leading-relaxed text-white/60">{x.body}</span>
                      </span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div id="finish-panel" role="tabpanel" aria-labelledby={`finish-tab-${active}`} className="hidden lg:col-span-7 lg:block">
          <div className="relative aspect-[1008/946] overflow-hidden bg-white/5 lg:sticky lg:top-28">
            <AnimatePresence initial={false}>
              <motion.img
                key={f.key}
                src={f.image.src}
                alt={f.image.alt}
                width={1008}
                height={946}
                loading="lazy"
                initial={{ opacity: 0, scale: 1.04, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: EASE }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>
            <p className="label absolute bottom-0 right-0 bg-charcoal px-4 py-3 text-white/80">{f.title}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
