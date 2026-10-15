"use client";

import { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { RBox, usePaper, type BoxSpec } from "./kit";
import { TEXTURES } from "./assets";

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
const OPEN = 1.8; // the cover swings ~100° to the right on its spine, uncovering the tray

export const aethara: BoxSpec = {
  Model: AetharaModel,
  rest: 0.44, // matched to the photograph: the gold opening edge shows on the left
  open: OPEN,
  hinge: (g, a) => (g.rotation.y = a),
  // open, the cover swings toward the camera, so it turns less far and never crosses the caption
  turn: { closed: [-1.9, 1.3], open: [-0.3, 0.55] },
  // slide right as it opens, so the open cover has room on the left
  stage: (f, g) => {
    g.position.x = 0.02 - 0.24 * f;
    g.scale.setScalar(1 - 0.3 * f);
  },
  shadow: { y: -H / 2 - 0.002, scale: [1.6, 0.95], rgb: "42,33,24" },
  cover: { w: W, h: H, z: T / 2 },
};

function AetharaModel({ hinge }: { hinge: React.RefObject<THREE.Group | null> }) {
  const [faceMap, orm, faceN, shade] = useTexture(TEXTURES.aethara);
  const paperish = usePaper();
  const gl = useThree((st) => st.gl);

  const mat = useMemo(() => {
    faceMap.colorSpace = THREE.SRGBColorSpace;
    faceMap.anisotropy = gl.capabilities.getMaxAnisotropy();
    orm.colorSpace = THREE.NoColorSpace;
    faceN.colorSpace = THREE.NoColorSpace;
    shade.colorSpace = THREE.SRGBColorSpace;
    const navy = new THREE.MeshStandardMaterial({ color: NAVY, roughness: 0.78, metalness: 0, ...paperish });
    const cream = new THREE.MeshStandardMaterial({ color: CREAM, roughness: 0.92, metalness: 0, ...paperish });
    const face = new THREE.MeshStandardMaterial({
      map: faceMap,
      aoMap: orm, // red channel: the crease where the foil is pressed in
      roughnessMap: orm, // green channel
      metalnessMap: orm, // blue channel
      roughness: 1.4, // foil ~0.42: satin, like the photographed foil, still catching the light
      metalness: 0.6,
      envMapIntensity: 1.5,
      normalMap: faceN, // paper tooth, the engraving, and the foil a hair into the board so its edges catch the light
      normalScale: new THREE.Vector2(0.9, 0.9),
    });
    const edge = new THREE.MeshStandardMaterial({ color: GOLD_EDGE, roughness: 0.45, metalness: 0.55, ...paperish });
    // soft shading into the inside corners, laid over the lining as a decal
    const inner = new THREE.MeshBasicMaterial({ map: shade, transparent: true, depthWrite: false, toneMapped: false });
    return { navy, cream, face, edge, inner };
  }, [faceMap, orm, faceN, shade, paperish.map, paperish.normalMap, gl]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Tray navy={mat.navy} cream={mat.cream} edge={mat.edge} inner={mat.inner} />

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
