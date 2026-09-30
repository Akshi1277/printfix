"use client";

import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Environment, Lightformer, useTexture } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import type { MotionValue } from "framer-motion";

/*
 * Aethara, as a real object. The front cover carries Printfix's own artwork (straightened from the
 * product photograph); a matching mask marks the gold, so only the foil behaves as metal and catches
 * the light. Drag to turn it, click to open the book-style cover. Built from primitives, no model file.
 */

const W = 1.12; // width: the face is ~12% wider than tall, as in the photograph
const H = 1; // height
const T = 0.42; // depth, matched to the product photograph
const B = 0.022; // board thickness

const NAVY = "#30486f";
const CREAM = "#e8d9b8";
const GOLD_EDGE = "#c8a766"; // the gold-papered tray wall that shows along the opening edge
const REST_Y = 0.44; // resting turn, matched to the photograph: the gold opening edge shows on the left
const OPEN = 1.8; // the cover swings ~100° to the right on its spine, uncovering the tray

/**
 * The canvas is wider than the box's square stage (it bleeds left into the gap, a little right), so a
 * turned or opened box is never clipped. The camera renders a sub-view of a frame centred on the stage,
 * so the resting pose sits exactly where the photograph was. Pointer input comes from the stage only,
 * so the bleed never blocks the headline or buttons underneath.
 */
export const BLEED = { left: 0.6, right: 0.08 }; // fractions of the stage width

export default function BoxScene({
  onReady,
  sweep,
  eventSource,
  onInteract,
}: {
  onReady?: () => void;
  onInteract?: () => void;
  sweep?: MotionValue<number>;
  eventSource?: React.RefObject<HTMLElement | null>;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  // stop rendering while the hero is off screen
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

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
        }}
      >
        <Suspense fallback={null}>
          <Scene onReady={onReady} sweep={sweep} onInteract={onInteract} />
        </Suspense>
      </Canvas>
    </div>
  );
}

