import type { Metadata } from "next";
import Link from "next/link";
import { finishes, offset, quoteHref, services } from "../content";
import { offsetProjects } from "../portfolio";
import PageHead from "../components/PageHead";
import ProjectCard from "../components/ProjectCard";
import FinalCta from "../components/FinalCta";
import { Button, Label, Reveal } from "../components/ui";

export const metadata: Metadata = {
  title: "Offset Printing — Cartons, Boxes & Paper Bags",
  description:
    "High-quality offset printing by Printfix for product cartons, corrugated mailers and paper bags — CMYK and Pantone colour, finished with lamination, spot UV and foil. Low MOQ, across India.",
  alternates: { canonical: "/offset-printing/" },
  openGraph: { images: [{ url: offset.image.src, width: 1008, height: 946, alt: offset.image.alt }] },
};

export default function OffsetPage() {
  const work = offsetProjects();
  const usedIn = services.filter((s) => work.some((p) => p.service === s.slug));

  return (
    <>
      <PageHead crumbs={[{ label: "Home", href: "/" }, { label: "Offset Printing" }]} label="Capability" title="Offset printing." lede={offset.lede}>
        <div className="mt-8">
          <Button href={quoteHref}>Get a quote</Button>
        </div>
      </PageHead>

      <section className="wrap grid gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="overflow-hidden bg-stone lg:col-span-8">
          <img src={offset.image.src} alt={offset.image.alt} width={1008} height={946} fetchPriority="high" className="aspect-[4/3] w-full object-cover" />
        </div>
        <p className="display max-w-[14ch] self-end text-[clamp(28px,3vw,48px)] text-ink lg:col-span-4">{offset.title}</p>
      </section>

      <section className="section" aria-labelledby="why-offset">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-4">
            <Label>Why offset</Label>
            <h2 id="why-offset" className="display mt-6 text-[clamp(30px,3.4vw,52px)] text-ink">Print quality you can see on the shelf.</h2>
          </Reveal>
          <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
            {offset.points.map((pt, i) => (
              <Reveal as="li" key={pt.title} delay={i * 0.05} className="border-t border-ink pt-6">
                <h3 className="text-[20px] font-semibold text-ink [font-stretch:108%]">{pt.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{pt.body}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-y border-line bg-white py-20 md:py-28" aria-labelledby="offset-steps">
        <div className="wrap">
          <Label>From file to finished piece</Label>
          <h2 id="offset-steps" className="display mt-6 text-[clamp(30px,3.4vw,52px)] text-ink">How an offset job runs.</h2>
          <ol className="mt-12 grid border-t border-line sm:grid-cols-2 lg:grid-cols-4">
            {offset.steps.map((st, i) => (
              <li key={st.title} className="border-b border-line py-7 sm:pr-6 lg:border-b-0 lg:border-l lg:px-6 lg:first:border-l-0 lg:first:pl-0">
                <span className="num text-[40px] font-bold leading-none text-red">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-6 text-[19px] font-semibold text-ink [font-stretch:108%]">{st.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">{st.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="wrap section" aria-labelledby="offset-work">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Label>Offset-printed work</Label>
            <h2 id="offset-work" className="display mt-6 text-[clamp(30px,3.6vw,56px)] text-ink">{work.length} projects printed offset.</h2>
          </div>
          <p className="max-w-[380px] text-[15px] text-muted">
            Across {usedIn.map((s) => s.title.toLowerCase()).join(", ").replace(/, ([^,]*)$/, " and $1")} — each spec names the print and finish.
          </p>
        </div>
        <ul className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {work.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={(i % 3) * 0.05}>
              <ProjectCard p={p} />
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="border-t border-line py-20" aria-labelledby="after-print">
        <div className="wrap grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Label>After print</Label>
            <h2 id="after-print" className="display mt-6 text-[clamp(28px,3vw,44px)] text-ink">Finishes that go on top.</h2>
          </div>
          <ul className="flex flex-wrap gap-2 lg:col-span-7 lg:self-end">
            {finishes.map((f) => (
              <li key={f.key} className="border border-ink/20 px-4 py-2.5 text-[15px] text-ink">{f.title}</li>
            ))}
          </ul>
        </div>
        <div className="wrap mt-10">
          <Link href="/#products" className="text-[14px] text-muted underline underline-offset-4 hover:text-red">Explore all services →</Link>
        </div>
      </section>

      <FinalCta title={["Start your", "offset print job."]} image={offset.detail} />
    </>
  );
}
