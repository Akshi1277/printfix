"use client";

import { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { finishes } from "../../content";
import { EASE, Reveal } from "../ui";
import { useFinePointer } from "../useChoreo";

/**
 * Materials & finishes as a swatch wall: six tall macro tiles side by side, like a finishing sample
 * book. Hover or focus one and it opens wide to show what the finish is; on a mouse, a raking light
 * follows the pointer across the open swatch so foil and emboss catch it as they do in the hand.
 * Phone: a swipeable row of swatches, each with its description. The one dark band mid-page.
 */
export default function Finishes() {
  const [open, setOpen] = useState(0);
  const fine = useFinePointer();

  // pointer → raking light, in the open tile's own coordinates (0…1)
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.35);
  const sx = useSpring(mx, { stiffness: 120, damping: 20 });
  const sy = useSpring(my, { stiffness: 120, damping: 20 });
  const light = useTransform([sx, sy], ([x, y]) =>
    `radial-gradient(circle at ${(x as number) * 100}% ${(y as number) * 100}%, rgba(255,244,222,0.55) 0%, rgba(255,244,222,0.12) 22%, rgba(0,0,0,0) 45%)`,
  );
  const move = (e: React.PointerEvent<HTMLElement>) => {
    if (!fine) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };

  return (
    <section className="section bg-charcoal pb-[clamp(56px,6vw,88px)] text-white" aria-labelledby="finish-title">
      <div className="wrap">
        <Reveal>
          <h2 id="finish-title" className="display text-[clamp(38px,5.4vw,88px)]">The detail is in the finish.</h2>
          <p className="mt-6 max-w-[440px] text-[17px] leading-relaxed text-white/65">
            The finishes Printfix offers across boxes, cartons, bags and books. {fine ? "Open a swatch and move across it to catch the light." : "Swipe through the swatches."}
          </p>
        </Reveal>

        {/* desktop: the swatch wall */}
        <div className="mt-14 hidden h-[min(64vh,600px)] min-h-[440px] gap-2 lg:flex" onMouseLeave={() => { mx.set(0.5); my.set(0.35); }}>
          {finishes.map((f, i) => {
            const on = i === open;
            return (
              <motion.button
                key={f.key}
                type="button"
                layout
                onMouseEnter={() => setOpen(i)}
                onFocus={() => setOpen(i)}
                onClick={() => setOpen(i)}
                onPointerMove={on ? move : undefined}
                aria-expanded={on}
                aria-label={f.title}
                animate={{ flexGrow: on ? 4.2 : 1 }}
                transition={{ duration: 0.7, ease: EASE }}
                className="group relative min-w-0 basis-0 overflow-hidden bg-white/5 text-left outline-offset-4"
              >
                <img
                  src={f.image.src}
                  alt={f.image.alt}
                  width={2016}
                  height={1892}
                  loading="lazy"
                  className={`absolute inset-0 h-full w-full object-cover transition-[transform,filter] duration-700 ${on ? "scale-100" : "scale-110 brightness-[0.55] saturate-[0.7] group-hover:brightness-75"}`}
                />
                {on && fine && <motion.div aria-hidden="true" style={{ backgroundImage: light }} className="pointer-events-none absolute inset-0 mix-blend-soft-light" />}
                <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/75 to-transparent" />
                {/* closed: the name runs up the swatch's spine */}
                <span
                  className={`absolute bottom-6 left-1/2 origin-center -translate-x-1/2 whitespace-nowrap text-[13px] font-semibold uppercase tracking-[0.14em] text-white/85 transition-opacity duration-300 [writing-mode:vertical-rl] rotate-180 ${on ? "opacity-0" : "opacity-100"}`}
                >
                  {f.short}
                </span>
                {/* open: title and what it is */}
                <motion.div
                  initial={false}
                  animate={{ opacity: on ? 1 : 0, y: on ? 0 : 12 }}
                  transition={{ duration: 0.45, ease: EASE, delay: on ? 0.2 : 0 }}
                  className="absolute inset-x-0 bottom-0 p-7"
                >
                  <p className="display text-[clamp(28px,2.4vw,40px)] text-white">{f.title}</p>
                  <p className="mt-2 max-w-[420px] text-[15px] leading-relaxed text-white/80">{f.body}</p>
                </motion.div>
              </motion.button>
            );
          })}
        </div>

        {/* phone / tablet: a swipeable row of swatches */}
        <ul className="-mx-4 mt-10 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 lg:hidden [scrollbar-width:none]">
          {finishes.map((f) => (
            <li key={f.key} className="relative w-[78vw] max-w-[360px] shrink-0 snap-start overflow-hidden bg-white/5">
              <img src={f.image.src.replace(".webp", "-sm.webp")} alt={f.image.alt} width={640} height={600} loading="lazy" className="aspect-[4/5] w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-5 pt-16">
                <p className="display text-[26px] text-white">{f.title}</p>
                <p className="mt-1.5 text-[14px] leading-relaxed text-white/80">{f.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
