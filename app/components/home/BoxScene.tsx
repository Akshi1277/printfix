"use client";

import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";
import { SoftShadow, type BoxSpec } from "./boxes/kit";
import { aethara } from "./boxes/Aethara";
import { velina } from "./boxes/Velina";
import { birra } from "./boxes/Birra";

/*
 * The hero's boxes, as real objects, in one canvas. Each box is built from primitives in ./boxes and
 * shares this stage: the raking light, the turntable (drag to turn, click to open) and the table shadow.
 * Moving between boxes, the light sweeps across and the next box appears behind it: each box is clipped
 * against a plane through the camera and the light's on-screen seam, so the two share the stage
 * mid-sweep without a second canvas.
 */

const SPECS: Record<string, BoxSpec> = { aethara, velina, birra };

/**
 * The canvas is wider than the box's square stage (it bleeds left into the gap, a little right), so a
 * turned or opened box is never clipped. The camera renders a sub-view of a frame centred on the stage,
 * so the resting pose sits exactly where the photograph was. Pointer input comes from the stage only,
 * so the bleed never blocks the headline or buttons underneath.
 */
export const BLEED = { left: 0.6, right: 0.08 }; // fractions of the stage width

/** solo: the box on show. in/out: arriving behind the light / leaving ahead of it. hidden: loaded, waiting. */
type Role = "solo" | "in" | "out" | "hidden";

export default function BoxScene({
  boxes,
  current,
  prev,
  preload,
  onModelReady,
  sweep,
  swap,
  seam,
  eventSource,
  onInteract,
  still = false,
}: {
  boxes: string[];
  current: number;
  prev: number | null;
  preload: boolean; // load the other boxes too (after the first reveal, so they never delay it)
  onModelReady?: (i: number) => void;
  onInteract?: () => void;
  sweep?: MotionValue<number>; // the first reveal, photo to 3D
  swap?: MotionValue<number>; // a move between boxes
  seam?: MotionValue<number>; // the light's position across the canvas during a move, 0..1
  eventSource?: React.RefObject<HTMLElement | null>;
  still?: boolean; // reduced motion: no idle sway, lean or peek; the box moves only when handled
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState<Set<number>>(() => new Set([current]));

  // stop rendering while the hero is off screen
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // once mounted a box stays mounted (and compiled), so coming back to it is instant
  useEffect(() => {
    setMounted((m) => {
      const want = preload ? boxes.map((_, i) => i) : [current];
      if (want.every((i) => m.has(i))) return m;
      return new Set([...m, ...want]);
    });
  }, [preload, current, boxes]);

  return (
    <div ref={wrap} className="h-full w-full">
      <Canvas
        frameloop={visible ? "always" : "never"}
        eventSource={eventSource as React.RefObject<HTMLElement>}
        dpr={[1, 2]}
        camera={{ position: [0, 1.3, 2.9], fov: 30 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl, setEvents }) => {
          // pointer from the canvas's real on-screen rect (events arrive from the smaller stage element)
          setEvents({
            compute: (event, state) => {
              const r = state.gl.domElement.getBoundingClientRect();
              state.pointer.set(((event.clientX - r.left) / r.width) * 2 - 1, -((event.clientY - r.top) / r.height) * 2 + 1);
              state.raycaster.setFromCamera(state.pointer, state.camera);
            },
          });
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 0.98;
          gl.localClippingEnabled = true;
        }}
      >
        <Stage sweep={sweep} swap={swap} />
        {boxes.map((slug, i) =>
          mounted.has(i) ? (
            <Suspense key={slug} fallback={null}>
              <Turntable
                spec={SPECS[slug]}
                role={i === current ? (prev === null ? "solo" : "in") : i === prev ? "out" : "hidden"}
                sweep={sweep}
                seam={seam}
                onReady={() => onModelReady?.(i)}
                onInteract={onInteract}
                still={still}
              />
            </Suspense>
          ) : null,
        )}
      </Canvas>
    </div>
  );
}

