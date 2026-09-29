"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { company, quoteHref, whatsappLink } from "../content";
import { Button, EASE, WhatsAppIcon } from "./ui";
import { useChoreo } from "./useChoreo";

/**
 * Moment 10 — the close. A large real product fills the section; as you arrive it settles
 * from 1.1 → 1 and a soft band of light passes once across it; the words rise and the CTAs appear.
 * The photograph is upscaled to 2016px, so it holds at full width.
 */
export default function FinalCta({
  title = ["Have a project", "in mind?"],
  image = { src: "/work/olivia-leigh-1.webp", alt: "Two burgundy Olivia Leigh rigid boxes with gold foil logos" },
}: {
  title?: string[];
  image?: { src: string; alt: string };
}) {
  const ref = useRef<HTMLElement>(null);
  const choreo = useChoreo();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);
  const sweep = useTransform(scrollYProgress, [0.3, 1], ["-60%", "120%"]);

  return (
    <section ref={ref} className="relative isolate overflow-hidden bg-charcoal text-white" aria-labelledby="cta-title">
      <motion.img
        src={image.src}
        alt=""
        width={2016}
        height={1892}
        loading="lazy"
        style={choreo ? { scale } : undefined}
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      {choreo && (
        <motion.div
          aria-hidden="true"
          style={{ x: sweep }}
          className="absolute inset-y-0 -z-10 w-[45%] bg-gradient-to-r from-transparent via-white/15 to-transparent mix-blend-soft-light"
        />
      )}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-charcoal via-charcoal/85 to-charcoal/10" />
      <div className="wrap py-28 md:py-44">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="max-w-[760px]"
        >
          <h2 id="cta-title" className="display text-[clamp(48px,7vw,120px)]">
            {title.map((l) => (
              <span key={l} className="block">{l}</span>
            ))}
          </h2>
          <p className="mt-7 max-w-[460px] text-[18px] leading-relaxed text-white/80">Tell us the product, size, quantity and deadline.</p>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.25 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <Button href={quoteHref}>Get a quote</Button>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center gap-3 border border-white/45 px-6 text-[13px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:border-white hover:bg-white hover:text-ink"
            >
              <WhatsAppIcon /> Chat on WhatsApp
            </a>
          </motion.div>
          <p className="mt-10 text-[14px] text-white/60">
            <a href={company.phoneHref} className="hover:text-white">{company.phone}</a>
            <span className="mx-3">·</span>
            <a href={`mailto:${company.email}`} className="hover:text-white">{company.email}</a>
            <span className="mx-3">·</span>
            {company.hoursShort}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
