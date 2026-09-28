import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { services, quoteHref, whatsappLink } from "../../content";
import { img, projects } from "../../portfolio";
import PageHead from "../../components/PageHead";
import ProjectCard from "../../components/ProjectCard";
import FinalCta from "../../components/FinalCta";
import { Button, Reveal, WhatsAppIcon } from "../../components/ui";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) return {};
  const svc = services.find((s) => s.slug === p.service)!;
  return {
    title: `${p.name} — ${svc.title}`,
    description: `${p.name}: ${p.kind.toLowerCase()} by Printfix. ${p.specs.map((s) => `${s.label}: ${s.value}`).join(". ")}.`,
    alternates: { canonical: `/work/${p.slug}/` },
    openGraph: { images: [{ url: img(p.slug, 1), width: 1008, height: 946, alt: p.alt }] },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) notFound();
  const svc = services.find((s) => s.slug === p.service)!;
  const related = projects.filter((x) => x.service === p.service && x.slug !== p.slug).slice(0, 3);
  const others = Array.from({ length: p.images - 1 }, (_, i) => i + 2);

  return (
    <>
      <PageHead
        crumbs={[{ label: "Home", href: "/" }, { label: "Work", href: "/work/" }, { label: svc.title, href: `/${svc.slug}/` }, { label: p.name }]}
        label={p.kind}
        title={p.name}
      >
        {p.client && <p className="label text-red">Client · {p.client}</p>}
      </PageHead>

      <section className="wrap grid gap-10 pb-24 lg:grid-cols-12 lg:gap-8">
        <div className="grid gap-4 lg:col-span-8">
          <img src={img(p.slug, 1)} alt={p.alt} width={1008} height={946} className="aspect-[1008/946] w-full bg-stone object-cover" />
          <div className="grid gap-4 sm:grid-cols-2">
            {others.map((n) => (
              <img
                key={n}
                src={img(p.slug, n)}
                alt={`${p.name} — view ${n}`}
                width={1008}
                height={946}
                loading="lazy"
                className={`aspect-[1008/946] w-full bg-stone object-cover ${others.length % 2 === 1 && n === others[others.length - 1] ? "sm:col-span-2" : ""}`}
              />
            ))}
          </div>
        </div>

        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <h2 className="label text-muted">Specification</h2>
            <dl className="mt-5 border-t border-line">
              {p.specs.map((s) => (
                <div key={s.label} className="grid grid-cols-[7rem_1fr] gap-4 border-b border-line py-4 text-[15px]">
                  <dt className="text-muted">{s.label}</dt>
                  <dd className="text-ink">{s.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-8 text-[15px] leading-relaxed text-ink-2">
              Want something similar? Share your product, size and quantity and we&rsquo;ll quote for your version.
            </p>
            <div className="mt-6 grid gap-3">
              <Button href={quoteHref}>Get a quote</Button>
              <a
                href={whatsappLink(`Hello Printfix, I'd like a quote for something similar to "${p.name}" (${p.kind}).`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-3 border border-ink/25 text-[13px] font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ink hover:text-white"
              >
                <WhatsAppIcon /> Ask on WhatsApp
              </a>
            </div>
            <Link href={`/${svc.slug}/`} className="mt-8 inline-block text-[14px] text-muted underline underline-offset-4 hover:text-red">
              More about {svc.title.toLowerCase()} →
            </Link>
          </div>
        </aside>
      </section>

      {related.length > 0 && (
        <section className="border-t border-line bg-white py-20" aria-labelledby="related-title">
          <div className="wrap">
            <h2 id="related-title" className="display text-[clamp(28px,3vw,44px)] text-ink">More {svc.title.toLowerCase()} work</h2>
            <ul className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <Reveal as="li" key={r.slug}>
                  <ProjectCard p={r} />
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}
      <FinalCta />
    </>
  );
}
