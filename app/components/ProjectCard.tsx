import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { img, type Project } from "../portfolio";

/**
 * Motion moment 3 — portfolio hover.
 * The photograph scales 1 → 1.04; name, category and arrow sit beneath and sharpen.
 * No overlays, no custom cursor. On touch screens the caption is simply always visible.
 */
export default function ProjectCard({
  p,
  aspect = "aspect-[1008/946]",
  sizes = "sm",
  n = 1,
  priority = false,
}: {
  p: Project;
  aspect?: string;
  sizes?: "sm" | "lg";
  n?: number;
  priority?: boolean;
}) {
  return (
    <Link href={`/work/${p.slug}/`} className="group block">
      <div className={`relative overflow-hidden bg-stone ${aspect}`}>
        <img
          src={img(p.slug, n, sizes === "sm")}
          alt={p.alt}
          width={sizes === "sm" ? 640 : 1008}
          height={sizes === "sm" ? 600 : 946}
          loading={priority ? "eager" : "lazy"}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[17px] font-semibold leading-snug text-ink [font-stretch:108%]">{p.name}</h3>
          <p className="mt-1 text-[13px] text-muted">{p.kind}</p>
        </div>
        <ArrowUpRight
          aria-hidden="true"
          className="mt-0.5 h-5 w-5 shrink-0 text-ink/35 transition-[transform,color] duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-red"
        />
      </div>
    </Link>
  );
}
