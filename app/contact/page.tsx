import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import PageHead from "../components/PageHead";
import Faq from "../components/Faq";
import { Label, WhatsAppIcon } from "../components/ui";
import { company, whatsappLink } from "../content";
import QuoteForm from "./QuoteForm";

export const metadata: Metadata = {
  title: "Get a Quote — Contact Us",
  description: `Request a quote for custom printing and packaging. Call ${company.phone}, WhatsApp or email ${company.email}. ${company.hours}.`,
  alternates: { canonical: "/contact/" },
};

const row = "flex items-start gap-4 border-b border-line py-5";

export default function ContactPage() {
  return (
    <>
      <PageHead
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        label="Get a quote"
        title="Have a project in mind?"
        lede="Packaging is the first impression your brand makes — make it count. Tell us what you need and we'll come back with a quote."
      />

      <section className="wrap grid gap-16 pb-24 lg:grid-cols-12 lg:gap-8">
        <div id="quote" className="lg:col-span-7">
          <Label>Quote request</Label>
          <p className="mb-10 mt-4 max-w-[520px] text-[15px] leading-relaxed text-muted">
            A few details are enough to start. Only name, a way to reach you, and the product are required.
          </p>
          <QuoteForm />
        </div>

        <aside className="lg:col-span-4 lg:col-start-9" aria-labelledby="direct-title">
          <h2 id="direct-title" className="label text-muted">Prefer to talk?</h2>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 flex min-h-14 items-center justify-center gap-3 bg-ink text-[13px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-charcoal"
          >
            <WhatsAppIcon className="h-5 w-5" /> Chat on WhatsApp
          </a>
          <ul className="mt-6 border-t border-line text-[16px]">
            <li className={row}>
              <Phone aria-hidden="true" className="mt-0.5 h-5 w-5 text-red" />
              <a href={company.phoneHref} className="text-ink hover:text-red">{company.phone}</a>
            </li>
            <li className={row}>
              <Mail aria-hidden="true" className="mt-0.5 h-5 w-5 text-red" />
              <a href={`mailto:${company.email}`} className="break-all text-ink hover:text-red">{company.email}</a>
            </li>
            <li className={row}>
              <Clock aria-hidden="true" className="mt-0.5 h-5 w-5 text-red" />
              <span className="text-ink">{company.hours}</span>
            </li>
            <li className={row}>
              <MapPin aria-hidden="true" className="mt-0.5 h-5 w-5 text-red" />
              <span className="text-ink">{company.region}</span>
            </li>
          </ul>
          <figure className="mt-10 border-l-2 border-red pl-5">
            <blockquote className="text-[16px] leading-relaxed text-ink-2">
              &ldquo;Excellent communication via WhatsApp and email. The service standard is second to none.&rdquo;
            </blockquote>
            <figcaption className="mt-3 text-[13px] text-muted">Ibrahim Patel, CEO, Deeniyat</figcaption>
          </figure>
        </aside>
      </section>

      <div className="border-t border-line">
        <Faq />
      </div>
    </>
  );
}
