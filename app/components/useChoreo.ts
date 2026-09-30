"use client";

import { useEffect, useState } from "react";
import { useMotionValue, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";

/**
 * Scroll choreography (sticky sections, scroll-linked transforms) runs only on wide screens
 * with motion allowed. Everywhere else the same sections render in their calm, static state:
 * all content stays visible, nothing depends on scrolling.
 */
export function useChoreo() {
  const reduce = useReducedMotion();
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const on = () => setWide(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return wide && !reduce;
}

/** Fine pointer + motion allowed, for cursor-driven effects (light, magnetism). */
export function useFinePointer() {
  const reduce = useReducedMotion();
  const [fine, setFine] = useState(false);
  useEffect(() => setFine(window.matchMedia("(hover: hover) and (pointer: fine)").matches), []);
  return fine && !reduce;
}

/**
 * 0 to 1 progress of the page scrolling through a tall (sticky) section:
 * 0 when its top reaches the top of the viewport, 1 when its bottom reaches the bottom.
 * Driven by the page's own useScroll() (no target, so it stays correct across remounts),
 * measured against the element each frame the scroll position changes.
 */
export function useSectionProgress(ref: React.RefObject<HTMLElement | null>) {
  const mv = useMotionValue(0);
  const { scrollY } = useScroll();
  const update = () => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const range = r.height - window.innerHeight;
    mv.set(range > 0 ? Math.min(1, Math.max(0, -r.top / range)) : 0);
  };
  useMotionValueEvent(scrollY, "change", update);
  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return mv;
}
