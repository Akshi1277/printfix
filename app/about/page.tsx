import type { Metadata } from "next";
import PageHead from "../components/PageHead";
import Process from "../components/home/Process";
import FinalCta from "../components/FinalCta";
import { Label, Reveal } from "../components/ui";
import { company } from "../content";

export const metadata: Metadata = {
  title: "About Us: Premium Printing & Packaging",
  description: company.description,
  alternates: { canonical: "/about/" },
};

// Copy from printfix.co.in/about — tightened, not rewritten.
const blocks = [
  {
    label: "Printing quality",
    title: "Sharp colour. Clear text. Prints that last.",
    body: "Quality is our priority. We use advanced printing technology, premium inks and high-quality paper to ensure sharp colours, clear text and long-lasting prints. From business stationery to marketing materials and books, every product goes through strict quality checks for consistency and professional standards.",
    image: { src: "/work/technical-brochure-1.webp", alt: "Stack of printed technical brochures with bold numeral covers" },
  },
  {
    label: "Packaging quality",
    title: "Packaging is the first impression.",
    body: "We focus on durable materials, precise finishing and attractive designs that protect products while improving their shelf appeal: boxes, labels and branding materials tailored to each client's requirements.",
    image: { src: "/work/af-abaya-2.webp", alt: "Burgundy A&F Abaya rigid box open to show a cream interior" },
  },
];

const mv = [
  {
    label: "Management",
    body: "Printfix is managed by experienced professionals who understand the printing and packaging industry. The focus: quality control, timely delivery, customer satisfaction and long-term business relationships, with clear communication, proper planning and continuous improvement.",
  },
  {
    label: "Mission",
    body: "To deliver high-quality, premium printing and packaging that elevates brand value and customer experience, precise, well finished and on time, and to build long-term partnerships by doing it consistently.",
  },
  {
    label: "Vision",
    body: "To become a trusted leader in premium printing and packaging, evolving with new technology and creative solutions, and to give brands packaging that stands out and creates lasting impressions.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHead
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        label="About Printfix"
        title="Premium print. Luxury packaging."
        lede="Printfix is a printing and packaging company for businesses that value quality, presentation and brand image."
      />

      <section className="wrap">
        <img
          src="/work/ruixuecui-1.webp"
          alt="Two cream Ruixuecui rigid boxes with blind-embossed lettering on a warm gold backdrop"
          width={1008}
          height={946}
          fetchPriority="high"
          className="aspect-[4/3] w-full bg-stone object-cover lg:w-2/3"
        />
      </section>

      <section className="section">
        <div className="wrap grid gap-24">
          {blocks.map((b, i) => (
            <div key={b.label} className="grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
              <Reveal className={`lg:col-span-6 ${i % 2 ? "lg:order-2 lg:col-start-7" : ""}`}>
                <img src={b.image.src} alt={b.image.alt} width={1008} height={946} loading="lazy" className="aspect-[1008/946] w-full bg-stone object-cover" />
              </Reveal>
              <Reveal delay={0.1} className={`lg:col-span-5 ${i % 2 ? "lg:order-1" : "lg:col-start-8"}`}>
                <Label>{b.label}</Label>
                <h2 className="display mt-6 text-[clamp(30px,3.4vw,52px)] text-ink">{b.title}</h2>
                <p className="mt-6 text-[17px] leading-relaxed text-ink-2">{b.body}</p>
              </Reveal>
            </div>
          ))}
        </div>
      </section>

      <div className="border-y border-line bg-white">
        <Process compact />
      </div>

      <section className="section" aria-label="Management, mission and vision">
        <div className="wrap grid gap-10 md:grid-cols-3 md:gap-8">
          {mv.map((m, i) => (
            <Reveal key={m.label} delay={i * 0.06} className="border-t border-ink pt-6">
              <h2 className="label text-red">{m.label}</h2>
              <p className="mt-5 text-[16px] leading-relaxed text-ink-2">{m.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <FinalCta />
    </>
  );
}
