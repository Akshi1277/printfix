"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useMotionTemplate, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { ArrowRight, HandGrabbing } from "@phosphor-icons/react/dist/ssr";
import { hero, quoteHref } from "../../content";
import { EASE } from "../ui";
import { useFinePointer } from "../useChoreo";

/*
 * HERO: "light reveals the object".
 * The headline rises into place, sharp from the first frame. Beside it, the Aethara photograph;
 * a band of warm light sweeps across it, and behind the light the photo becomes the real-time 3D box,
 * posed to sit exactly where the photo was. The same light rakes the foil as it passes. Then the cover
 * peeks once, and the box is yours to turn and open. One screen tall, no pinned scroll.
 */

export default function Hero() {
  const reduce = useReducedMotion() ?? false;
  const fine = useFinePointer();

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_70%_55%,#FBFAF7_0%,#F4F3F0_50%,#E9E6DF_100%)]" aria-labelledby="hero-title">
      <RegMarks reduce={reduce} />

      {/* phone: headline, then copy + CTAs (above the fold), then the box. Desktop: type left, box right. */}
      <div className="wrap relative grid min-h-[100dvh] content-center gap-y-8 pb-12 pt-28 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-0 lg:pb-16 lg:pt-24">
        <div className="relative z-10 order-1 lg:order-none lg:col-span-7 lg:row-start-1 lg:self-end">
          <p className="hero-fade label flex items-center gap-3 text-muted" style={{ animationDelay: "0.05s" }}>
            <RegTarget />
            {hero.label}
          </p>
          <h1 id="hero-title" className="display mt-6 text-[clamp(52px,min(7vw,12.5vh),136px)] uppercase leading-[0.86] tracking-[-0.045em] text-ink">
            {["Packaging", "people", "notice."].map((w, i) => (
              <span key={w} className="block overflow-hidden pb-[0.04em]">
                <span className={`hero-rise block ${i === 2 ? "text-red" : ""}`} style={{ animationDelay: `${0.12 + i * 0.09}s` }}>
                  {w}
                </span>
              </span>
            ))}
          </h1>
        </div>

        <div className="relative order-3 lg:order-none lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1 lg:self-center">
          <BoxStage reduce={reduce} fine={fine} />
        </div>

        <div className="relative z-10 order-2 lg:order-none lg:col-span-7 lg:row-start-2 lg:pt-8">
          <p className="hero-fade max-w-[470px] text-[16px] leading-relaxed text-ink-2 md:text-[17px]" style={{ animationDelay: "0.5s" }}>
            Rigid boxes, cartons, mailers, bags and books, <FinishWord kind="offset">offset printed</FinishWord>, <FinishWord kind="foil">foiled</FinishWord>,{" "}
            <FinishWord kind="emboss">embossed</FinishWord> and finished for your brand, at low MOQ.
          </p>
          <div className="hero-fade mt-8 flex flex-wrap gap-3" style={{ animationDelay: "0.62s" }}>
            <HeroCta href={quoteHref} primary>Get a quote</HeroCta>
            <HeroCta href="/work/">View our work</HeroCta>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ finish words */

function FinishWord({ kind, children }: { kind: "offset" | "foil" | "emboss"; children: React.ReactNode }) {
  return <span className={`finish-word finish-${kind}`}>{children}</span>;
}

/* ------------------------------------------------------------------ the box */

const BoxScene = dynamic(() => import("./BoxScene"), { ssr: false });
// must match BLEED in BoxScene: how far the canvas extends beyond the stage square
const BLEED_L = 0.6;
const BLEED_R = 0.08;

// the sweep never starts before the headline has landed, however fast the 3D loads
const SWEEP_EARLIEST = 1.1; // s after mount
const SWEEP_DURATION = 1.35;
const FEATHER = 9; // % of the stage: soft edge where photo and 3D blend, hidden under the light

/**
 * Desktop with motion: the photograph, then a light sweep that reveals the real-time 3D box behind it.
 * Phones and reduced motion: the photograph only.
 */
function BoxStage({ reduce, fine }: { reduce: boolean; fine: boolean }) {
  const [wide, setWide] = useState(false);
  const [ready, setReady] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const mountedAt = useRef(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const [used, setUsed] = useState(false);
  const sweep = useMotionValue(0);

  useEffect(() => {
    mountedAt.current = performance.now();
    const mq = window.matchMedia("(min-width: 1024px)");
    const on = () => setWide(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  const live = wide && fine && !reduce;

  useEffect(() => {
    if (!ready) return;
    const since = (performance.now() - mountedAt.current) / 1000;
    const c = animate(sweep, 1, {
      duration: SWEEP_DURATION,
      ease: [0.65, 0, 0.35, 1],
      delay: Math.max(0.15, SWEEP_EARLIEST - since),
      onComplete: () => setRevealed(true),
    });
    return () => c.stop();
  }, [ready, sweep]);

  // the seam travels left to right; the photo gives way behind it, the 3D appears
  const edge = useTransform(sweep, (v) => v * (100 + 2 * FEATHER) - FEATHER);
  const a = useTransform(edge, (e) => e - FEATHER);
  const b = useTransform(edge, (e) => e + FEATHER);
  const photoMask = useMotionTemplate`linear-gradient(90deg, transparent ${a}%, #000 ${b}%)`;
  // the canvas is wider than the stage, so express the seam in the canvas's own percentages
  const toCanvas = (e: number) => ((BLEED_L + e / 100) / (1 + BLEED_L + BLEED_R)) * 100;
  const ca = useTransform(a, toCanvas);
  const cb = useTransform(b, toCanvas);
  const sceneMask = useMotionTemplate`linear-gradient(90deg, #000 ${ca}%, transparent ${cb}%)`;
  const bandLeft = useMotionTemplate`${edge}%`;
  const bandOpacity = useTransform(sweep, [0, 0.06, 0.92, 1], [0, 1, 1, 0]);

  return (
    <div>
      <div
        ref={stageRef}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
        className="relative mx-auto aspect-square w-full max-w-[420px] select-none lg:max-w-[620px]"
      >
        <div className="hero-fade absolute inset-0" style={{ animationDelay: "0.25s" }}>
        <motion.img
          src="/hero/aethara.webp"
          srcSet="/hero/aethara-sm.webp 640w, /hero/aethara.webp 1500w"
          sizes="(min-width: 1024px) 34vw, 80vw"
          alt="Aethara navy rigid box with an art-nouveau gold foil illustration"
          width={1500}
          height={1518}
          fetchPriority="high"
          initial={false}
          animate={{ opacity: revealed ? 0 : 1 }}
          transition={{ duration: 0.4, ease: EASE }}
          style={live ? { WebkitMaskImage: photoMask, maskImage: photoMask } : undefined}
          draggable={false}
          className="pointer-events-none absolute left-[13%] top-[13%] h-[74%] w-[74%] select-none object-contain"
        />
        </div>
        {live && (
          <>
            <motion.div
              style={{ WebkitMaskImage: sceneMask, maskImage: sceneMask, left: `-${BLEED_L * 100}%`, right: `-${BLEED_R * 100}%` }}
              className="pointer-events-none absolute inset-y-0"
            >
              <BoxScene onReady={() => setReady(true)} sweep={sweep} eventSource={stageRef} onInteract={() => setUsed(true)} />
            </motion.div>
            {/* the light: a soft warm band riding the seam */}
            <motion.div
              aria-hidden="true"
              style={{ left: bandLeft, opacity: bandOpacity }}
              className="pointer-events-none absolute inset-y-[4%] w-[26%] -translate-x-1/2 bg-[linear-gradient(90deg,rgba(255,247,230,0)_0%,rgba(255,247,230,0.75)_50%,rgba(255,247,230,0)_100%)] mix-blend-soft-light"
            />
            <AnimatePresence>
              {revealed && hover && !used && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="pointer-events-none absolute bottom-[13%] left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap bg-ink px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-white"
                >
                  <HandGrabbing aria-hidden="true" weight="bold" className="h-4 w-4" /> Drag to turn, click to open
                </motion.p>
              )}
            </AnimatePresence>
            <motion.div
              aria-hidden="true"
              style={{ left: bandLeft, opacity: bandOpacity }}
              className="pointer-events-none absolute inset-y-[8%] w-[3px] -translate-x-1/2 bg-[linear-gradient(180deg,rgba(255,250,240,0)_0%,rgba(255,250,240,0.9)_50%,rgba(255,250,240,0)_100%)] blur-[1px]"
            />
          </>
        )}
      </div>
      <div className="relative mx-auto -mt-[7%] flex max-w-[420px] items-end justify-between gap-6 border-t border-ink/15 pt-4 lg:max-w-[620px]">
        <div>
          <p className="text-[17px] font-semibold text-ink [font-stretch:108%]">Aethara</p>
          <p className="mt-1 text-[14px] text-muted">Book-style rigid box, hidden magnetic flap, gold foil</p>
        </div>
        <Link href="/work/aethara/" className="label shrink-0 text-ink underline decoration-ink/30 underline-offset-4 hover:text-red">
          See the project
        </Link>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ bits */

function HeroCta({ href, primary = false, children }: { href: string; primary?: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`group inline-flex min-h-12 items-center gap-3 whitespace-nowrap px-6 text-[13px] font-semibold uppercase tracking-[0.12em] transition-[background-color,color,border-color,transform] duration-300 active:scale-[0.98] ${
        primary ? "bg-red text-white hover:bg-red-deep" : "border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-white"
      }`}
    >
      {children}
      <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
}

/** A printer's registration target, a quiet print detail beside the label. */
function RegTarget() {
  return (
    <svg aria-hidden="true" viewBox="0 0 18 18" className="h-[18px] w-[18px] shrink-0">
      <circle cx="9" cy="9" r="5" fill="none" stroke="#141414" strokeWidth="1.2" />
      <path d="M9 1v16M1 9h16" stroke="#141414" strokeWidth="1.2" />
    </svg>
  );
}

/** Corner crop marks that draw in on load. */
function RegMarks({ reduce }: { reduce: boolean }) {
  const draw = (delay: number) =>
    reduce ? {} : { initial: { pathLength: 0, opacity: 0 }, animate: { pathLength: 1, opacity: 1 }, transition: { duration: 0.8, ease: EASE, delay } };
  const corner = (x: number, y: number, sx: number, sy: number, k: number) => (
    <motion.path key={k} d={`M${x} ${y + 26 * sy} V${y} H${x + 26 * sx}`} fill="none" stroke="rgba(20,20,20,0.3)" strokeWidth="1" vectorEffect="non-scaling-stroke" {...draw(0.2 + k * 0.05)} />
  );
  return (
    <svg aria-hidden="true" className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block" viewBox="0 0 1000 1000" preserveAspectRatio="none">
      {corner(28, 100, 1, 1, 0)}
      {corner(972, 100, -1, 1, 1)}
      {corner(28, 970, 1, -1, 2)}
      {corner(972, 970, -1, -1, 3)}
    </svg>
  );
}
