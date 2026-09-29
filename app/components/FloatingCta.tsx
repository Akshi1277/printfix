"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { quoteHref } from "../content";
import { useFinePointer } from "./useChoreo";

/**
 * Desktop floating "Get a quote" — appears after the first screen, hides over the footer and on
 * the contact page. On hover it leans a few pixels toward the pointer (magnetic) and scales 1.03.
 * Mobile uses the sticky bottom bar (MobileBar) instead.
 */
export default function FloatingCta() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const fine = useFinePointer();
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 });
  const y = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 });

  useEffect(() => {
    const on = () => {
      const f = document.querySelector("footer");
      const nearFooter = f ? f.getBoundingClientRect().top < window.innerHeight - 40 : false;
      setShow(window.scrollY > window.innerHeight * 0.9 && !nearFooter);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [pathname]);

  if (pathname.startsWith("/contact")) return null;

  const move = (e: React.PointerEvent) => {
    if (!fine || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set(((e.clientX - (r.left + r.width / 2)) / r.width) * 10);
    y.set(((e.clientY - (r.top + r.height / 2)) / r.height) * 8);
  };
  const reset = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      initial={false}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 16 }}
      transition={{ duration: 0.35 }}
      className={`fixed bottom-6 right-6 z-40 hidden lg:block ${show ? "" : "pointer-events-none"}`}
    >
      <motion.div style={{ x, y }} whileHover={fine ? { scale: 1.03 } : undefined}>
        <Link
          ref={ref}
          href={quoteHref}
          tabIndex={show ? 0 : -1}
          aria-hidden={!show}
          onPointerMove={move}
          onPointerLeave={reset}
          className="group flex min-h-14 items-center gap-3 bg-red px-7 text-[13px] font-semibold uppercase tracking-[0.12em] text-white shadow-[0_18px_40px_-14px_rgba(155,25,35,0.55)] transition-colors hover:bg-red-deep"
        >
          Get a quote
          <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </motion.div>
    </motion.div>
  );
}
