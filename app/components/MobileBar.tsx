"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { quoteHref, whatsappLink } from "../content";
import { WhatsAppIcon } from "./ui";
import Link from "next/link";

/** Mobile-only sticky bar: quote + WhatsApp. Appears after the hero, hides near the footer. */
export default function MobileBar() {
  const [show, setShow] = useState(false);
  const pathname = usePathname();

  const on = () => {
    const footer = document.querySelector("footer");
    const nearFooter = footer ? footer.getBoundingClientRect().top < window.innerHeight : false;
    setShow(window.scrollY > window.innerHeight * 0.7 && !nearFooter);
  };
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", on);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(on, [pathname]);

  if (pathname.startsWith("/contact")) return null;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-line bg-paper p-3 transition-transform duration-300 lg:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!show}
    >
      <Link
        href={quoteHref}
        tabIndex={show ? 0 : -1}
        className="flex min-h-12 items-center justify-center bg-red text-[13px] font-semibold uppercase tracking-[0.12em] text-white"
      >
        Get a quote
      </Link>
      <a
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={show ? 0 : -1}
        className="flex min-h-12 items-center justify-center gap-2 border border-ink/25 bg-white text-[13px] font-semibold uppercase tracking-[0.1em] text-ink"
      >
        <WhatsAppIcon /> WhatsApp
      </a>
    </div>
  );
}
