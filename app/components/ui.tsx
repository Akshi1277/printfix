"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";

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

/** Small uppercase label with the red "cube" square borrowed from the logo mark. */
export function Label({ children, className = "", light = false }: { children: React.ReactNode; className?: string; light?: boolean }) {
  return (
    <p className={`label flex items-center gap-2.5 ${light ? "text-white/70" : "text-muted"} ${className}`}>
      <span aria-hidden="true" className="inline-block h-[7px] w-[7px] bg-red" />
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

/** WhatsApp glyph (lucide has none). */
export function WhatsAppIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.57.93.95-3.48-.22-.36a9.42 9.42 0 0 1-1.44-5.02c0-5.2 4.23-9.43 9.44-9.43a9.37 9.37 0 0 1 6.67 2.77 9.37 9.37 0 0 1 2.76 6.67c0 5.2-4.24 9.43-9.44 9.43zm8.03-17.47A11.28 11.28 0 0 0 12.05.7C5.8.7.7 5.8.7 12.05c0 2 .52 3.95 1.52 5.67L.6 23.3l5.72-1.5a11.33 11.33 0 0 0 5.72 1.46h.01c6.25 0 11.34-5.09 11.35-11.34a11.27 11.27 0 0 0-3.32-8.03z" />
    </svg>
  );
}
