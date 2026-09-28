import Link from "next/link";
import { company, footer, industries, nav, quoteHref, services, whatsappLink } from "../content";

const head = "label mb-5 text-white/45";
const link = "text-[15px] text-white/80 transition-colors hover:text-white";

export default function Footer() {
  return (
    <footer className="bg-charcoal pb-24 pt-20 text-white lg:pb-10">
      <div className="wrap">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 border-b border-white/10 pb-14 lg:grid-cols-12 lg:gap-8">
          <div className="col-span-2 lg:col-span-4">
            <img src={company.logo.white} alt={company.name} width={Math.round(34 * company.logo.ratio)} height={34} className="h-[34px] w-auto" loading="lazy" />
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-white/60">{footer.blurb}</p>
            <p className="label mt-6 text-white/45">{company.tagline}</p>
          </div>

          <nav aria-label="Services" className="lg:col-span-2">
            <p className={head}>Services</p>
            <ul className="space-y-2.5">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/${s.slug}/`} className={link}>{s.title}</Link>
                </li>
              ))}
              <li>
                <Link href="/offset-printing/" className={link}>Offset Printing</Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Company" className="lg:col-span-2">
            <p className={head}>Company</p>
            <ul className="space-y-2.5">
              {nav.slice(1).filter((n) => n.href !== "/offset-printing/").map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className={link}>{n.label}</Link>
                </li>
              ))}
              <li>
                <Link href={quoteHref} className={link}>Get a quote</Link>
              </li>
            </ul>
          </nav>

          <div className="lg:col-span-2">
            <p className={head}>Industries</p>
            <ul className="space-y-2.5">
              {industries.map((i) => (
                <li key={i.n} className="text-[15px] text-white/80">{i.title}</li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-1 lg:col-span-2">
            <p className={head}>Contact</p>
            <ul className="space-y-2.5">
              <li><a href={company.phoneHref} className={link}>{company.phone}</a></li>
              <li><a href={`mailto:${company.email}`} className={`${link} break-all`}>{company.email}</a></li>
              <li><a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={link}>WhatsApp</a></li>
              <li className="pt-2 text-[14px] leading-relaxed text-white/55">{company.hoursShort}<br />{company.region}</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-8 text-[13px] text-white/50 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {company.legalName}. All rights reserved.</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {footer.legal.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-white">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
