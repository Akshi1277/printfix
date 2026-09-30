"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";

export const EASE = [0.22, 1, 0.36, 1] as const;

/** The one "basic" motion used across the site: fade + a short rise, once. */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section";
}) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </M>
  );
}

/** Small uppercase eyebrow. Used sparingly: the hero, the process and inner-page heads. */
export function Label({ children, className = "", light = false }: { children: React.ReactNode; className?: string; light?: boolean }) {
  return (
    <p className={`label ${light ? "text-white/70" : "text-muted"} ${className}`}>
      {children}
    </p>
  );
}

type BtnProps = {
  href: string;
  children: React.ReactNode;
  variant?: "red" | "ink" | "outline" | "outline-light" | "white";
  external?: boolean;
  className?: string;
  arrow?: boolean;
};

const variants = {
  red: "bg-red text-white hover:bg-red-deep",
  ink: "bg-ink text-white hover:bg-charcoal",
  white: "bg-white text-ink hover:bg-stone",
  outline: "border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-white",
  "outline-light": "border border-white/40 text-white hover:border-white hover:bg-white hover:text-ink",
};

export function Button({ href, children, variant = "red", external, className = "", arrow = true }: BtnProps) {
  const cls = `group inline-flex min-h-12 items-center justify-center gap-3 px-6 text-[13px] font-semibold uppercase tracking-[0.12em] transition-colors duration-300 ${variants[variant]} ${className}`;
  const inner = (
    <>
      {children}
      {arrow &&
        (external ? (
          <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        ) : (
          <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        ))}
    </>
  );
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

/** Text link with a moving arrow. */
export function MoreLink({ href, children, light = false }: { href: string; children: React.ReactNode; light?: boolean }) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 border-b pb-1 text-[13px] font-semibold uppercase tracking-[0.12em] transition-colors ${
        light ? "border-white/40 text-white hover:border-white" : "border-ink/30 text-ink hover:border-red hover:text-red"
      }`}
    >
      {children}
      <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
}

/** WhatsApp glyph, from the same Phosphor set as every other icon. */
export function WhatsAppIcon({ className = "h-4 w-4" }: { className?: string }) {
  return <WhatsappLogo aria-hidden="true" weight="fill" className={className} />;
}

/**
 * Warms the cache for images a switcher will show later (industries, finishes, process, products),
 * so swapping never flashes an empty frame. 1px, invisible, lazy: they load as the section nears
 * the viewport, not with the first paint.
 */
export function Preload({ srcs }: { srcs: string[] }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0">
      {srcs.map((s) => (
        <img key={s} src={s} alt="" width={1} height={1} loading="lazy" />
      ))}
    </div>
  );
}
