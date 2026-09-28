"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { services } from "../../content";
import { forService } from "../../portfolio";
import { EASE, Label, Reveal } from "../ui";

/**
 * Motion moment 2 — the service index.
 * Hover (or focus / tap) a service: the title shifts, the description opens, the arrow moves,
 * and the large panel crossfades to that service's photograph.
 */
export default function ServiceIndex() {
  const [active, setActive] = useState(0);
  const s = services[active];

  return (
    <section id="services" className="section bg-white">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <Label>What we make</Label>
            <h2 className="display mt-6 max-w-[16ch] text-[clamp(34px,4.4vw,68px)] text-ink">Printing & packaging, made to order.</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-[360px] text-[16px] leading-relaxed text-muted">
              Five core categories, each produced to your size, stock, finish and quantity.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-12">
          {/* visual panel (desktop) */}
          <div className="relative hidden lg:col-span-6 lg:block">
            <div className="sticky top-28 aspect-[1008/946] overflow-hidden bg-stone">
              <AnimatePresence initial={false}>
                <motion.img
                  key={s.slug}
                  src={s.image.src}
                  alt={s.image.alt}
                  width={1008}
                  height={946}
                  loading="lazy"
                  initial={{ opacity: 0, scale: 1.035, x: 12 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute bottom-0 left-0 flex items-center gap-3 bg-white px-4 py-3">
                <span className="num text-[12px] text-red">{s.n}</span>
                <span className="label text-ink">{forService(s.slug).length} projects in our work</span>
              </div>
            </div>
          </div>

          <ol className="border-t border-line lg:col-span-6">
            {services.map((svc, i) => {
              const on = i === active;
              return (
                <li key={svc.slug} className={`border-b border-line transition-colors duration-500 ${on ? "bg-paper" : ""}`}>
                  <Link
                    href={`/${svc.slug}/`}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={(e) => {
                      // on touch screens the first tap previews, the second follows the link
                      if (!on && window.matchMedia("(hover: none)").matches) {
                        e.preventDefault();
                        setActive(i);
                      }
                    }}
                    className="group block px-1 py-6 md:px-5 md:py-7"
                  >
                    <div className="flex items-baseline gap-5 md:gap-8">
                      <span className={`num w-6 shrink-0 text-[13px] transition-colors ${on ? "text-red" : "text-muted"}`}>{svc.n}</span>
                      <h3
                        className={`display flex-1 text-[clamp(26px,3vw,44px)] transition-[transform,color] duration-500 ease-out ${
                          on ? "translate-x-2 text-ink md:translate-x-3" : "text-ink/55"
                        }`}
                      >
                        {svc.title}
                      </h3>
                      <ArrowRight
                        aria-hidden="true"
                        className={`h-6 w-6 shrink-0 self-center transition-[transform,color] duration-500 ${on ? "translate-x-0 text-red" : "-translate-x-2 text-ink/30"}`}
                      />
                    </div>
                    <div className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                      <div className="overflow-hidden">
                        <p className="max-w-[460px] pl-11 pt-4 text-[15px] leading-relaxed text-ink-2 md:pl-14 md:text-[16px]">{svc.body}</p>
                        {/* mobile: the image lives inside the open row */}
                        <img
                          src={svc.image.src.replace(".webp", "-sm.webp")}
                          alt={svc.image.alt}
                          width={640}
                          height={600}
                          loading="lazy"
                          className="mt-5 aspect-[4/3] w-full object-cover lg:hidden"
                        />
                        <p className="label mt-5 pl-11 text-red md:pl-14">View {svc.title.toLowerCase()} work</p>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