/** Framing, lights and the studio reflections every box shares. */
function Stage({ sweep, swap }: { sweep?: MotionValue<number>; swap?: MotionValue<number> }) {
  const camera = useThree((st) => st.camera);
  const size = useThree((st) => st.size);
  const pointer = useThree((st) => st.pointer);
  const light = useRef<THREE.PointLight>(null);
  useEffect(() => camera.lookAt(0, -0.02, 0), [camera]);

  useFrame((_, dt) => {
    // keep the stage-centred framing whatever size the canvas is
    const cam = camera as THREE.PerspectiveCamera;
    const S = size.height;
    const fullW = S * (1 + 2 * BLEED.left);
    if (cam.view === null || cam.view.fullWidth !== fullW || cam.view.width !== size.width) {
      cam.aspect = fullW / S;
      cam.setViewOffset(fullW, S, 0, 0, size.width, size.height);
      cam.updateProjectionMatrix();
    }

    // raking light: while the light crosses (the reveal, or a move between boxes) it rides the sweep
    // across the foil; otherwise it follows the pointer
    const k = (rate: number) => 1 - Math.exp(-Math.min(dt, 0.05) * rate);
    const sv = Math.min(sweep ? sweep.get() : 1, swap ? swap.get() : 1);
    const l = light.current;
    if (!l) return;
    if (sv < 1) {
      l.position.x = -1.8 + 3.6 * sv;
      l.position.y = 0.55;
      l.intensity = 7 + 16 * Math.sin(Math.PI * sv);
    } else {
      l.position.x += (pointer.x * 2.4 - l.position.x) * k(5);
      l.position.y += (pointer.y * 1.6 + 0.4 - l.position.y) * k(5);
      l.intensity += (7 - l.intensity) * k(3);
    }
  });

  return (
    <>
      <ambientLight intensity={0.28} />
      <directionalLight position={[-2.5, 3, 3]} intensity={1.1} />
      <pointLight ref={light} position={[0, 0.4, 2.2]} intensity={7} distance={0} decay={2} color="#fffaf2" />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.2} position={[-3, 2, 3]} scale={[4, 3, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={1.4} position={[3, 1, 2]} scale={[1.5, 4, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={0.8} position={[0, 4, 0]} rotation-x={Math.PI / 2} scale={[6, 6, 1]} />
        <Lightformer form="rect" intensity={0.5} color="#f3e6cc" position={[0, -2, 3]} scale={[6, 1, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={1.1} color="#fffaf0" position={[0, 0.5, 4]} scale={[5, 3, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={0.9} position={[-4, 0, -1]} scale={[2, 4, 1]} target={[0, 0, 0]} />
      </Environment>
    </>
  );
}

const KEEP_ALL = new THREE.Plane(new THREE.Vector3(0, 1, 0), 1e5);
const CLIP_ALL = new THREE.Plane(new THREE.Vector3(0, 1, 0), -1e5);
const _a = new THREE.Vector3();
const _b = new THREE.Vector3();
const _p = new THREE.Vector3();

/** The plane through the camera and a vertical line on screen at `x` (-1..1), keeping what lies left of it. */
function seamPlane(cam: THREE.Camera, x: number, out: THREE.Plane) {
  _a.set(x, -1, 0.5).unproject(cam);
  _b.set(x, 1, 0.5).unproject(cam);
  out.setFromCoplanarPoints(cam.position, _a, _b);
  if (out.distanceToPoint(_p.set(x - 0.5, 0, 0.5).unproject(cam)) < 0) out.negate();
  return out;
}

/** One box on the shared turntable: rest pose, idle sway, pointer lean, drag to turn, click to open. */
function Turntable({
  spec,
  role,
  sweep,
  seam,
  onReady,
  onInteract,
  still,
}: {
  spec: BoxSpec;
  role: Role;
  sweep?: MotionValue<number>;
  seam?: MotionValue<number>;
  onReady?: () => void;
  onInteract?: () => void;
  still?: boolean;
}) {
  const { camera, size, pointer } = useThree();
  const stage = useRef<THREE.Group>(null);
  const turn = useRef<THREE.Group>(null);
  const hinge = useRef<THREE.Group>(null);
  const inside = useRef<THREE.PointLight>(null);
  const plane = useMemo(() => KEEP_ALL.clone(), []);
  const roleRef = useRef(role);
  roleRef.current = role;
  const s = useRef({ t: 0, frames: 0, clipped: false, liveAt: -1, drag: 0, dragging: false, lastX: 0, open: false, angle: 0 });

  // leaving the stage, the box goes back in its box: closed, at rest, ready to peek again next time
  useEffect(() => {
    if (role !== "hidden") return;
    const st = s.current;
    Object.assign(st, { liveAt: -1, drag: 0, open: false, angle: 0 });
    if (turn.current) turn.current.rotation.set(0, spec.rest, 0);
  }, [role, spec.rest]);

  useFrame((_, dt) => {
    const st = s.current;
    dt = Math.min(dt, 0.05);
    st.t += dt;
    const k = (rate: number) => 1 - Math.exp(-dt * rate);
    const r = roleRef.current;

    // every material of this box clips against its own plane
    if (!st.clipped && stage.current) {
      stage.current.traverse((o) => {
        const m = (o as THREE.Mesh).material;
        if (m) for (const mm of Array.isArray(m) ? m : [m]) mm.clippingPlanes = [plane];
      });
      st.clipped = true;
    }
    if (r === "solo") plane.copy(KEEP_ALL);
    else if (r === "hidden") plane.copy(CLIP_ALL);
    else {
      seamPlane(camera, (seam ? seam.get() : 1) * 2 - 1, plane);
      if (r === "out") plane.negate();
    }

    // tell the page once the box has really been drawn (and compiled), so nothing reveals an empty canvas
    st.frames++;
    if (st.frames === 3) onReady?.();

    // hold the exact resting pose until the box has the stage to itself; then come alive gradually
    const sv = sweep ? sweep.get() : 1;
    if (r === "solo" && sv >= 1 && st.liveAt < 0) st.liveAt = st.t;
    const alive = st.liveAt < 0 || still ? 0 : Math.min(1, (st.t - st.liveAt) / 1.6);
    const since = st.liveAt < 0 ? -1 : st.t - st.liveAt;

    // drag offset slowly returns to rest once released
    if (!st.dragging) st.drag += (0 - st.drag) * k(0.9);

    // idle sway, pointer lean
    const sway = Math.sin(st.t * 0.45) * 0.06 * alive;
    const targetY = spec.rest + st.drag + sway + pointer.x * 0.12 * alive;
    const targetX = -pointer.y * 0.035 * alive;
    if (turn.current) {
      turn.current.rotation.y += (targetY - turn.current.rotation.y) * k(6);
      turn.current.rotation.x += (targetX - turn.current.rotation.x) * k(4);
    }

    // one small "peek" just after it comes alive tells people it opens; then click to open/close
    const peek = !still && since > 0.35 && since < 1.35 ? Math.sin(((since - 0.35) / 1.0) * Math.PI) * 0.42 : 0;
    const targetAngle = st.open ? spec.open : peek;
    st.angle += (targetAngle - st.angle) * k(st.open ? 3.2 : 5);
    if (hinge.current) spec.hinge(hinge.current, st.angle);
    const f = Math.min(1, Math.max(0, st.angle / spec.open));
    if (stage.current) {
      stage.current.position.set(0.02, 0.02, 0);
      stage.current.scale.setScalar(1);
      spec.stage(f, stage.current);
    }
    // opening lets light into the box: the lining warms up as it opens
    if (inside.current) inside.current.intensity = 2.6 * f;
  });

  // ---- drag to turn (tracked on the window, so it keeps turning off the box's edge), click to open
  const onDown = (e: ThreeEvent<PointerEvent>) => {
    if (roleRef.current !== "solo") return;
    e.stopPropagation();
    onInteract?.();
    const st = s.current;
    st.dragging = true;
    st.lastX = e.clientX;
    document.body.style.cursor = "grabbing";
    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - st.lastX;
      st.lastX = ev.clientX;
      const [lo, hi] = st.open ? spec.turn.open : spec.turn.closed;
      st.drag = THREE.MathUtils.clamp(st.drag + (dx / size.height) * 4.2, lo, hi);
    };
    const up = () => {
      st.dragging = false;
      document.body.style.cursor = "";
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  };
  const onClick = (e: ThreeEvent<MouseEvent>) => {
    if (roleRef.current !== "solo") return;
    e.stopPropagation(); // one click, however many faces the ray passes through
    onInteract?.();
    if (e.delta > 6) return; // it was a drag
    const st = s.current;
    st.open = !st.open;
    if (st.open) st.drag = THREE.MathUtils.clamp(st.drag, ...spec.turn.open);
  };
  const setCursor = (c: string) => (document.body.style.cursor = c);
  const { Model } = spec;

  return (
    <group ref={stage} position={[0.02, 0.02, 0]}>
      <group
        ref={turn}
        rotation={[0, spec.rest, 0]}
        onPointerDown={onDown}
        onClick={onClick}
        onPointerOver={() => roleRef.current === "solo" && setCursor("grab")}
        onPointerOut={() => roleRef.current === "solo" && !s.current.dragging && setCursor("")}
      >
        <Model hinge={hinge} inside={inside} />
      </group>
      <SoftShadow {...spec.shadow} />
    </group>
  );
}