function Scene({ onReady, sweep, onInteract }: { onReady?: () => void; sweep?: MotionValue<number>; onInteract?: () => void }) {
  const camera = useThree((st) => st.camera);
  useEffect(() => camera.lookAt(0, -0.02, 0), [camera]);
  const [faceMap, orm, faceN, paper, paperN, shade] = useTexture([
    "/hero/3d/aethara-face.webp",
    "/hero/3d/aethara-orm.webp",
    "/hero/3d/aethara-n.webp", // stamped-foil relief
    "/hero/3d/paper.webp",
    "/hero/3d/paper-n.webp",
    "/hero/3d/inner-shade.webp",
  ]);
  const { gl, size } = useThree();

  useMemo(() => {
    faceMap.colorSpace = THREE.SRGBColorSpace;
    faceMap.anisotropy = gl.capabilities.getMaxAnisotropy();
    orm.colorSpace = THREE.NoColorSpace;
    faceN.colorSpace = THREE.NoColorSpace;
    paper.colorSpace = THREE.SRGBColorSpace;
    paperN.colorSpace = THREE.NoColorSpace;
    shade.colorSpace = THREE.SRGBColorSpace;
    for (const t of [paper, paperN]) {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(2.5, 2.5);
    }
  }, [faceMap, orm, faceN, paper, paperN, shade, gl]);


  const mat = useMemo(() => {
    const paperish = { map: paper, normalMap: paperN, normalScale: new THREE.Vector2(0.35, 0.35) };
    const navy = new THREE.MeshStandardMaterial({ color: NAVY, roughness: 0.78, metalness: 0, ...paperish });
    const cream = new THREE.MeshStandardMaterial({ color: CREAM, roughness: 0.92, metalness: 0, ...paperish });
    const face = new THREE.MeshStandardMaterial({
      map: faceMap,
      roughnessMap: orm, // green channel
      metalnessMap: orm, // blue channel
      roughness: 1.4, // foil ~0.42: satin, like the photographed foil, still catching the light
      metalness: 0.6,
      envMapIntensity: 1.5,
      normalMap: faceN, // the foil sits a hair into the board, so its edges catch the light
      normalScale: new THREE.Vector2(0.9, 0.9),
    });
    const edge = new THREE.MeshStandardMaterial({ color: GOLD_EDGE, roughness: 0.45, metalness: 0.55, ...paperish });
    // soft shading into the inside corners, laid over the lining as a decal
    const inner = new THREE.MeshBasicMaterial({ map: shade, transparent: true, depthWrite: false, toneMapped: false });
    return { navy, cream, face, edge, inner };
  }, [faceMap, orm, faceN, paper, paperN, shade]);

  // ---- motion state
  const stage = useRef<THREE.Group>(null);
  const turn = useRef<THREE.Group>(null);
  const hinge = useRef<THREE.Group>(null);
  const light = useRef<THREE.PointLight>(null);
  const inside = useRef<THREE.PointLight>(null);
  const s = useRef({ t: 0, frames: 0, revealedAt: -1, drag: 0, dragging: false, lastX: 0, open: false, angle: 0 });
  const [, force] = useState(0);

  const pointer = useThree((st) => st.pointer);

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

    const st = s.current;
    dt = Math.min(dt, 0.05);
    st.t += dt;
    const k = (rate: number) => 1 - Math.exp(-dt * rate);

    // tell the page once the box has really been drawn, so the reveal never uncovers an empty canvas
    st.frames++;
    if (st.frames === 3) onReady?.();

    // until the light has passed, hold the exact pose of the photograph; then come alive gradually
    const sv = sweep ? sweep.get() : 1;
    if (sv >= 1 && st.revealedAt < 0) st.revealedAt = st.t;
    const alive = st.revealedAt < 0 ? 0 : Math.min(1, (st.t - st.revealedAt) / 1.6);
    const since = st.revealedAt < 0 ? -1 : st.t - st.revealedAt;

    // drag offset slowly returns to rest once released
    if (!st.dragging) st.drag += (0 - st.drag) * k(0.9);

    // idle sway, pointer lean
    const sway = Math.sin(st.t * 0.45) * 0.06 * alive;
    const targetY = REST_Y + st.drag + sway + pointer.x * 0.12 * alive;
    const targetX = -pointer.y * 0.035 * alive;
    if (turn.current) {
      turn.current.rotation.y += (targetY - turn.current.rotation.y) * k(6);
      turn.current.rotation.x += (targetX - turn.current.rotation.x) * k(4);
    }

    // cover: one small "peek" just after the reveal tells people it opens, then click to open/close
    const peek = since > 0.35 && since < 1.35 ? Math.sin(((since - 0.35) / 1.0) * Math.PI) * 0.42 : 0;
    const targetAngle = st.open ? OPEN : peek;
    st.angle += (targetAngle - st.angle) * k(st.open ? 3.2 : 5);
    if (hinge.current) hinge.current.rotation.y = st.angle;
    // slide right as it opens, so the open cover has room on the left
    if (stage.current) {
      const f = Math.min(1, Math.max(0, st.angle / OPEN));
      stage.current.position.x = 0.02 - 0.24 * f;
      stage.current.scale.setScalar(1 - 0.3 * f);
    }
    // opening the cover lets light into the box: the lining warms up as it opens
    if (inside.current) inside.current.intensity = 2.6 * Math.min(1, Math.max(0, st.angle / OPEN));

    // raking light: during the reveal it rides the sweep across the foil, afterwards it follows the pointer
    if (light.current) {
      if (sv < 1) {
        light.current.position.x = -1.8 + 3.6 * sv;
        light.current.position.y = 0.55;
        light.current.intensity = 7 + 16 * Math.sin(Math.PI * sv);
      } else {
        light.current.position.x += (pointer.x * 2.4 - light.current.position.x) * k(5);
        light.current.position.y += (pointer.y * 1.6 + 0.4 - light.current.position.y) * k(5);
        light.current.intensity += (7 - light.current.intensity) * k(3);
      }
    }
  });

  // ---- drag to turn (tracked on the window, so it keeps turning off the box's edge), click to open
  const onDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onInteract?.();
    const st = s.current;
    st.dragging = true;
    st.lastX = e.clientX;
    document.body.style.cursor = "grabbing";
    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - st.lastX;
      st.lastX = ev.clientX;
      // open, the cover swings toward the camera, so it turns less far and never crosses the caption
      const [lo, hi] = st.open ? [-0.3, 0.55] : [-1.9, 1.3];
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
    e.stopPropagation(); // one click, however many faces the ray passes through
    onInteract?.();
    if (e.delta > 6) return; // it was a drag
    s.current.open = !s.current.open;
    if (s.current.open) s.current.drag = THREE.MathUtils.clamp(s.current.drag, -0.3, 0.55);
    force((n) => n + 1);
  };
  const setCursor = (c: string) => (document.body.style.cursor = c);

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

      <group ref={stage} position={[0.02, 0.02, 0]}>
        <group
          ref={turn}
          rotation={[0, REST_Y, 0]}
          onPointerDown={onDown}
          onClick={onClick}
          onPointerOver={() => setCursor("grab")}
          onPointerOut={() => !s.current.dragging && setCursor("")}
        >
          <Tray navy={mat.navy} cream={mat.cream} edge={mat.edge} inner={mat.inner} />
          <pointLight ref={inside} position={[-0.05, 0.1, 0.55]} intensity={0} distance={2.2} decay={2} color="#fff3de" />

          {/* front cover, hinged on the right-hand spine like a book */}
          <group ref={hinge} position={[W / 2, 0, T / 2 - B]}>
            <group position={[-W / 2, 0, 0]}>
              <mesh position={[0, 0, B / 2]} material={[mat.navy, mat.navy, mat.navy, mat.navy, mat.face, mat.cream]}>
                <RBox args={[W, H, B]} />
              </mesh>
              {/* inside of the cover: corner shading and the hidden magnetic catch near its free edge */}
              <mesh position={[0, 0, -0.0015]} rotation-y={Math.PI} material={mat.inner}>
                <planeGeometry args={[W - 0.01, H - 0.01]} />
              </mesh>
              <mesh position={[-W / 2 + 0.07, 0, -0.003]} rotation-x={Math.PI / 2} scale={[0.75, 1, 1.35]} material={mat.edge}>
                <cylinderGeometry args={[0.024, 0.024, 0.004, 32]} />
              </mesh>
              {/* ribbon pull tab at the foot of the cover */}
              <mesh position={[W * 0.08, -H / 2 + 0.018, B + 0.004]} material={mat.navy}>
                <RBox args={[0.075, 0.05, 0.008]} radius={0.003} />
              </mesh>
            </group>
          </group>
        </group>

        <SoftShadow />
      </group>
    </>
  );
}

