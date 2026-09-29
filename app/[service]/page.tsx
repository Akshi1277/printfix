import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { quoteHref, services, type ServiceSlug } from "../content";
import { forService, isOffset } from "../portfolio";
import PageHead from "../components/PageHead";
import ProjectCard from "../components/ProjectCard";
import FinalCta from "../components/FinalCta";
import Process from "../components/home/Process";
import { Button, Label, Reveal } from "../components/ui";
import Link from "next/link";

/*
 * Service pages keep the old site's URLs (/rigid-box/, /paper-bags/ …) so existing
 * links and search rankings carry over.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ service: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ service: string }> }): Promise<Metadata> {
  const { service } = await params;
  const s = services.find((x) => x.slug === service);
  if (!s) return {};
  return {
    title: s.seoTitle,
    description: `${s.body} ${s.statement}`,
    alternates: { canonical: `/${s.slug}/` },
    openGraph: { images: [{ url: s.image.src, width: 1008, height: 946, alt: s.image.alt }] },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ service: string }> }) {
  const { service } = await params;
  const s = services.find((x) => x.slug === service);
  if (!s) notFound();
  const work = forService(s.slug as ServiceSlug);
  const others = services.filter((x) => x.slug !== s.slug);
  const offsetCount = work.filter(isOffset).length;

  return (
    <>
      <PageHead crumbs={[{ label: "Home", href: "/" }, { label: "Products", href: "/#products" }, { label: s.title }]} label={`Service ${s.n}`} title={s.title} lede={s.body}>
        <div className="mt-8">
          <Button href={quoteHref}>Get a quote</Button>
        </div>
      </PageHead>

      {/* source photos are ~1000px wide, so they're shown at up to 8/12 columns to stay sharp */}
      <section className="wrap grid gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="overflow-hidden bg-stone lg:col-span-8">
          <img src={s.image.src} alt={s.image.alt} width={1008} height={946} fetchPriority="high" className="aspect-[4/3] w-full object-cover" />
        </div>
        <p className="display max-w-[14ch] self-end text-[clamp(28px,3vw,48px)] text-ink lg:col-span-4">{s.statement}</p>
      </section>

      <section className="wrap section" aria-labelledby="creations-title">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Label>Our {s.slug === "books-publishing" ? "print" : "packaging"} creations</Label>
            <h2 id="creations-title" className="display mt-6 text-[clamp(30px,3.6vw,56px)] text-ink">{work.length} {s.title.toLowerCase()} projects.</h2>
          </div>
          <div className="max-w-[380px] text-[15px] text-muted">
            <p>Open any project for its full structure, closure and finish.</p>
            {offsetCount > 0 && (
              <p className="mt-2">
                {offsetCount} of these are{" "}
                <Link href="/offset-printing/" className="text-ink underline underline-offset-4 hover:text-red">offset printed</Link>.
              </p>
            )}
          </div>
        </div>
        <ul className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {work.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={(i % 3) * 0.05}>
              <ProjectCard p={p} />
            </Reveal>
          ))}
        </ul>
      </section>

      <div className="border-t border-line bg-white">
        <Process compact />
      </div>

      <section className="wrap py-20" aria-labelledby="other-title">
        <h2 id="other-title" className="label text-muted">Other services</h2>
        <ul className="mt-6 grid border-t border-line sm:grid-cols-2 lg:grid-cols-4">
          {others.map((o) => (
            <li key={o.slug} className="border-b border-line lg:border-b-0 lg:border-r lg:last:border-r-0">
              <Link href={`/${o.slug}/`} className="group flex items-baseline justify-between gap-4 py-6 lg:px-6 lg:first:pl-0">
                <span className="text-[19px] font-semibold text-ink [font-stretch:108%] group-hover:text-red">{o.title}</span>
                <span className="num text-[12px] text-muted">{o.n}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <FinalCta title={["Start your", `${s.title.toLowerCase().replace(" / publishing", "")} project.`]} image={s.image} />
    </>
  );
}
