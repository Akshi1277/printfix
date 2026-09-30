"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { hero, quoteHref } from "../../content";
import { EASE } from "../ui";
import { useChoreo, useFinePointer, useSectionProgress } from "../useChoreo";

/*
 * HERO — "a packaging campaign, brought to life".
 * One real focal object (the Aethara rigid box, cut out from Printfix's own photograph) sits on a
 * warm table with three real supporting pieces at different depths: a printed sheet lying flat behind,
 * the Velina cube, and a blind-emboss swatch in the foreground. The giant word PACKAGING sits behind
 * the box; "people notice." sits in front of it.
 *
 * Load   (~1.8s): paper → label → registration marks draw → box rises → pieces stagger in → headline → copy → CTA.
 * Cursor (desktop): box leans ±2° and shifts ±8px with a soft highlight; each piece moves by its depth.
 * Scroll (desktop, 210vh sticky):
 *   0 → .25  headline rises, box sinks slightly (depth), "notice." grows a touch
 *   .2 → .6  camera moves in: the box grows, the pieces part, type and labels fade
 *   .6 → .85 the box slides left and the next story — the Aethara case study — arrives beside it
 */

const BOX = { src: "/hero/aethara.webp", alt: "Aethara rigid box with a navy wrap with an art-nouveau gold foil illustration" };
// annotations sit in a column just beside the box — they point at it, never cover it
const LABELS = ["Rigid setup box", "Gold foil stamping", "Book-style opening", "Hidden magnetic flap"];

// Remount when the mode flips so the scroll listener binds to the live element.
export default function Hero() {
  const choreo = useChoreo();
  return <HeroImpl key={choreo ? "choreo" : "static"} choreo={choreo} />;
}

