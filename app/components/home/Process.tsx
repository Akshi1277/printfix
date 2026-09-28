"use client";

import { useState } from "react";
import { process } from "../../content";
import { Label, Reveal } from "../ui";

/**
 * Motion moment 5 — process.
 * A normal-height section. Hover / focus a step: its number grows, a red rule fills along
 * the top, and the description brightens. On mobile every step is simply shown.
 */
export default function Process({ compact = false }: { compact?: boolean }) {
  const [active, setActive] = useState(0);

  return (
    <section className={compact ? "py-20" : "section"} aria-labelledby="process-title">
      <div className="wrap">
        <Reveal className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Label>How we work</Label>
            <h2 id="process-title" className="display mt-6 max-w-[15ch] text-[clamp(34px,4.4vw,68px)] text-ink">Simple, transparent, efficient.</h2>
          </div>
          <p className="text-[16px] leading-relaxed text-muted lg:col-span-4 lg:col-start-9 lg:self-end">
            A step-by-step process that keeps accuracy, quality and customer satisfaction in every project.
          </p>
        </Reveal>

        <ol className="mt-14 grid gap-0 sm:grid-cols-2 lg:mt-20 lg:grid-cols-5" onMouseLeave={() => setActive(0)}>
          {process.map((s, i) => {
            const on = i === active;
            return (
              <li
                key={s.n}
                tabIndex={0}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className="relative border-t border-line py-7 outline-none sm:pr-6 lg:min-h-[280px] lg:border-l lg:border-t-0 lg:px-6 lg:py-8 lg:first:border-l-0 lg:first:pl-0"
              >
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-0 hidden h-[2px] bg-red transition-[width] duration-500 ease-out lg:block ${on ? "w-full" : "w-0"} lg:first:left-0`}
                />
                <span
                  className={`num block origin-left text-[40px] font-bold leading-none transition-[transform,color] duration-500 ease-out lg:text-[48px] ${
                    on ? "scale-[1.15] text-red" : "text-ink/20"
                  }`}
                >
                  {s.n}
                </span>
                <h3 className="mt-8 text-[20px] font-semibold text-ink [font-stretch:108%]">{s.title}</h3>
                <p className={`mt-3 text-[15px] leading-relaxed transition-colors duration-500 ${on ? "text-ink-2" : "text-muted lg:text-muted/70"}`}>{s.body}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
