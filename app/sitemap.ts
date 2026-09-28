import type { MetadataRoute } from "next";
import { company, services } from "./content";
import { projects } from "./portfolio";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const u = (path: string, priority: number) => ({ url: `${company.url}${path}`, lastModified: now, priority });
  return [
    u("/", 1),
    u("/work/", 0.9),
    u("/offset-printing/", 0.9),
    ...services.map((s) => u(`/${s.slug}/`, 0.9)),
    u("/about/", 0.7),
    u("/contact/", 0.8),
    ...projects.map((p) => u(`/work/${p.slug}/`, 0.6)),
    u("/terms-conditions/", 0.2),
    u("/refund-return-policy/", 0.2),
    u("/privacy-policy/", 0.2),
  ];
}