function HeroImpl({ choreo }: { choreo: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const p = useSectionProgress(ref);
  const fine = useFinePointer();

  // pointer → springs (−0.5 … 0.5)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 70, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 70, damping: 18, mass: 0.6 });
  const onMove = (e: React.PointerEvent) => {
    if (!fine || !choreo) return;
    mx.set(e.clientX / window.innerWidth - 0.5);
    my.set(e.clientY / window.innerHeight - 0.5);
  };

  if (!choreo) return <StaticHero sectionRef={ref} />;

  return (
    <section ref={ref} onPointerMove={onMove} className="relative h-[210vh]" aria-labelledby="hero-title">
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        <Scene p={p} sx={sx} sy={sy} />
      </div>
    </section>
  );
}

function Scene({ p, sx, sy }: { p: MotionValue<number>; sx: MotionValue<number>; sy: MotionValue<number> }) {
  // --- scroll choreography
  const headY = useTransform(p, [0, 0.25], [0, -60]);
  const noticeScale = useTransform(p, [0, 0.25], [1, 1.06]);
  const typeOut = useTransform(p, [0.22, 0.42], [1, 0]);
  const boxScale = useTransform(p, [0, 0.2, 0.52, 0.78], [1, 1, 1.9, 1.2]);
  const boxX = useTransform(p, [0.52, 0.78], ["0vw", "-23vw"]);
  const boxSink = useTransform(p, [0, 0.25, 0.52, 0.78], [0, 30, 60, 20]);
  const part = useTransform(p, [0.2, 0.55], [0, 1]);
  const piecesOut = useTransform(p, [0.25, 0.5], [1, 0]);
  const storyO = useTransform(p, [0.78, 0.92], [0, 1]);
  const storyY = useTransform(p, [0.78, 0.92], [40, 0]);

  // --- pointer depth (px per unit of pointer offset)
  const d = (k: number) => ({ x: useTransform(sx, (v) => v * k), y: useTransform(sy, (v) => v * k) });
  const boxPtr = d(16); // ±8px
  const cubePtr = d(40);
  const rotY = useTransform(sx, [-0.5, 0.5], [-8, -4]); // resting −6°, ±2° with the pointer
  const rotX = useTransform(sy, [-0.5, 0.5], [5, 1]);
  const light = useTransform([sx, sy], ([x, y]) =>
    `radial-gradient(circle at ${50 + (x as number) * 70}% ${40 + (y as number) * 60}%, rgba(255,246,226,0.55), rgba(255,246,226,0) 45%)`,
  );

  // pieces part outward as the camera moves in
  const cubeX = useTransform(part, [0, 1], ["0vw", "26vw"]);

  const t = (delay: number, dur = 0.9) => ({ duration: dur, ease: EASE, delay });

  return (
    <>
      {/* 0 — warm table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={t(0, 0.6)} className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_62%,#FBFAF7_0%,#F4F3F0_45%,#E9E6DF_100%)]" />

      {/* 2 — registration marks & hairlines */}
      <RegMarks />

      {/* 1 — production label */}
      <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={t(0.1)} style={{ opacity: typeOut }} className="label absolute left-[4vw] top-[108px] z-30 text-muted">
        {hero.label}
      </motion.p>

      {/* giant word, behind the box */}
      <motion.div style={{ y: headY, opacity: typeOut }} className="absolute inset-x-0 top-[17vh] z-0 text-center">
        <h1 id="hero-title" className="sr-only">Packaging people notice. Touch, open, keep.</h1>
        <span aria-hidden="true" className="block overflow-hidden">
          <motion.span initial={{ y: "100%" }} animate={{ y: 0 }} transition={t(0.75, 1)} className="display block text-[clamp(72px,14.6vw,260px)] uppercase leading-[0.8] tracking-[-0.05em] text-ink">
            Packaging
          </motion.span>
        </span>
      </motion.div>

      {/* 4 — Velina cube, mid depth */}
      <motion.div style={{ x: cubeX, opacity: piecesOut }} className="absolute right-[5vw] top-[47vh] z-10 w-[12vw]">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={t(0.65)} style={cubePtr}>
          <img src="/hero/velina-cube.webp" alt="Velina green shoulder-neck rigid box with gold foil florals" width={900} height={803} className="w-full drop-shadow-[0_28px_24px_rgba(40,30,20,0.28)]" />
          <p className="label mt-3 text-center text-muted">Velina rigid box</p>
        </motion.div>
      </motion.div>

      {/* 5 — the box: the focal object */}
      <motion.div style={{ x: boxX, y: boxSink, scale: boxScale }} className="absolute left-1/2 top-[27vh] z-20 w-[min(31vw,56vh)] -translate-x-1/2 [perspective:1400px]">
        <motion.div initial={{ opacity: 0, y: 70, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={t(0.35, 1.1)}>
          <motion.div style={{ ...boxPtr, rotateY: rotY, rotateX: rotX }} className="relative [transform-style:preserve-3d]">
            {/* contact shadow on the table */}
            <div aria-hidden="true" className="absolute -bottom-[6%] left-[8%] h-[12%] w-[84%] rounded-[50%] bg-black/30 blur-2xl" />
            <img src={BOX.src} alt={BOX.alt} width={1500} height={1518} fetchPriority="high" className="relative w-full drop-shadow-[0_40px_36px_rgba(30,24,18,0.32)]" />
            {/* moving highlight, clipped to the box by using the cut-out as a mask */}
            <motion.div
              aria-hidden="true"
              style={{ backgroundImage: light, WebkitMaskImage: `url(${BOX.src})`, maskImage: `url(${BOX.src})`, WebkitMaskSize: "100% 100%", maskSize: "100% 100%" }}
              className="pointer-events-none absolute inset-0 mix-blend-soft-light"
            />
          </motion.div>
        </motion.div>

        {/* production annotations (facts from the Aethara spec) */}
        <motion.div style={{ opacity: typeOut }} className="pointer-events-none absolute inset-0">
          {LABELS.map((l, i) => (
            <motion.span
              key={l}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={t(1.25 + i * 0.08, 0.6)}
              style={{ top: `${30 + i * 10}%` }}
              className="label absolute left-[calc(100%+14px)] flex items-center gap-2 whitespace-nowrap text-[10px] text-ink-2"
            >
              <span className="h-px w-6 bg-ink/40" /> {l}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>

      {/* front type: "people notice." + copy + CTAs */}
      <motion.div style={{ y: headY, opacity: typeOut }} className="absolute bottom-[8vh] left-[4vw] z-40 w-[calc(47.5vw-min(15.5vw,28vh)-2vw)]">
        <span className="block overflow-hidden pb-[0.05em]">
          <motion.span initial={{ y: "100%" }} animate={{ y: 0 }} transition={t(0.9, 1)} className="block origin-left">
            <motion.span style={{ scale: noticeScale }} className="display block origin-left text-[clamp(38px,min(5.2vw,9vh),104px)] uppercase text-ink">
              People notice.
            </motion.span>
          </motion.span>
        </span>
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={t(1.05)} className="mt-5 max-w-[420px] text-[16px] leading-relaxed text-ink-2">
          Rigid boxes, cartons, mailers, bags and books, offset printed, foiled, embossed and finished for your brand, at low MOQ.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={t(1.3)} className="mt-6 flex flex-wrap gap-2 xl:gap-3">
          <HeroCta href={quoteHref} primary>Get a quote</HeroCta>
          <HeroCta href="/work/">View our work</HeroCta>
        </motion.div>
      </motion.div>

      {/* the next story arrives beside the box */}
      <motion.div style={{ opacity: storyO, y: storyY }} className="absolute right-[6vw] top-1/2 z-40 w-[34vw] -translate-y-1/2">
        <p className="label text-muted">Case study</p>
        <p className="display mt-5 text-[clamp(44px,5vw,88px)] text-ink">Aethara</p>
        <p className="mt-4 max-w-[380px] text-[17px] leading-relaxed text-ink-2">A book-style rigid box with a hidden magnetic flap, printed and gold foil stamped.</p>
        <Link href="/work/aethara/" className="group mt-7 inline-flex items-center gap-2 border-b border-ink/30 pb-1 text-[13px] font-semibold uppercase tracking-[0.12em] text-ink hover:border-red hover:text-red">
          See the project <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </motion.div>
    </>
  );
}

function HeroCta({ href, primary = false, children }: { href: string; primary?: boolean; children: React.ReactNode }) {
  return (
    <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.25, ease: EASE }}>
      <Link
        href={href}
        className={`group inline-flex min-h-12 items-center gap-3 whitespace-nowrap px-4 text-[12px] font-semibold uppercase tracking-[0.11em] transition-colors duration-300 xl:px-6 xl:text-[13px] ${
          primary ? "bg-red text-white hover:bg-red-deep" : "border border-ink/25 bg-paper/70 text-ink hover:border-ink hover:bg-ink hover:text-white"
        }`}
      >
        {children}
        <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </motion.div>
  );
}

/** Printer's registration marks and hairlines that draw in on load. */
function RegMarks() {
  const draw = (delay: number) => ({ initial: { pathLength: 0, opacity: 0 }, animate: { pathLength: 1, opacity: 1 }, transition: { duration: 0.8, ease: EASE, delay } });
  const corner = (x: number, y: number, sx: number, sy: number, k: number) => (
    <motion.path key={k} d={`M${x} ${y + 26 * sy} V${y} H${x + 26 * sx}`} fill="none" stroke="rgba(20,20,20,0.35)" strokeWidth="1" {...draw(0.2 + k * 0.05)} />
  );
  return (
    <svg aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] h-full w-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
      {corner(40, 90, 1, 1, 0)}
      {corner(960, 90, -1, 1, 1)}
      {corner(40, 955, 1, -1, 2)}
      {corner(960, 955, -1, -1, 3)}
    </svg>
  );
}

/** Mobile / reduced motion: one strong object, stacked type, no cursor or parallax. */
function StaticHero({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[radial-gradient(ellipse_at_50%_60%,#FBFAF7_0%,#F4F3F0_50%,#E9E6DF_100%)] pb-12 pt-20 md:pt-28" aria-labelledby="hero-title-m">
      <div className="wrap">
        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }} className="label text-muted">
          {hero.label}
        </motion.p>
        <h1 id="hero-title-m" className="display mt-5 uppercase text-ink">
          <motion.span initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.1 }} className="block text-[clamp(44px,13.2vw,120px)] leading-[0.85] tracking-[-0.05em]">Packaging</motion.span>
          <motion.span initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.2 }} className="mt-2 block text-[clamp(30px,8.6vw,72px)]">people notice.</motion.span>
        </h1>
        <motion.div initial={{ opacity: 0, y: 40, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1, ease: EASE, delay: 0.3 }} className="relative mx-auto mt-6 w-[64%] max-w-[420px]">
          <div aria-hidden="true" className="absolute -bottom-[5%] left-[10%] h-[10%] w-[80%] rounded-[50%] bg-black/25 blur-2xl" />
          <img src="/hero/aethara-sm.webp" alt={BOX.alt} width={640} height={648} fetchPriority="high" className="relative w-full drop-shadow-[0_30px_28px_rgba(30,24,18,0.3)]" />
        </motion.div>
        <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.6 }} className="mt-7 max-w-[460px] text-[15px] leading-relaxed text-ink-2">
          Rigid boxes, cartons, mailers, bags and books, offset printed, foiled, embossed and finished for your brand, at low MOQ.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.75 }} className="mt-5 flex flex-wrap gap-3">
          <HeroCta href={quoteHref} primary>Get a quote</HeroCta>
          <HeroCta href="/work/">View our work</HeroCta>
        </motion.div>
      </div>
    </section>
  );
}
