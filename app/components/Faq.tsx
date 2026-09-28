"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { faqs } from "../content";
import { Label, Reveal } from "./ui";

/** Simple accordion, ~300ms. Answers come from Printfix's own terms and refund policy. */
export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="section" aria-labelledby="faq-title">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-4">
          <Label>FAQ</Label>
          <h2 id="faq-title" className="display mt-6 text-[clamp(34px,4.4vw,68px)] text-ink">Before you order.</h2>
        </Reveal>
        <ul className="border-t border-line lg:col-span-7 lg:col-start-6">
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
                    className="flex w-full items-center justify-between gap-6 py-6 text-left text-[18px] font-semibold text-ink [font-stretch:106%] md:text-[20px]"
                  >
                    {f.q}
                    <Plus aria-hidden="true" className={`h-5 w-5 shrink-0 transition-transform duration-300 ${on ? "rotate-45 text-red" : "text-ink/50"}`} />
                  </button>
                </h3>
                <div
                  id={`faq-a-${i}`}
                  role="region"
                  aria-labelledby={`faq-q-${i}`}
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="overflow-hidden" inert={!on}>
                    <p className="max-w-[620px] pb-7 text-[16px] leading-relaxed text-ink-2">{f.a}</p>
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
