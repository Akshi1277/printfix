"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import { company, nav, quoteHref, services, whatsappLink } from "../content";
import { Button, EASE, WhatsAppIcon } from "./ui";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [svcOpen, setSvcOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  // close menus on navigation
  useEffect(() => {
    setOpen(false);
    setSvcOpen(false);
  }, [pathname]);

  // lock page scroll + Escape to close the mobile menu
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && (setOpen(false), setSvcOpen(false));
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  const active = (href: string) => !href.includes("#") && pathname.startsWith(href.replace(/\/$/, "")) && href !== "/";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,height] duration-300 ${
        scrolled || open ? "border-b border-line bg-paper" : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className={`wrap flex items-center justify-between gap-6 transition-[height] duration-300 ${scrolled ? "h-16" : "h-20 md:h-24"}`}>
        <Link href="/" aria-label={`${company.name} — home`} className="relative z-10 shrink-0">
          <img
            src={company.logo.color}
            alt={company.name}
            width={Math.round(36 * company.logo.ratio)}
            height={36}
            className={`w-auto transition-[height] duration-300 ${scrolled ? "h-7" : "h-8 md:h-9"}`}
          />
        </Link>

        {/* desktop */}
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          <div className="relative" onMouseEnter={() => setSvcOpen(true)} onMouseLeave={() => setSvcOpen(false)}>
            <button
              type="button"
              aria-expanded={svcOpen}
              aria-controls="svc-menu"
              onClick={() => setSvcOpen((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-2 text-[14px] font-medium text-ink transition-colors hover:text-red"
            >
              Products
              <ChevronDown aria-hidden="true" className={`h-3.5 w-3.5 transition-transform duration-300 ${svcOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {svcOpen && (
                <motion.ul
                  id="svc-menu"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.2, ease: EASE }}
                  className="absolute left-0 top-full w-72 border border-line bg-white py-2 shadow-[0_24px_48px_-24px_rgba(0,0,0,0.25)]"
                >
                  {services.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/${s.slug}/`}
                        className="flex items-baseline gap-4 px-5 py-3 text-[15px] text-ink transition-colors hover:bg-paper hover:text-red"
                      >
                        <span className="num text-[11px] text-muted">{s.n}</span>
                        {s.title}
                      </Link>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
          {nav.slice(1).map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={active(n.href) ? "page" : undefined}
              className={`px-3 py-2 text-[14px] font-medium transition-colors hover:text-red ${active(n.href) ? "text-red" : "text-ink"}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with Printfix on WhatsApp"
            className="flex h-11 w-11 items-center justify-center border border-ink/20 text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
          >
            <WhatsAppIcon className="h-[18px] w-[18px]" />
          </a>
          <Button href={quoteHref} className="min-h-11">Get a quote</Button>
        </div>

        {/* mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="relative z-10 -mr-2 flex h-11 w-11 items-center justify-center text-ink lg:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 top-0 flex flex-col overflow-y-auto bg-paper pt-20 lg:hidden"
          >
            <nav aria-label="Mobile" className="wrap flex flex-1 flex-col">
              <p className="label mb-3 mt-6 text-muted">Products</p>
              <ul className="border-t border-line">
                {services.map((s) => (
                  <li key={s.slug} className="border-b border-line">
                    <Link href={`/${s.slug}/`} className="flex items-baseline gap-4 py-3.5 text-[19px] font-medium text-ink">
                      <span className="num text-[12px] text-muted">{s.n}</span>
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="mt-8 space-y-1">
                {nav.slice(1).map((n) => (
                  <li key={n.href}>
                    <Link href={n.href} className="display block py-1.5 text-[34px] text-ink">
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-auto grid gap-3 pb-10 pt-10">
                <Button href={quoteHref}>Get a quote</Button>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center justify-center gap-3 border border-ink/25 text-[13px] font-semibold uppercase tracking-[0.12em] text-ink"
                >
                  <WhatsAppIcon /> Chat on WhatsApp
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
