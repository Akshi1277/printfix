"use client";

import { useEffect, useMemo } from "react";
import type { RefObject } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

/** What every hero box tells the shared scene: how it rests, opens, turns and sits on the table. */
export type BoxSpec = {
  Model: (p: { hinge: RefObject<THREE.Group | null>; inside: RefObject<THREE.PointLight | null> }) => React.JSX.Element;
  rest: number; // resting turn, matched to the box's photograph
  open: number; // hinge travel when open
  hinge: (g: THREE.Group, a: number) => void; // how the opening part moves for a given travel
  turn: { closed: [number, number]; open: [number, number] }; // drag limits
  stage: (f: number, g: THREE.Group) => void; // pose the whole box as it opens, 0 closed .. 1 open
  shadow: { y: number; scale: [number, number]; rgb: string };
};

/** The paper the boards are wrapped in: a fine grain and its relief, shared by every box. */
export function usePaper() {
  const [paper, paperN] = useTexture(["/hero/3d/paper.webp", "/hero/3d/paper-n.webp"]);
  useMemo(() => {
    paper.colorSpace = THREE.SRGBColorSpace;
    paperN.colorSpace = THREE.NoColorSpace;
    for (const t of [paper, paperN]) {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(2.5, 2.5);
    }
  }, [paper, paperN]);
  return { map: paper, normalMap: paperN, normalScale: new THREE.Vector2(0.35, 0.35) };
}

/** A box with softly rounded edges; keeps the six face groups so per-face materials still apply. */
export function RBox({ args, radius = 0.008 }: { args: [number, number, number]; radius?: number }) {
  const [x, y, z] = args;
  const geo = useMemo(() => new RoundedBoxGeometry(x, y, z, 2, Math.min(radius, Math.min(x, y, z) / 2 - 0.0005)), [x, y, z, radius]);
  useEffect(() => () => geo.dispose(), [geo]);
  return <primitive object={geo} attach="geometry" />;
}

/**
 * A flat board cut to any outline (and any holes), `depth` thick. Material groups: 0 the inside face (z = 0),
 * 1 the outside face (z = depth), 2 the cut edges. Face UVs are the outline's own coordinates
 * divided by (uw, uh), so boards cut from one face of a box share that face's artwork.
 */
export function Board({ pts, holes = [], depth, uw, uh }: { pts: [number, number][]; holes?: [number, number][][]; depth: number; uw: number; uh: number }) {
  const key = JSON.stringify([pts, holes]);
  const geo = useMemo(() => {
    const shape = new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)));
    for (const h of holes) shape.holes.push(new THREE.Path(h.map(([x, y]) => new THREE.Vector2(x, y))));
    const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false });
    const lids = g.groups[0].count;
    const uv = g.attributes.uv as THREE.BufferAttribute;
    for (let i = 0; i < lids; i++) uv.setXY(i, uv.getX(i) / uw, uv.getY(i) / uh);
    const rest = g.groups[1].count;
    g.clearGroups();
    g.addGroup(0, lids / 2, 0);
    g.addGroup(lids / 2, lids / 2, 1);
    g.addGroup(lids, rest, 2);
    return g;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, depth, uw, uh]);
  useEffect(() => () => geo.dispose(), [geo]);
  return <primitive object={geo} attach="geometry" />;
}

/** A soft contact shadow: one blurred ellipse on the table, cheap and steady. */
export function SoftShadow({ y, scale, rgb }: BoxSpec["shadow"]) {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d")!;
    const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    grd.addColorStop(0, `rgba(${rgb},0.32)`);
    grd.addColorStop(0.45, `rgba(${rgb},0.12)`);
    grd.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = grd;
    g.fillRect(0, 0, 256, 256);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [rgb]);
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, y, 0.02]} scale={[scale[0], scale[1], 1]}>
      <planeGeometry />
      <meshBasicMaterial map={tex} transparent depthWrite={false} />
    </mesh>
  );
}