/**
 * Book-style construction, as in the photograph: a navy base (back board, right-hand spine, full-depth
 * top and bottom walls, and a rim at the back of the opening side), a flat navy cover, and the tray's
 * gold-papered fore-edge showing along the opening side like the gilded edge of a book.
 * Every board has softly rounded wrapped edges.
 */
const I = 0.032; // how far the gold fore-edge sits in from the boards
const RIM = 0.55; // share of the opening side covered by the navy rim, from the back

// face order for box materials: +x, -x, +y, -y, +z, -z
function Tray({ navy, cream, edge, inner: shadeMat }: { navy: THREE.Material; cream: THREE.Material; edge: THREE.Material; inner: THREE.Material }) {
  const inner = T - B; // from the back of the box to the back of the cover
  const zc = -B / 2; // centre of that span
  const rim = inner * RIM;
  return (
    <group>
      {/* back board */}
      <mesh position={[0, 0, -T / 2 + B / 2]} material={[navy, navy, navy, navy, cream, navy]}>
        <RBox args={[W, H, B]} />
      </mesh>
      {/* right-hand spine, full depth: the cover hinges on it */}
      <mesh position={[W / 2 - B / 2, 0, 0]} material={[navy, cream, navy, navy, navy, navy]}>
        <RBox args={[B, H, T]} />
      </mesh>
      {/* top and bottom walls, navy outside, cream inside */}
      <mesh position={[-B / 2, H / 2 - B / 2, zc]} material={[navy, navy, navy, cream, navy, navy]}>
        <RBox args={[W - B, B, inner]} />
      </mesh>
      <mesh position={[-B / 2, -H / 2 + B / 2, zc]} material={[navy, navy, cream, navy, navy, navy]}>
        <RBox args={[W - B, B, inner]} />
      </mesh>
      {/* navy rim at the back of the opening side */}
      <mesh position={[-W / 2 + B / 2, 0, -T / 2 + rim / 2]} material={[cream, navy, navy, navy, navy, navy]}>
        <RBox args={[B, H - 2 * B, rim]} />
      </mesh>
      {/* soft shading into the inside corners of the back lining */}
      <mesh position={[(I + B) / 2 - B / 2, 0, -T / 2 + B + 0.0015]} material={shadeMat}>
        <planeGeometry args={[W - I - 2 * B, H - 2 * B]} />
      </mesh>
      {/* the catch's partner, set into the front of the fore-edge */}
      <mesh position={[-W / 2 + I + B / 2, 0, zc + (inner - 0.006) / 2 + 0.001]} rotation-x={Math.PI / 2} scale={[0.45, 1, 1.2]} material={edge}>
        <cylinderGeometry args={[0.02, 0.02, 0.003, 24]} />
      </mesh>
      {/* the gold fore-edge, set in a little, cream on the inside */}
      <mesh position={[-W / 2 + I + B / 2, 0, zc]} material={[cream, edge, edge, edge, edge, edge]}>
        <RBox args={[B, H - 2 * B - 0.004, inner - 0.006]} />
      </mesh>
    </group>
  );
}

/** A box with softly rounded edges; keeps the six face groups so per-face materials still apply. */
function RBox({ args, radius = 0.008 }: { args: [number, number, number]; radius?: number }) {
  const [x, y, z] = args;
  const geo = useMemo(() => new RoundedBoxGeometry(x, y, z, 2, Math.min(radius, Math.min(x, y, z) / 2 - 0.0005)), [x, y, z, radius]);
  useEffect(() => () => geo.dispose(), [geo]);
  return <primitive object={geo} attach="geometry" />;
}

/** A soft contact shadow: one blurred ellipse on the table, cheap and steady. */
function SoftShadow() {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d")!;
    const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    grd.addColorStop(0, "rgba(42,33,24,0.32)");
    grd.addColorStop(0.45, "rgba(42,33,24,0.12)");
    grd.addColorStop(1, "rgba(42,33,24,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 256, 256);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, -H / 2 - 0.002, 0.02]} scale={[1.6, 0.95, 1]}>
      <planeGeometry />
      <meshBasicMaterial map={tex} transparent depthWrite={false} />
    </mesh>
  );
}

