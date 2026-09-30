"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { offset, services } from "../../content";
import { forService, offsetProjects } from "../../portfolio";
import { EASE, Preload, Reveal } from "../ui";

// The five product categories plus offset printing — Printfix's actual structure.
const items = [
  ...services.map((s) => ({ key: s.slug, href: `/${s.slug}/`, n: s.n, title: s.title, body: s.body, image: s.image, count: forService(s.slug).length })),
  { key: "offset", href: "/offset-printing/", n: "06", title: "Offset Printing", body: offset.lede, image: { src: "/work/lavender-soap-1.webp", alt: offset.detail.alt }, count: offsetProjects().length },
];

/**
 * Moment 3 — what we make.
 * Hover / focus / tap a line: the title steps in, the arrow moves, the description opens,
 * and the large panel crossfades to that category's real work (slight scale + rise).
 */
export default function ServiceIndex() {
  const [active, setActive] = useState(0);
  const s = items[active];

  return (
    <section id="products" className="section" aria-labelledby="products-title">
      <Preload srcs={items.map((x) => x.image.src)} />
      <div className="wrap">
        <Reveal>
          <h2 id="products-title" className="display max-w-[14ch] text-[clamp(34px,4.6vw,72px)] text-ink">Five products. One print process.</h2>
          <p className="mt-6 max-w-[420px] text-[17px] leading-relaxed text-ink-2">Each made to your size, stock, finish and quantity, and offset printed where colour matters.</p>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-12">
          <ol className="border-t border-line lg:col-span-6">
            {items.map((it, i) => {
              const on = i === active;
              return (
                <li key={it.key} className={`border-b border-line transition-colors duration-500 ${on ? "bg-white" : ""}`}>
                  <Link
                    href={it.href}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={(e) => {
                      if (!on && window.matchMedia("(hover: none)").matches) {
                        e.preventDefault();
                        setActive(i);
                      }
                    }}
                    className="group block px-1 py-5 md:px-5 md:py-6"
                  >
                    <div className="flex items-baseline gap-5 md:gap-8">
                      <span className={`num w-6 shrink-0 text-[13px] transition-colors ${on ? "text-red" : "text-muted"}`}>{it.n}</span>
                      <h3 className={`display flex-1 uppercase text-[clamp(24px,2.7vw,42px)] transition-[transform,color] duration-500 ease-out ${on ? "translate-x-3 text-ink" : "text-ink/45"}`}>
                        {it.title}
                      </h3>
                      <ArrowRight aria-hidden="true" className={`h-6 w-6 shrink-0 self-center transition-[transform,color] duration-500 ${on ? "translate-x-0 text-red" : "-translate-x-3 text-ink/25"}`} />
                    </div>
                    <div className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                      <div className="overflow-hidden">
                        <p className="max-w-[460px] pl-11 pt-4 text-[15px] leading-relaxed text-ink-2 md:pl-14 md:text-[16px]">{it.body}</p>
                        <img src={it.image.src.replace(".webp", "-sm.webp")} alt={it.image.alt} width={640} height={600} loading="lazy" className="mt-5 aspect-[4/3] w-full object-cover lg:hidden" />
                        <p className="label mt-5 pl-11 text-red md:pl-14">{it.count} projects →</p>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>

          <div className="relative hidden lg:col-span-6 lg:block">
            <div className="sticky top-28 aspect-[1008/946] overflow-hidden bg-stone">
              <AnimatePresence initial={false}>
                <motion.img
                  key={s.key}
                  src={s.image.src}
                  alt={s.image.alt}
                  width={2016}
                  height={1892}
                  loading="lazy"
                  initial={{ opacity: 0, scale: 1.05, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.99 }}
                  transition={{ duration: 0.65, ease: EASE }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute bottom-0 left-0 flex items-center gap-3 bg-paper px-4 py-3">
                <span className="num text-[12px] text-red">{s.n}</span>
                <span className="label text-ink">{s.title}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
