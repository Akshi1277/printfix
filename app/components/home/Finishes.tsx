"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { finishes } from "../../content";
import { EASE, Label, Preload, Reveal } from "../ui";
import { useFinePointer } from "../useChoreo";

/**
 * Moment 5 — materials & finishes.
 * Choose a finish: its macro photograph crossfades in (slight scale + drift).
 * Moment 6 — light: on a mouse/trackpad, the pointer becomes a raking light over the macro —
 * a soft highlight follows it and the photograph shifts up to ~10px against it, so foil and
 * embossing catch the light the way they do in the hand. Off on touch and reduced motion.
 */
export default function Finishes() {
  const [active, setActive] = useState(0);
  const f = finishes[active];
  const fine = useFinePointer();
  const box = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.35);
  const sx = useSpring(mx, { stiffness: 120, damping: 20 });
  const sy = useSpring(my, { stiffness: 120, damping: 20 });
  const shiftX = useTransform(sx, [0, 1], [10, -10]);
  const shiftY = useTransform(sy, [0, 1], [8, -8]);
  const light = useTransform([sx, sy], ([x, y]) =>
    `radial-gradient(circle at ${(x as number) * 100}% ${(y as number) * 100}%, rgba(255,244,222,0.55) 0%, rgba(255,244,222,0.12) 22%, rgba(0,0,0,0) 45%)`,
  );

  const move = (e: React.PointerEvent) => {
    if (!fine || !box.current) return;
    const r = box.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };

  const onKey = (e: React.KeyboardEvent) => {
    const k = e.key;
    if (!["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"].includes(k)) return;
    e.preventDefault();
    const next = (active + (k === "ArrowDown" || k === "ArrowRight" ? 1 : -1) + finishes.length) % finishes.length;
    setActive(next);
    document.getElementById(`finish-tab-${next}`)?.focus();
  };

  return (
    <section className="section bg-charcoal text-white" aria-labelledby="finish-title">
      <Preload srcs={finishes.map((x) => x.image.src)} />
      <div className="wrap">
        <Reveal className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Label light>Materials & finishes</Label>
            <h2 id="finish-title" className="display mt-6 text-[clamp(38px,5.4vw,88px)]">The detail is in the finish.</h2>
          </div>
          <p className="max-w-[380px] text-[16px] leading-relaxed text-white/65 lg:col-span-4 lg:col-start-9 lg:self-end">
            The finishes Printfix offers across boxes, cartons, bags and books. {fine ? "Move across the photograph to catch the light." : ""}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div id="finish-panel" role="tabpanel" aria-labelledby={`finish-tab-${active}`} className="lg:col-span-8">
            <div
              ref={box}
              onPointerMove={move}
              onPointerLeave={() => { mx.set(0.5); my.set(0.35); }}
              className="relative aspect-[4/3] overflow-hidden bg-white/5"
            >
              <AnimatePresence initial={false}>
                <motion.div
                  key={f.key}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: EASE }}
                  className="absolute -inset-3"
                >
                  <motion.img
                    src={f.image.src}
                    alt={f.image.alt}
                    width={2016}
                    height={1892}
                    loading="lazy"
                    style={fine ? { x: shiftX, y: shiftY } : undefined}
                    className="h-full w-full object-cover"
                  />
                </motion.div>
              </AnimatePresence>
              {fine && <motion.div aria-hidden="true" style={{ backgroundImage: light }} className="pointer-events-none absolute inset-0 mix-blend-soft-light" />}
              <p className="absolute bottom-0 left-0 bg-charcoal px-4 py-3 text-[14px] text-white/85">{f.body}</p>
            </div>
          </div>

          <div role="tablist" aria-orientation="vertical" aria-label="Finishes" onKeyDown={onKey} className="border-t border-white/15 lg:col-span-4">
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
                  aria-label={x.title}
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  className="group flex w-full items-baseline gap-5 border-b border-white/15 py-4 text-left md:py-5"
                >
                  <span className={`num w-6 text-[12px] transition-colors ${on ? "text-red" : "text-white/35"}`}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={`display uppercase text-[clamp(26px,2.6vw,40px)] transition-[color,transform] duration-500 ${on ? "translate-x-2 text-white" : "text-white/35 group-hover:text-white/70"}`}>
                    {x.short}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
