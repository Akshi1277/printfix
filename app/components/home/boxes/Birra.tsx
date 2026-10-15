"use client";

import { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { Board, usePaper, type BoxSpec } from "./kit";
import { TEXTURES } from "./assets";

/*
 * Birra, the two-tone pair: a peach and a lime magnetic-flap rigid box, side by side as they were shot.
 * Each is a wrapped cover (base board, back spine, lid and a front flap that drops over the tray) around
 * a tray, black inside, with a black foam insert cut to the attar bottle. The lid art and gold foil logo
 * are straightened from the product photograph. Click to open: both lids lift, the lime a beat later.
 */

const B = 0.016; // cover board
const T = 0.012; // tray wall
const I = 0.012; // how far the tray sits in from the cover's edges
const SCALE = 0.94;
const FLOOR = -0.24; // the pair is low: sit it below centre, so open lids have room above

type Tone = { W: number; D: number; H: number; color: string; lining: string; top: string; at: [number, number, number]; turn: number };
const PEACH: Tone = { W: 0.62, D: 0.8, H: 0.26, color: "#e09e86", lining: "#e8b49f", top: "peach", at: [-0.46, 0, -0.2], turn: 0.08 };
const LIME: Tone = { W: 0.86, D: 0.8, H: 0.24, color: "#d9d64a", lining: "#e0dc70", top: "lime", at: [0.3, 0, 0.14], turn: -0.04 };
const OPEN = 1.9; // ~110°, the lid standing just past upright
const LAG = 0.3; // the lime lid follows the peach

export const birra: BoxSpec = {
  Model: BirraModel,
  rest: 0.14, // the pair turned a little to the camera, as in the photograph
  open: OPEN + LAG,
  // the hinge group carries both lids; the second lags the first
  hinge: (g, a) => {
    // each lid is placed on the table, then pivots on its back spine: turn the pivot
    const [p, l] = g.children.map((c) => c.children[0]);
    if (p) p.rotation.x = -Math.min(OPEN, a);
    if (l) l.rotation.x = -Math.min(OPEN, Math.max(0, a - LAG));
  },
  turn: { closed: [-1.4, 1.4], open: [-0.9, 0.9] },
  // the lids stand up behind: settle lower and a little smaller so they stay in frame
  stage: (f, g) => {
    g.position.y = 0.02 - 0.16 * f;
    g.scale.setScalar(1 - 0.24 * f);
  },
  shadow: { y: FLOOR - 0.002, scale: [2.3, 1.5], rgb: "70,40,30" },
  // the pair is low and wide: it shows the camera its two lids
  cover: { w: 1.4 * SCALE, h: 1.0 * SCALE, z: 0, top: true }, // the lids sit about level with its centre
};

function BirraModel({ hinge }: { hinge: React.RefObject<THREE.Group | null> }) {
  const tex = useTexture(TEXTURES.birra);
  const paperish = usePaper();
  const gl = useThree((st) => st.gl);

  const mats = useMemo(() => {
    const black = new THREE.MeshStandardMaterial({ color: "#1d1b1a", roughness: 0.85, ...paperish });
    const foam = new THREE.MeshStandardMaterial({ color: "#151414", roughness: 1 });
    const url = urlMaterial();
    return [PEACH, LIME].map((tone, i) => {
      const [map, orm, n] = tex.slice(i * 3, i * 3 + 3);
      map.colorSpace = THREE.SRGBColorSpace;
      map.anisotropy = gl.capabilities.getMaxAnisotropy();
      orm.colorSpace = THREE.NoColorSpace;
      n.colorSpace = THREE.NoColorSpace;
      const top = new THREE.MeshStandardMaterial({
        map,
        aoMap: orm, // red channel: the crease where the foil is pressed in
        roughnessMap: orm, // green channel: paper ~1, foil ~0.31
        metalnessMap: orm, // blue channel
        roughness: 1.3,
        metalness: 0.85,
        envMapIntensity: 1.4,
        normalMap: n, // paper tooth, and the logo pressed a hair into the board
        normalScale: new THREE.Vector2(0.9, 0.9),
      });
      const wrap = new THREE.MeshStandardMaterial({ color: tone.color, roughness: 0.88, ...paperish });
      const lining = new THREE.MeshStandardMaterial({ color: tone.lining, roughness: 0.92, ...paperish });
      return { top, wrap, lining, black, foam, url };
    });
  }, [tex, paperish.map, paperish.normalMap, gl]); // eslint-disable-line react-hooks/exhaustive-deps

  // the lids hinge in their own group, so the scene's hinge drives both (see birra.hinge)
  return (
    <group scale={SCALE} position={[-0.08, FLOOR, 0]}>
      <FlapBox tone={PEACH} m={mats[0]} part="base" />
      <FlapBox tone={LIME} m={mats[1]} part="base" />
      <group ref={hinge}>
        <FlapBox tone={PEACH} m={mats[0]} part="lid" />
        <FlapBox tone={LIME} m={mats[1]} part="lid" />
      </group>
    </group>
  );
}

type Mats = { top: THREE.Material; wrap: THREE.Material; lining: THREE.Material; black: THREE.Material; foam: THREE.Material; url: THREE.Material };

const rect = (x0: number, y0: number, x1: number, y1: number): [number, number][] => [
  [x0, y0],
  [x1, y0],
  [x1, y1],
  [x0, y1],
];

/**
 * One box, in its own coordinates (x across, y up from the table, z toward the camera), placed and
 * turned on the table. `part` picks the fixed base or the lid, which is returned as a group pivoting
 * on the top of the back spine, so its rotation.x opens it.
 */
function FlapBox({ tone, m, part }: { tone: Tone; m: Mats; part: "base" | "lid" }) {
  const { W, D, H } = tone;
  const place = (children: React.ReactNode) => (
    <group position={tone.at} rotation-y={tone.turn}>
      {children}
    </group>
  );

  if (part === "lid") {
    // lid board and the flap that drops over the front of the tray, hinged on the back spine
    return (
      <group position={tone.at} rotation-y={tone.turn}>
        <group position={[0, H, -D / 2]}>
          <group position={[0, -H, D / 2]}>
            <mesh position={[-W / 2, H - B, D / 2]} rotation-x={-Math.PI / 2} material={[m.lining, m.top, m.wrap]}>
              <Board pts={rect(0, 0, W, D)} depth={B} uw={W} uh={D} />
            </mesh>
            <mesh position={[-W / 2, 0, D / 2 - B]} material={[m.lining, m.wrap, m.wrap]}>
              <Board pts={rect(0, B + 0.003, W, H - B)} depth={B} uw={W} uh={H} />
            </mesh>
            {/* printed on the lining, reading upright once the lid stands open */}
            <mesh position={[0, H - B - 0.0015, D * 0.08]} rotation-x={Math.PI / 2} material={m.url}>
              <planeGeometry args={[W * 0.7, W * 0.7 * 0.125]} />
            </mesh>
          </group>
        </group>
      </group>
    );
  }

  // the tray, inside the cover
  const x0 = -W / 2 + I;
  const tw = W - 2 * I;
  const zb = -D / 2 + B;
  const zf = D / 2 - B - 0.002;
  const td = zf - zb;
  const y0 = B;
  const th = H - 2 * B - 0.004;
  const wall = [m.black, m.wrap, m.wrap];
  const foamTop = th * 0.7;
  const fw = tw - 2 * T;
  const fd = td - 2 * T;
  return place(
    <>
      {/* cover: base board and back spine */}
      <mesh position={[-W / 2, B, -D / 2]} rotation-x={Math.PI / 2} material={[m.lining, m.wrap, m.wrap]}>
        <Board pts={rect(0, 0, W, D)} depth={B} uw={W} uh={D} />
      </mesh>
      <mesh position={[W / 2, 0, -D / 2 + B]} rotation-y={Math.PI} material={[m.lining, m.wrap, m.wrap]}>
        <Board pts={rect(0, 0, W, H)} depth={B} uw={W} uh={H} />
      </mesh>
      {/* tray walls: front, back, right, left */}
      <mesh position={[x0, y0, zf - T]} material={wall}>
        <Board pts={rect(0, 0, tw, th)} depth={T} uw={tw} uh={th} />
      </mesh>
      <mesh position={[x0 + tw, y0, zb + T]} rotation-y={Math.PI} material={wall}>
        <Board pts={rect(0, 0, tw, th)} depth={T} uw={tw} uh={th} />
      </mesh>
      <mesh position={[x0 + tw - T, y0, zf]} rotation-y={Math.PI / 2} material={wall}>
        <Board pts={rect(T, 0, td - T, th)} depth={T} uw={td} uh={th} />
      </mesh>
      <mesh position={[x0 + T, y0, zb]} rotation-y={-Math.PI / 2} material={wall}>
        <Board pts={rect(T, 0, td - T, th)} depth={T} uw={td} uh={th} />
      </mesh>
      {/* black foam insert, cut to the bottle; the tray floor shows through the cut */}
      <mesh position={[x0 + T, y0 + 0.002, zf - T]} rotation-x={-Math.PI / 2} material={m.black}>
        <Board pts={rect(0, 0, fw, fd)} depth={0.002} uw={fw} uh={fd} />
      </mesh>
      <mesh position={[x0 + T, y0 + foamTop, zb + T]} rotation-x={Math.PI / 2} material={[m.foam, m.foam, m.foam]}>
        <Board pts={rect(0, 0, fw, fd)} holes={[bottleCut(fw / 2, fd / 2)]} depth={foamTop - 0.004} uw={fw} uh={fd} />
      </mesh>
    </>,
  );
}

/** The attar bottle's outline (y runs front to back), cap toward the back: body, shoulder, neck, cap. */
function bottleCut(cx: number, cy: number): [number, number][] {
  const half: [number, number][] = [
    [0.075, -0.17],
    [0.085, -0.15],
    [0.085, 0.06],
    [0.05, 0.1],
    [0.032, 0.11],
    [0.032, 0.14],
    [0.045, 0.145],
    [0.045, 0.23],
  ];
  const right = half.map(([x, y]) => [cx + x, cy - y] as [number, number]);
  const left = half
    .slice()
    .reverse()
    .map(([x, y]) => [cx - x, cy - y] as [number, number]);
  return [...right, ...left];
}

/** "www.birrafragrances.com", printed in deep brown on the lid's lining. */
function urlMaterial() {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 128;
  const g = c.getContext("2d")!;
  g.fillStyle = "#3a2219";
  g.font = '500 64px "Helvetica Neue", Arial, sans-serif';
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("www.birrafragrances.com", 512, 66);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return new THREE.MeshStandardMaterial({ map: t, transparent: true, roughness: 0.9, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1 });
}
