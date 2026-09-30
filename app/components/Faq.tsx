"use client";

import { useState } from "react";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { faqs } from "../content";
import { Label, Reveal } from "./ui";

/** FAQ — large numbers, large questions, a 300ms accordion. Answers come from Printfix's own terms and policies. */
export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="section" aria-labelledby="faq-title">
      <div className="wrap">
        <Reveal className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Label>FAQ</Label>
            <h2 id="faq-title" className="display mt-6 text-[clamp(34px,4.6vw,72px)] text-ink">Before you order.</h2>
          </div>
        </Reveal>
        <ul className="mt-12 border-t border-ink lg:mt-16">
          {faqs.map((f, i) => {
            const on = open === i;
            return (
              <li key={f.q} className="border-b border-line">
                <h3>
                  <button
                    type="button"
                    id={`faq-q-${i}`}
                    aria-expanded={on}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => setOpen(on ? null : i)}
                    className="group grid w-full grid-cols-[3rem_1fr_auto] items-baseline gap-4 py-6 text-left md:grid-cols-[6rem_1fr_auto] md:py-8"
                  >
                    <span className={`num text-[clamp(20px,2vw,32px)] font-bold transition-colors ${on ? "text-red" : "text-ink/25"}`}>{String(i + 1).padStart(2, "0")}</span>
                    <span className={`text-[clamp(20px,2.2vw,34px)] font-semibold leading-tight tracking-[-0.01em] [font-stretch:108%] transition-colors ${on ? "text-ink" : "text-ink/75 group-hover:text-ink"}`}>
                      {f.q}
                    </span>
                    <Plus aria-hidden="true" className={`h-6 w-6 shrink-0 self-center transition-transform duration-300 ${on ? "rotate-45 text-red" : "text-ink/40"}`} />
                  </button>
                </h3>
                <div id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`} className={`grid transition-[grid-template-rows] duration-300 ease-out ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <div className="overflow-hidden" inert={!on}>
                    <p className="max-w-[680px] pb-8 pl-[4rem] text-[17px] leading-relaxed text-ink-2 md:pl-[7rem]">{f.a}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
