"use client";

import { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { Board, usePaper, type BoxSpec } from "./kit";
import { TEXTURES } from "./assets";

/*
 * Velina, a green rigid perfume box cut on a slant: the lid takes the top, the upper front and a
 * wedge of each side, and hinges back from the top of the back wall to stand up behind the bottle,
 * the brand printed on the cream lining inside it. Front and side artwork are straightened from
 * the product photograph; matching masks mark the gold, so only the foil behaves as metal.
 */

const W = 1.04; // the front is a touch wider than tall, as in the photograph
const H = 1;
const D = 0.98;
const B = 0.022; // board thickness
const GAP = 0.004; // the hairline where lid meets base
const CUT_F = 0.42; // the slant starts at this height on the front...
const CUT_B = 0.93; // ...and rises to this height at the back, where the lid hinges
const SCALE = 0.8; // a cube carries more volume than Aethara's slim book: sit it in the same space

const GREEN = "#2f5444";
const CREAM = "#efe5cd";
const OPEN = 1.85; // the lid swings ~106° back

export const velina: BoxSpec = {
  Model: VelinaModel,
  rest: -0.44, // matched to the photograph: the right-hand side shows
  open: OPEN,
  hinge: (g, a) => (g.rotation.x = -a),
  turn: { closed: [-1.6, 1.6], open: [-1.0, 0.9] },
  // open, the lid stands up behind: settle lower and a little smaller so it stays in frame
  stage: (f, g) => {
    g.position.y = 0.02 - 0.26 * f;
    g.scale.setScalar(1 - 0.26 * f);
  },
  shadow: { y: (-H / 2) * SCALE - 0.002, scale: [1.5, 1.25], rgb: "24,36,30" },
};

/** Height of the slant on a side wall, `s` along the wall from front (0) to back (D). */
const cut = (s: number) => CUT_F + ((CUT_B - CUT_F) * s) / D;

function VelinaModel({ hinge }: { hinge: React.RefObject<THREE.Group | null> }) {
  const [front, frontOrm, frontN, side, sideOrm, sideN] = useTexture(TEXTURES.velina);
  const paperish = usePaper();
  const gl = useThree((st) => st.gl);

  const mat = useMemo(() => {
    const art = (map: THREE.Texture, orm: THREE.Texture, n: THREE.Texture) => {
      map.colorSpace = THREE.SRGBColorSpace;
      map.anisotropy = gl.capabilities.getMaxAnisotropy();
      orm.colorSpace = THREE.NoColorSpace;
      n.colorSpace = THREE.NoColorSpace;
      return new THREE.MeshStandardMaterial({
        map,
        roughnessMap: orm, // green channel: paper ~0.84, foil ~0.32
        metalnessMap: orm, // blue channel
        roughness: 1.35,
        metalness: 0.8,
        envMapIntensity: 1.5,
        normalMap: n, // the foil is pressed a hair into the board
        normalScale: new THREE.Vector2(0.8, 0.8),
      });
    };
    const green = new THREE.MeshStandardMaterial({ color: GREEN, roughness: 0.82, metalness: 0, ...paperish });
    const cream = new THREE.MeshStandardMaterial({ color: CREAM, roughness: 0.9, metalness: 0, ...paperish });
    const glass = new THREE.MeshPhysicalMaterial({
      color: "#f3f1ea",
      roughness: 0.06,
      metalness: 0,
      transparent: true,
      opacity: 0.42,
      clearcoat: 1,
      envMapIntensity: 2.4,
      flatShading: true, // cut-glass facets
      depthWrite: false,
    });
    const attar = new THREE.MeshStandardMaterial({ color: "#e6cf93", roughness: 0.2, transparent: true, opacity: 0.55, flatShading: true, depthWrite: false });
    const gold = new THREE.MeshStandardMaterial({ color: "#d6ac4c", roughness: 0.24, metalness: 1, envMapIntensity: 1.6 });
    return { front: art(front, frontOrm, frontN), side: art(side, sideOrm, sideN), green, cream, glass, attar, gold, brand: brandMaterial() };
  }, [front, frontOrm, frontN, side, sideOrm, sideN, paperish.map, paperish.normalMap, gl]); // eslint-disable-line react-hooks/exhaustive-deps

  // each board: [inside, outside, cut edges]; the edges are wrapped in the same green paper
  const fm = [mat.cream, mat.front, mat.green];
  const sm = [mat.cream, mat.side, mat.green];
  const plain = [mat.cream, mat.green, mat.green];
  const s0 = B;
  const s1 = D - B;

  // the box's walls in its own coordinates: x across, y up from the table, z toward the camera
  const base = (
    <>
      {/* front, back, then right and left walls, each cut along the slant */}
      <mesh position={[-W / 2, 0, D / 2 - B]} material={fm}>
        <Board pts={rect(0, 0, W, CUT_F)} depth={B} uw={W} uh={H} />
      </mesh>
      <mesh position={[W / 2, 0, -D / 2 + B]} rotation-y={Math.PI} material={sm}>
        <Board pts={rect(0, 0, W, CUT_B)} depth={B} uw={W} uh={H} />
      </mesh>
      <mesh position={[W / 2 - B, 0, D / 2]} rotation-y={Math.PI / 2} material={sm}>
        <Board pts={[[s0, 0], [s1, 0], [s1, cut(s1)], [s0, cut(s0)]]} depth={B} uw={D} uh={H} />
      </mesh>
      <mesh position={[-W / 2 + B, 0, -D / 2]} rotation-y={-Math.PI / 2} material={sm}>
        <Board pts={[[s0, 0], [s1, 0], [s1, cut(D - s1)], [s0, cut(D - s0)]]} depth={B} uw={D} uh={H} />
      </mesh>
      {/* floor */}
      <mesh position={[-W / 2 + B, B, -D / 2 + B]} rotation-x={Math.PI / 2} material={plain}>
        <Board pts={rect(0, 0, W - 2 * B, D - 2 * B)} depth={B} uw={W} uh={D} />
      </mesh>
      {/* the fitted cream insert and the attar bottle standing in it */}
      <mesh position={[0, B + 0.1, 0]} material={mat.cream}>
        <boxGeometry args={[W - 2 * B - 0.004, 0.2, D - 2 * B - 0.004]} />
      </mesh>
      <Bottle glass={mat.glass} attar={mat.attar} gold={mat.gold} y={B + 0.2} />
    </>
  );

  // the lid: everything above the slant
  const g = GAP;
  const lid = (
    <>
      <mesh position={[-W / 2, 0, D / 2 - B]} material={fm}>
        <Board pts={rect(0, CUT_F + g, W, H)} depth={B} uw={W} uh={H} />
      </mesh>
      <mesh position={[W / 2, 0, -D / 2 + B]} rotation-y={Math.PI} material={sm}>
        <Board pts={rect(0, CUT_B + g, W, H)} depth={B} uw={W} uh={H} />
      </mesh>
      <mesh position={[W / 2 - B, 0, D / 2]} rotation-y={Math.PI / 2} material={sm}>
        <Board pts={[[s0, cut(s0) + g], [s1, cut(s1) + g], [s1, H], [s0, H]]} depth={B} uw={D} uh={H} />
      </mesh>
      <mesh position={[-W / 2 + B, 0, -D / 2]} rotation-y={-Math.PI / 2} material={sm}>
        <Board pts={[[s0, cut(D - s0) + g], [s1, cut(D - s1) + g], [s1, H], [s0, H]]} depth={B} uw={D} uh={H} />
      </mesh>
      <mesh position={[-W / 2 + B, H - B, D / 2 - B]} rotation-x={-Math.PI / 2} material={plain}>
        <Board pts={rect(0, 0, W - 2 * B, D - 2 * B)} depth={B} uw={W} uh={D} />
      </mesh>
      {/* the brand on the lining under the lid, reading upright once the lid stands open */}
      <mesh position={[0, H - B - 0.0015, 0.04]} rotation-x={Math.PI / 2} material={mat.brand}>
        <planeGeometry args={[W * 0.62, W * 0.62 * 0.25]} />
      </mesh>
    </>
  );

  return (
    <group scale={SCALE}>
      <group position={[0, -H / 2, 0]}>
        {base}
        {/* the lid hinges on the top edge of the back wall */}
        <group ref={hinge} position={[0, CUT_B, -D / 2]}>
          <group position={[0, -CUT_B, D / 2]}>{lid}</group>
        </group>
      </group>
    </group>
  );
}

const rect = (x0: number, y0: number, x1: number, y1: number): [number, number][] => [
  [x0, y0],
  [x1, y0],
  [x1, y1],
  [x0, y1],
];

/** A faceted attar bottle: cut-glass body, gold collar, tall glass stopper. */
function Bottle({ glass, attar, gold, y }: { glass: THREE.Material; attar: THREE.Material; gold: THREE.Material; y: number }) {
  const body = useMemo(
    () =>
      new THREE.LatheGeometry(
        [
          [0, 0],
          [0.1, 0],
          [0.135, 0.05],
          [0.15, 0.13],
          [0.12, 0.22],
          [0.065, 0.27],
          [0.055, 0.28],
        ].map(([r, h]) => new THREE.Vector2(r, h)),
        8,
      ),
    [],
  );
  const fill = useMemo(() => body.clone().scale(0.86, 0.7, 0.86).translate(0, 0.012, 0), [body]);
  return (
    <group position={[0, y, -0.04]} rotation-y={Math.PI / 8} scale={1.3}>
      <mesh geometry={fill} material={attar} renderOrder={1} />
      <mesh geometry={body} material={glass} renderOrder={2} />
      <mesh position={[0, 0.275, 0]} material={gold}>
        <cylinderGeometry args={[0.07, 0.07, 0.022, 8]} />
      </mesh>
      <mesh position={[0, 0.3, 0]} material={gold}>
        <cylinderGeometry args={[0.058, 0.064, 0.03, 32]} />
      </mesh>
      <mesh position={[0, 0.323, 0]} material={gold}>
        <cylinderGeometry args={[0.066, 0.066, 0.016, 32]} />
      </mesh>
      <mesh position={[0, 0.42, 0]} material={glass} renderOrder={2}>
        <cylinderGeometry args={[0.048, 0.042, 0.18, 8]} />
      </mesh>
    </group>
  );
}

/** "VELINA" in deep green, printed on the cream lining. */
function brandMaterial() {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 256;
  const g = c.getContext("2d")!;
  g.fillStyle = "#1f3a2e";
  g.font = '500 150px "Cormorant Garamond", "Times New Roman", Georgia, serif';
  g.textAlign = "center";
  g.textBaseline = "middle";
  (g as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "18px";
  g.fillText("VELINA", 512, 136);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return new THREE.MeshStandardMaterial({ map: t, transparent: true, roughness: 0.9, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1 });
}
