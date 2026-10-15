/*
 * Every texture the hero boxes load, by box. Kept apart from the models (which pull in three.js) so the
 * hero can preload the first box's textures with the page, before the 3D code has even arrived.
 */

export const PAPER = ["/hero/3d/paper.webp", "/hero/3d/paper-n.webp"];

export const TEXTURES: Record<string, string[]> = {
  aethara: [
    "/hero/3d/aethara-face.webp",
    "/hero/3d/aethara-orm.webp",
    "/hero/3d/aethara-n.webp", // stamped-foil relief
    "/hero/3d/inner-shade.webp",
  ],
  velina: [
    "/hero/3d/velina-front.webp",
    "/hero/3d/velina-front-orm.webp",
    "/hero/3d/velina-front-n.webp",
    "/hero/3d/velina-side.webp",
    "/hero/3d/velina-side-orm.webp",
    "/hero/3d/velina-side-n.webp",
  ],
  birra: [
    "/hero/3d/birra-peach.webp",
    "/hero/3d/birra-peach-orm.webp",
    "/hero/3d/birra-peach-n.webp",
    "/hero/3d/birra-lime.webp",
    "/hero/3d/birra-lime-orm.webp",
    "/hero/3d/birra-lime-n.webp",
  ],
};
