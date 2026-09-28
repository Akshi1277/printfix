"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { company, quoteHref, whatsappLink } from "../content";
import { Button, EASE, WhatsAppIcon } from "./ui";

/**
 * Motion moment 6 — final CTA: the photograph slowly settles as you arrive; the type rises once.
 * The photo sits beside the text at no more than ~640px wide — the source images are ~1000px,
 * so stretching them full-bleed made them visibly soft.
 */
export default function FinalCta({
  title = ["Have a project", "in mind?"],
  image = { src: "/work/olivia-leigh-1.webp", alt: "Two burgundy Olivia Leigh rigid boxes with gold foil logos" },
}: {
  title?: string[];
  image?: { src: string; alt: string };
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.06, 1]);

  return (
    <section ref={ref} className="bg-charcoal text-white" aria-labelledby="cta-title">
      <div className="wrap grid items-center gap-12 py-24 md:py-32 lg:grid-cols-12 lg:gap-8">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="lg:col-span-7"
        >
          <h2 id="cta-title" className="display text-[clamp(44px,6vw,96px)]">
            {title.map((l) => (
              <span key={l} className="block">{l}</span>
            ))}
          </h2>
          <p className="mt-7 max-w-[480px] text-[17px] leading-relaxed text-white/75">
            Tell us the product, size, quantity and deadline. We&rsquo;ll come back with the right structure, stock and finish — and a quote.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button href={quoteHref}>Get a quote</Button>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center gap-3 border border-white/40 px-6 text-[13px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:border-white hover:bg-white hover:text-ink"
            >
              <WhatsAppIcon /> Chat on WhatsApp
            </a>
          </div>
          <p className="mt-10 text-[14px] text-white/55">
            <a href={company.phoneHref} className="hover:text-white">{company.phone}</a>
            <span className="mx-3">·</span>
            <a href={`mailto:${company.email}`} className="hover:text-white">{company.email}</a>
            <span className="mx-3">·</span>
            {company.hoursShort}
          </p>
        </motion.div>

        <div className="overflow-hidden bg-white/5 lg:col-span-5">
          <motion.img
            src={image.src}
            alt={image.alt}
            width={1008}
            height={946}
            loading="lazy"
            style={{ scale }}
            className="aspect-[1008/946] w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
