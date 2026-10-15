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
 * Moving between boxes, the box on show flies at the viewer: it lifts off the table, turns its face to
 * the camera and crosses the whole hero up close, filling the screen; at that moment the next box takes
 * its place on the table, and the hero is there again as the first one leaves.
 */

const SPECS: Record<string, BoxSpec> = { aethara, velina, birra };

/**
 * The canvas covers the whole hero, so a box can fly across all of it. The camera renders the canvas as a
 * sub-view of a square frame centred on the box's stage, so a box at rest sits exactly in the stage, as if
 * the canvas were only that big. Pointer input comes from the stage element only, so the canvas never
 * blocks the headline or buttons underneath.
 */
export type Frame = { w: number; h: number; sl: number; st: number; sw: number }; // canvas size; the stage's left, top and side within it

/** solo: the box on show. out: flying past. in: taking its place under cover of it. hidden: loaded, waiting. */
type Role = "solo" | "in" | "out" | "hidden";

export default function BoxScene({
  boxes,
  current,
  prev,
  preload,
  onModelReady,
  sweep,
  swap,
  frame,
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
  swap?: MotionValue<number>; // a move between boxes, 0..1
  frame: React.RefObject<Frame>;
  eventSource?: React.RefObject<HTMLElement | null>;
  still?: boolean; // reduced motion: no idle sway, lean or peek; the box moves only when handled
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState<Set<number>>(() => new Set([current]));
  // the light that warms a box's lining as it opens: one for all boxes, driven by the box on show
  const inside = useRef<THREE.PointLight>(null);

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
        dpr={[1, 1.75]}
        camera={{ position: [0, 1.3, 2.9], fov: 30, near: 0.02 }}
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
        <Stage sweep={sweep} swap={swap} inside={inside} frame={frame} />
        {boxes.map((slug, i) =>
          mounted.has(i) ? (
            <Suspense key={slug} fallback={null}>
              <Turntable
                spec={SPECS[slug]}
                role={i === current ? (prev === null ? "solo" : "in") : i === prev ? "out" : "hidden"}
                sweep={sweep}
                swap={swap}
                onReady={() => onModelReady?.(i)}
                onInteract={onInteract}
                still={still}
                inside={inside}
                frame={frame}
              />
            </Suspense>
          ) : null,
        )}
      </Canvas>
    </div>
  );
}

