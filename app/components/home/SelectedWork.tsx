"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { bySlug, img, projects, type Project } from "../../portfolio";
import { Button, Reveal } from "../ui";
import { useChoreo } from "../useChoreo";

/**
 * Moment 4 — selected work.
 * An art-directed sequence (huge / two small / large + detail / large) rather than a grid.
 * As each large piece travels up the screen its photograph opens from 0.9 → 1, the title
 * drifts into place and the metadata surfaces; the next piece starts entering before the
 * previous one has left, so the portfolio reads as one continuous reel.
 */
export default function SelectedWork() {
  const [abaya, nuda, nzuri, amma, birra, luv] = ["af-abaya", "nuda", "nzuri", "deeniyat-amma", "birra-attar", "luv-cbd"].map(bySlug);

  return (
    <section id="work" className="section" aria-labelledby="work-title">
      <div className="wrap">
        {/* opener: the size of the body of work, not another label + headline */}
        <Reveal className="grid items-end gap-6 border-b border-ink pb-8 md:grid-cols-12">
          <p aria-hidden="true" className="display text-[clamp(96px,16vw,260px)] leading-[0.78] text-ink md:col-span-5">{projects.length}</p>
          <div className="md:col-span-7 md:pb-3">
            <h2 id="work-title" className="display text-[clamp(30px,3.4vw,54px)] text-ink">Selected work — real pieces, made for real brands.</h2>
            <div className="mt-6">
              <Button href="/work/" variant="outline">See all {projects.length} projects</Button>
            </div>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-x-6 gap-y-16 md:grid-cols-12 lg:mt-24 lg:gap-y-24">
          <Piece p={abaya} n={1} className="md:col-span-12" aspect="aspect-[16/9]" big />
          <Piece p={nuda} n={1} className="md:col-span-5" aspect="aspect-[4/5]" />
          <Piece p={nzuri} n={1} className="md:col-span-6 md:col-start-7 md:mt-40" aspect="aspect-[1008/946]" />
          <figure className="self-end md:col-span-3">
            <img src="/work/pastel-gift-3-sm.webp" alt="Macro of gold foil stamping on a pastel mint gift box" width={640} height={600} loading="lazy" className="aspect-[3/4] w-full bg-stone object-cover" />
            <figcaption className="label mt-3 text-muted">Detail · gold foil on mint</figcaption>
          </figure>
          <Piece p={amma} n={1} className="md:col-span-8 md:col-start-5" aspect="aspect-[16/10]" big />
          <Piece p={birra} n={1} className="md:col-span-7" aspect="aspect-[1008/946]" big />
          <Piece p={luv} n={1} className="md:col-span-4 md:col-start-9 md:mt-56" aspect="aspect-[4/5]" />
        </div>
      </div>
    </section>
  );
}

function Piece({ p, n, className, aspect, big = false }: { p: Project; n: number; className: string; aspect: string; big?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const choreo = useChoreo();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const scale = useTransform(scrollYProgress, [0, 1], [big ? 0.9 : 0.95, 1]);
  const titleY = useTransform(scrollYProgress, [0.3, 1], [28, 0]);
  const meta = useTransform(scrollYProgress, [0.55, 1], [0, 1]);
  const sp = p.specs.find((s) => /finish/i.test(s.label)) ?? p.specs[1];
  const spec = sp ? `${sp.label}: ${sp.value}` : "";

  return (
    <div ref={ref} className={className}>
      <Link href={`/work/${p.slug}/`} className="group block">
        <motion.div style={choreo ? { scale } : undefined} className={`relative overflow-hidden bg-stone ${aspect}`}>
          <img
            src={img(p.slug, n, !big)}
            alt={p.alt}
            width={big ? 2016 : 640}
            height={big ? 1892 : 600}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        </motion.div>
        <div className="mt-5 flex items-start justify-between gap-6">
          <motion.div style={choreo ? { y: titleY } : undefined}>
            <h3 className={`display text-ink ${big ? "text-[clamp(26px,2.6vw,40px)]" : "text-[clamp(22px,2vw,30px)]"}`}>{p.name}</h3>
            <motion.p style={choreo ? { opacity: meta } : undefined} className="mt-2 text-[14px] text-muted">
              {p.kind}{p.client ? ` · ${p.client}` : ""}
              {big && spec ? <span className="mt-1 block text-ink-2">{spec}</span> : null}
            </motion.p>
          </motion.div>
          <ArrowUpRight aria-hidden="true" className="mt-1 h-6 w-6 shrink-0 text-ink/30 transition-[transform,color] duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-red" />
        </div>
      </Link>
    </div>
  );
}
