"use client";

import { useEffect, useState } from "react";
import { services, type ServiceSlug } from "../content";
import { isOffset, projects } from "../portfolio";
import ProjectCard from "../components/ProjectCard";

type Filter = "all" | "offset" | ServiceSlug;

/** All work, filterable by category. The filter is mirrored in the URL hash (#rigid-box …) so it can be linked. */
export default function WorkIndex() {
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    const h = window.location.hash.slice(1) as Filter;
    if (h === "offset" || services.some((s) => s.slug === h)) setFilter(h);
  }, []);

  const choose = (f: Filter) => {
    setFilter(f);
    history.replaceState(null, "", f === "all" ? window.location.pathname : `#${f}`);
  };

  const list = filter === "all" ? projects : filter === "offset" ? projects.filter(isOffset) : projects.filter((p) => p.service === filter);
  const tabs: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "All work", count: projects.length },
    ...services.map((s) => ({ key: s.slug as Filter, label: s.title, count: projects.filter((p) => p.service === s.slug).length })),
    { key: "offset", label: "Offset printed", count: projects.filter(isOffset).length },
  ];

  return (
    <section className="wrap pb-28">
      <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
        <div role="group" aria-label="Filter work by category" className="flex min-w-max gap-2 border-b border-line pb-4">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              aria-pressed={filter === t.key}
              onClick={() => choose(t.key)}
              className={`flex min-h-11 items-center gap-2 px-4 text-[14px] font-medium transition-colors ${
                filter === t.key ? "bg-ink text-white" : "bg-white text-ink hover:bg-stone"
              }`}
            >
              {t.label}
              <span className={`num text-[11px] ${filter === t.key ? "text-white/60" : "text-muted"}`}>{t.count}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">{list.length} projects shown</p>

      <ul className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p, i) => (
          // every 7th card spans two columns to break the grid rhythm
          <li key={p.slug} className={i % 7 === 0 ? "sm:col-span-2 lg:col-span-2" : ""}>
            <ProjectCard p={p} sizes={i % 7 === 0 ? "lg" : "sm"} aspect={i % 7 === 0 ? "aspect-[16/10]" : "aspect-[1008/946]"} priority={i < 3} />
          </li>
        ))}
      </ul>
    </section>
  );
}