/** Framing, lights and the studio reflections every box shares. */
function Stage({
  sweep,
  swap,
  inside,
  frame,
}: {
  sweep?: MotionValue<number>;
  swap?: MotionValue<number>;
  inside: React.RefObject<THREE.PointLight | null>;
  frame: React.RefObject<Frame>;
}) {
  const camera = useThree((st) => st.camera);
  const size = useThree((st) => st.size);
  const pointer = useThree((st) => st.pointer);
  const light = useRef<THREE.PointLight>(null);
  useEffect(() => camera.lookAt(0, -0.02, 0), [camera]);

  useFrame((_, dt) => {
    // frame the stage square, wherever it sits in the canvas
    const cam = camera as THREE.PerspectiveCamera;
    const { sl, st, sw } = frame.current;
    const v = cam.view;
    if (cam.aspect !== 1 || !v || v.fullWidth !== sw || v.offsetX !== -sl || v.offsetY !== -st || v.width !== size.width || v.height !== size.height) {
      cam.aspect = 1;
      cam.setViewOffset(sw, sw, -sl, -st, size.width, size.height);
      cam.updateProjectionMatrix();
    }

    // raking light: while the light crosses (the reveal, or a move between boxes) it rides the sweep
    // across the foil; otherwise it follows the pointer
    const k = (rate: number) => 1 - Math.exp(-Math.min(dt, 0.05) * rate);
    const sv = sweep ? sweep.get() : 1;
    const fly = swap ? swap.get() : 1;
    const l = light.current;
    if (!l) return;
    if (fly < 1) {
      // a box flying past: the light sits by the camera and slides with it, so the foil flares as it crosses
      l.position.set(1.6 - 3.2 * fly, 1.9, 3.6);
      l.intensity = 2.5 + 3.5 * Math.sin(Math.PI * fly);
    } else if (sv < 1) {
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
      <pointLight ref={inside} position={[0, 0.45, 0.85]} intensity={0} distance={2.4} decay={2} color="#fff3de" />
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

/*
 * The fly-past, over the move's progress p (0..1, eased inside): the box lifts off the table toward the
 * camera on the right of the screen, swings its face to the viewer, crosses up close (filling the screen
 * at COVER), and leaves past the left edge. Key points are rays through the canvas at a distance where
 * the face covers the whole canvas with a margin, so it works at any screen size.
 */
const COVER = 0.58; // eased progress at which the screen is covered and the boxes change places
const KEYS = [0, 0.36, COVER, 1];
const _q = new THREE.Quaternion();
const _qFace = new THREE.Quaternion();
const _qYaw = new THREE.Quaternion();
const _top = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);
const _yAxis = new THREE.Vector3(0, 1, 0);
const _m = new THREE.Matrix4();
const _up = new THREE.Vector3();
const _r = new THREE.Vector3();
const _pts = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
const _curve = new THREE.CatmullRomCurve3(_pts, false, "centripetal");
// eases in from rest but never slows down: it leaves at full speed instead of crawling off the edge
const ease = (x: number) => x * x * (2 - x);
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** A point `d` from the camera along the ray through canvas position (nx, ny), -1..1. */
function rayPoint(cam: THREE.Camera, nx: number, ny: number, d: number, out: THREE.Vector3) {
  return out.set(nx, ny, 0.5).unproject(cam).sub(cam.position).normalize().multiplyScalar(d).add(cam.position);
}

/** One box on the shared turntable: rest pose, idle sway, pointer lean, drag to turn, click to open. */
function Turntable({
  spec,
  role,
  sweep,
  swap,
  onReady,
  onInteract,
  still,
  inside,
  frame,
}: {
  spec: BoxSpec;
  role: Role;
  sweep?: MotionValue<number>;
  swap?: MotionValue<number>;
  onReady?: () => void;
  onInteract?: () => void;
  still?: boolean;
  inside: React.RefObject<THREE.PointLight | null>;
  frame: React.RefObject<Frame>;
}) {
  const { camera, size, pointer, gl, scene } = useThree();
  const stage = useRef<THREE.Group>(null);
  const turn = useRef<THREE.Group>(null);
  const shadow = useRef<THREE.Group>(null);
  const hinge = useRef<THREE.Group>(null);
  const plane = useMemo(() => KEEP_ALL.clone(), []);
  const roleRef = useRef(role);
  roleRef.current = role;
  const s = useRef({ t: 0, frames: 0, clipped: false, compiled: false, liveAt: -1, drag: 0, dragging: false, lastX: 0, open: false, angle: 0 });

  // leaving the stage, the box goes back in its box: closed, at rest, ready to peek again next time
  useEffect(() => {
    if (role !== "hidden") return;
    const st = s.current;
    Object.assign(st, { liveAt: -1, drag: 0, open: false, angle: 0 });
    if (turn.current) turn.current.rotation.set(0, spec.rest, 0);
    if (stage.current) stage.current.quaternion.identity();
    if (shadow.current) shadow.current.visible = true;
  }, [role, spec.rest]);

  useFrame((_, dt) => {
    const st = s.current;
    dt = Math.min(dt, 0.05);
    st.t += dt;
    const k = (rate: number) => 1 - Math.exp(-dt * rate);
    const r = roleRef.current;

    // every material of this box clips against its own plane; then its shaders are compiled in the
    // background (KHR_parallel_shader_compile) before it is ever drawn, so the page never freezes for them
    const g = stage.current;
    if (!st.clipped && g) {
      g.traverse((o) => {
        const m = (o as THREE.Mesh).material;
        if (m) for (const mm of Array.isArray(m) ? m : [m]) mm.clippingPlanes = [plane];
      });
      st.clipped = true;
      g.visible = true; // compile walks visible objects only
      gl.compileAsync(g, camera, scene).then(() => (st.compiled = true));
      g.visible = false;
    }
    if (!st.compiled) return;
    if (g && !g.visible) g.visible = true;
    // the incoming box waits unseen until the flying one covers the screen
    const fly = ease(swap ? swap.get() : 1);
    if (r === "solo" || r === "out") plane.copy(KEEP_ALL);
    else if (r === "in") plane.copy(fly >= COVER ? KEEP_ALL : CLIP_ALL);
    else plane.copy(CLIP_ALL);

    // tell the page once the box has really been drawn, so nothing reveals an empty canvas
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
    if (r === "out" && stage.current && turn.current) flyPast(stage.current, turn.current, fly);
    if (shadow.current) shadow.current.visible = r !== "out";
    // opening lets light into the box: the lining warms up as it opens
    if (r === "solo" && inside.current) inside.current.intensity = 2.6 * f;
  });

  /** Pose the box along the fly-past at eased progress `p`. */
  function flyPast(g: THREE.Group, t: THREE.Group, p: number) {
    const cam = camera as THREE.PerspectiveCamera;
    // how close the face must come to cover the whole canvas (with a margin), from the frame's geometry
    const { w, h, sw } = frame.current;
    const tan = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
    // (the face sits `cover.z` in front of the box's centre, so the centre goes that much further back)
    const d = Math.min(spec.cover.w / 2 / (1.04 * tan * (w / sw)), spec.cover.h / 2 / (1.04 * tan * (h / sw))) + spec.cover.z;
    _pts[0].copy(g.position); // where it rests (spec.stage has just placed it)
    rayPoint(cam, 0.55, 0.06, d * 1.25, _pts[1]); // lifted and close, on the right
    rayPoint(cam, 0, 0, d, _pts[2]); // filling the screen
    rayPoint(cam, -3.4, -0.04, d * 1.3, _pts[3]); // well past the left edge, turned face and all
    // map the eased progress onto the curve so each key point is reached at its moment
    let u = 1;
    for (let i = 1; i < KEYS.length; i++)
      if (p <= KEYS[i]) {
        u = (i - 1 + (p - KEYS[i - 1]) / (KEYS[i] - KEYS[i - 1])) / (KEYS.length - 1);
        break;
      }
    g.position.copy(_curve.getPoint(u, _r));
    // turn the face (or the lid) to the camera itself, not just square to the screen, so the face stays in
    // view even far off to one side; with a little yaw for weight as it crosses
    _up.set(0, 1, 0).applyQuaternion(cam.quaternion);
    _qFace.setFromRotationMatrix(_m.lookAt(cam.position, g.position, _up));
    if (spec.cover.top) _qFace.multiply(_top);
    _qYaw.setFromAxisAngle(_yAxis, 0.35 * Math.sin(Math.PI * p) * (p < COVER ? 1 : -1));
    _q.copy(_qFace).multiply(_qYaw);
    g.quaternion.identity().slerp(_q, smooth(0, KEYS[1] + 0.06, p));
    // and square the box up on its turntable, so the face it shows is the face we mean
    const k = smooth(0, KEYS[1], p);
    t.rotation.y *= 1 - k;
    t.rotation.x *= 1 - k;
  }

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
      st.drag = THREE.MathUtils.clamp(st.drag + (dx / frame.current.sw) * 4.2, lo, hi);
    };
    const up = () => {
      st.dragging = false;
      onInteract?.(); // the hold counts from letting go
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
    <group ref={stage} position={[0.02, 0.02, 0]} visible={false}>
      <group
        ref={turn}
        rotation={[0, spec.rest, 0]}
        onPointerDown={onDown}
        onClick={onClick}
        onPointerOver={() => roleRef.current === "solo" && setCursor("grab")}
        onPointerOut={() => roleRef.current === "solo" && !s.current.dragging && setCursor("")}
      >
        <Model hinge={hinge} />
      </group>
      <group ref={shadow}>
        <SoftShadow {...spec.shadow} />
      </group>
    </group>
  );
}
