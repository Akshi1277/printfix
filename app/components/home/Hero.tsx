"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { createPortal, preload } from "react-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useMotionTemplate, useMotionValue, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import { ArrowRight, HandGrabbing, Pause, Play } from "@phosphor-icons/react/dist/ssr";
import { hero, heroBoxes, quoteHref } from "../../content";
import { EASE } from "../ui";
import { PAPER, TEXTURES } from "./boxes/assets";
import type { Frame } from "./BoxScene";

/*
 * HERO: "light reveals the object".
 * The headline rises into place, sharp from the first frame. A band of warm light crosses the whole
 * hero, behind the type, and leaves the real-time 3D box behind it, raking the foil as it passes. Then
 * the cover peeks once, and the box is yours to turn and open. Every few seconds the box flies at you,
 * crosses the whole hero up close, and as it leaves the next box is on the table. One screen tall, no
 * pinned scroll.
 */

export default function Hero() {
  const reduce = useReducedMotion() ?? false;
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState<number | null>(null); // the box flying out, during a move
  const light = useHeroLight();
  // fetch the first box's textures alongside the page, not after the 3D code arrives; three.js loads
  // images in CORS mode, so the preload must too or the browser fetches them twice
  for (const href of [...TEXTURES[heroBoxes[0].slug], ...PAPER]) preload(href, { as: "image", crossOrigin: "anonymous", fetchPriority: "low" });

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_70%_55%,#FBFAF7_0%,#F4F3F0_50%,#E9E6DF_100%)]" aria-labelledby="hero-title">
      {/* the light: a soft warm band across the full height, behind the type */}
      <motion.div
        aria-hidden="true"
        style={{ left: light.x, opacity: light.opacity, width: `${BAND * 200}%` }}
        className="pointer-events-none absolute inset-y-0 -translate-x-1/2 bg-[linear-gradient(90deg,rgba(255,251,243,0)_0%,rgba(255,251,243,0.72)_50%,rgba(255,251,243,0)_100%)]"
      />
      <motion.div
        aria-hidden="true"
        style={{ left: light.x, opacity: light.opacity }}
        className="pointer-events-none absolute inset-y-0 w-[2px] -translate-x-1/2 bg-[linear-gradient(180deg,rgba(255,253,248,0)_0%,rgba(255,253,248,0.95)_30%,rgba(255,253,248,0.95)_70%,rgba(255,253,248,0)_100%)]"
      />
      <RegMarks reduce={reduce} />

      {/* phone: headline, then copy + CTAs (above the fold), then the box. Desktop: type left, box right. */}
      <div className="wrap relative grid min-h-[100dvh] content-center gap-y-8 pb-12 pt-28 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-0 lg:pb-16 lg:pt-24">
        <div className="relative z-10 order-1 lg:order-none lg:col-span-7 lg:row-start-1 lg:self-end">
          <p className="hero-fade label flex items-center gap-3 text-ink-2" style={{ animationDelay: "0.05s" }}>
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
          <BoxStage reduce={reduce} index={index} setIndex={setIndex} prev={prev} setPrev={setPrev} light={light} />
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

// the light, as shares of the hero's width: its band's half-width, and the soft edge of what it reveals
// (narrower than the band, so the edge is always under the light)
const BAND = 0.11;
const SOFT = 0.05;

type HeroLight = {
  sweep: MotionValue<number>; // the first reveal, 0..1
  swap: MotionValue<number>; // a move between boxes (the fly-past), 0..1 (1 at rest)
  x: MotionValue<number>; // where the light is, px from the hero's left edge
  opacity: MotionValue<number>;
  geo: React.RefObject<Frame>; // the hero's size, and where the box stage sits in it
};

/** The light that rides the first reveal across the whole hero. */
function useHeroLight(): HeroLight {
  const sweep = useMotionValue(0);
  const swap = useMotionValue(1);
  const geo = useRef<Frame>({ w: 1, h: 1, sl: 0, st: 0, sw: 1 });
  // from fully off the left edge to fully off the right
  const x = useTransform(sweep, (v) => {
    const { w } = geo.current;
    return v * w * (1 + 2 * BAND) - BAND * w;
  });
  const opacity = useTransform(sweep, [0, 0.04, 0.96, 1], [0, 1, 1, 0]);
  return { sweep, swap, x, opacity, geo };
}

// start fetching the 3D code as soon as this module runs, not when the hero first renders after hydration
const loadBoxScene = () => import("./BoxScene");
if (typeof window !== "undefined") void loadBoxScene();
const BoxScene = dynamic(loadBoxScene, { ssr: false });

// the first light goes as soon as the box is ready (just not before the headline has begun to rise)
const SWEEP_EARLIEST = 0.5; // s after mount
const SWEEP_DURATION = 1.6;
// it races across the type and slows over the box: the glimmer reaches the box ~0.33s in, then lingers
const INTRO_EASE = [0.2, 0.7, 0.35, 1] as const;
const FLY_DURATION = 1.8; // the fly-past, from lifting off the table to gone past the left edge
const DWELL = 4; // s each box holds the stage while playing
const HOLD = 2; // s the slideshow waits after someone last turned, opened or picked a box

/**
 * Real-time 3D on every screen. A light sweep reveals the first box; each move to the next is the box on
 * show flying past the viewer. Plays on its own: hovering the box holds it, and so does turning or opening a box, for
 * a moment after the last touch; then it carries on. Only the pause button stops it for good, and the
 * hero leaving the screen holds it. For reduced motion nothing moves
 * on its own: no autoplay, no sweep, no idle sway; boxes change in place and turn only when dragged.
 */
function BoxStage({
  reduce,
  index,
  setIndex,
  prev,
  setPrev,
  light,
}: {
  reduce: boolean;
  index: number;
  setIndex: (i: number) => void;
  prev: number | null;
  setPrev: (i: number | null) => void;
  light: HeroLight;
}) {
  const [ready, setReady] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [loaded, setLoaded] = useState<boolean[]>(() => heroBoxes.map(() => false));
  const [pending, setPending] = useState<number | null>(null); // a box asked for before it could be shown
  const [playing, setPlaying] = useState(true);
  const [onScreen, setOnScreen] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const mountedAt = useRef(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const swapCtl = useRef<ReturnType<typeof animate> | null>(null);
  const [hover, setHover] = useState(false);
  const [used, setUsed] = useState(false);
  const [held, setHeld] = useState(false); // someone has just been handling a box
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [host, setHost] = useState<HTMLElement | null>(null); // the hero, which the 3D canvas covers
  const { sweep, swap, geo } = light;
  const tick = useMotionValue(0); // how far through its turn the box on show is, while playing

  useEffect(() => {
    mountedAt.current = performance.now();
    const vis = () => setPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", vis);
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting));
    if (stageRef.current) io.observe(stageRef.current);
    return () => {
      document.removeEventListener("visibilitychange", vis);
      io.disconnect();
      swapCtl.current?.stop();
      if (holdTimer.current) clearTimeout(holdTimer.current);
    };
  }, []);
  useEffect(() => {
    const st = stageRef.current;
    const sec = st?.closest("section");
    if (!st || !sec) return;
    setHost(sec);
    const measure = () => {
      const s = sec.getBoundingClientRect();
      const r = st.getBoundingClientRect();
      geo.current = { w: s.width, h: s.height, sl: r.left - s.left, st: r.top - s.top, sw: r.width };
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(sec);
    ro.observe(st);
    return () => ro.disconnect();
  }, [geo]);
  // nothing moves on its own for people who asked for less motion
  useEffect(() => {
    if (reduce) setPlaying(false);
  }, [reduce]);

  useEffect(() => {
    if (!ready) return;
    if (reduce) {
      sweep.set(1);
      setRevealed(true);
      return;
    }
    const since = (performance.now() - mountedAt.current) / 1000;
    const c = animate(sweep, 1, {
      duration: SWEEP_DURATION,
      ease: INTRO_EASE,
      delay: Math.max(0.05, SWEEP_EARLIEST - since),
      onComplete: () => setRevealed(true),
    });
    return () => c.stop();
  }, [ready, reduce, sweep]);

  const go = useCallback(
    (to: number) => {
      to = (to + heroBoxes.length) % heroBoxes.length;
      if (to === index) return setPending(null);
      // asked for mid-move, or before that box is ready: remember it and go as soon as it can
      if (prev !== null || !revealed || !loaded[to]) return setPending(to);
      setPending(null);
      tick.set(0);
      setIndex(to);
      if (reduce) return; // change in place
      setPrev(index);
      swap.set(0);
      // linear here: the fly-past shapes its own pace
      swapCtl.current = animate(swap, 1, { duration: FLY_DURATION, ease: "linear", onComplete: () => setPrev(null) });
    },
    [index, prev, reduce, revealed, loaded, tick, swap, setIndex, setPrev],
  );
  useEffect(() => {
    if (pending !== null && prev === null && revealed && loaded[pending]) go(pending);
  }, [pending, prev, revealed, loaded, go]);

  // autoplay: fill the active segment, then move on; holding keeps the progress where it is. The next box
  // finishes loading while this one is on show; if it isn't ready when the time is up, it follows as soon as it is
  const running = playing && !hover && !held && onScreen && pageVisible && prev === null && heroBoxes.length > 1 && revealed;
  useEffect(() => {
    if (!running) return;
    const c = animate(tick, 1, { duration: DWELL * (1 - tick.get()), ease: "linear", onComplete: () => go(index + 1) });
    return () => c.stop();
  }, [running, index, tick, go]);

  // the first reveal: the 3D (whose canvas covers the hero) appears behind the light, with a soft edge
  const ca = useTransform(light.x, (x) => ((x - SOFT * geo.current.w) / geo.current.w) * 100);
  const cb = useTransform(light.x, (x) => ((x + SOFT * geo.current.w) / geo.current.w) * 100);
  const sceneMask = useMotionTemplate`linear-gradient(90deg, #000 ${ca}%, transparent ${cb}%)`;
  const lineLeft = useTransform(light.x, (x) => `${((x - geo.current.sl) / geo.current.sw) * 100}%`);

  const box = heroBoxes[index];
  // no hover on touch screens: show the hint for a few seconds once the box is revealed
  const [mouse, setMouse] = useState(true);
  useEffect(() => setMouse(window.matchMedia("(hover: hover) and (pointer: fine)").matches), []);
  const [touchHint, setTouchHint] = useState(false);
  useEffect(() => {
    if (!revealed || mouse) return;
    setTouchHint(true);
    const t = setTimeout(() => setTouchHint(false), 3500);
    return () => clearTimeout(t);
  }, [revealed, mouse]);
  // handling a box holds the slideshow; it carries on a moment after the last touch
  const touched = () => {
    setUsed(true);
    setHeld(true);
    if (holdTimer.current) clearTimeout(holdTimer.current);
    holdTimer.current = setTimeout(() => setHeld(false), HOLD * 1000);
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Packaging we have made"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(index + 1);
        else if (e.key === "ArrowLeft") go(index - 1);
      }}
    >
      <div
        ref={stageRef}
        role="img"
        aria-label={box.alt}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
        // vertical swipes still scroll the page on touch; sideways drags turn the box
        className="relative mx-auto aspect-square w-full max-w-[420px] touch-pan-y select-none lg:max-w-[620px]"
      >
        {/* the 3D canvas covers the whole hero, above the type (a box flies over everything), never taking clicks */}
        {host &&
          createPortal(
            <motion.div style={{ WebkitMaskImage: sceneMask, maskImage: sceneMask }} className="pointer-events-none absolute inset-0 z-20">
              <BoxScene
                boxes={heroBoxes.map((h) => h.slug)}
                current={index}
                prev={prev}
                preload={revealed}
                onModelReady={(i) => {
                  setLoaded((l) => (l[i] ? l : l.map((v, j) => v || j === i)));
                  if (i === 0) setReady(true);
                }}
                sweep={sweep}
                swap={swap}
                frame={geo}
                eventSource={stageRef}
                onInteract={touched}
                still={reduce}
              />
            </motion.div>,
            host,
          )}
        <AnimatePresence>
          {revealed && (mouse ? hover : touchHint) && !used && prev === null && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="pointer-events-none absolute bottom-[13%] left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap bg-ink px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-white"
            >
              <HandGrabbing aria-hidden="true" weight="bold" className="h-4 w-4" /> Drag to turn, {mouse ? "click" : "tap"} to open
            </motion.p>
          )}
        </AnimatePresence>
        {/* where the light crosses the box: a bright hairline, over the box, hiding the edge between the two */}
        <motion.div
          aria-hidden="true"
          style={{ left: lineLeft, opacity: light.opacity }}
          className="pointer-events-none absolute inset-y-[8%] z-30 w-[3px] -translate-x-1/2 bg-[linear-gradient(180deg,rgba(255,250,240,0)_0%,rgba(255,250,240,0.9)_50%,rgba(255,250,240,0)_100%)] blur-[1px]"
        />
      </div>

      <div className="relative mx-auto -mt-[7%] max-w-[420px] lg:max-w-[620px]">
        {/* the rule under the box doubles as the picker: one segment per box, the active one fills while playing */}
        <div className="flex items-center gap-3">
          <div className="flex flex-1 gap-2">
            {heroBoxes.map((h, i) => (
              <button
                key={h.slug}
                type="button"
                onClick={() => go(i)}
                aria-label={`Show ${h.name}`}
                aria-current={i === index ? "true" : undefined}
                className="group relative h-6 flex-1 cursor-pointer"
              >
                <span className="absolute inset-x-0 top-1/2 h-px bg-ink/20 transition-colors duration-300 group-hover:bg-ink/45" />
                <motion.span className="absolute inset-x-0 top-1/2 h-px origin-left bg-ink" style={{ scaleX: i === index ? (playing ? tick : 1) : 0 }} />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause the boxes" : "Play the boxes"}
            className="grid h-8 w-8 shrink-0 place-items-center text-ink/70 transition-colors hover:text-ink"
          >
            {playing ? <Pause aria-hidden="true" weight="fill" className="h-3.5 w-3.5" /> : <Play aria-hidden="true" weight="fill" className="h-3.5 w-3.5" />}
          </button>
        </div>
        <div aria-live={playing ? "off" : "polite"} className="pt-2">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={box.slug}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="flex items-end justify-between gap-6"
            >
              <div>
                <p className="text-[17px] font-semibold text-ink [font-stretch:108%]">{box.name}</p>
                <p className="mt-1 text-[14px] text-ink-2">{box.caption}</p>
              </div>
              <Link href={box.href} className="label shrink-0 text-ink underline decoration-ink/30 underline-offset-4 hover:text-red">
                See the project
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
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
