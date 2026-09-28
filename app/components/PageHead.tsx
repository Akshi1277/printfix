import Link from "next/link";
import { Label, Reveal } from "./ui";

/** Shared inner-page header: breadcrumb, label, title, lede. */
export default function PageHead({
  crumbs,
  label,
  title,
  lede,
  children,
}: {
  crumbs: { label: string; href?: string }[];
  label: string;
  title: string;
  lede?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="wrap pb-12 pt-32 md:pb-16 md:pt-40">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap gap-2 text-[13px] text-muted">
          {crumbs.map((c, i) => (
            <li key={c.label} className="flex items-center gap-2">
              {c.href ? <Link href={c.href} className="hover:text-red">{c.label}</Link> : <span aria-current="page" className="text-ink">{c.label}</span>}
              {i < crumbs.length - 1 && <span aria-hidden="true">/</span>}
            </li>
          ))}
        </ol>
      </nav>
      <Reveal className="mt-10 grid gap-8 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-8">
          <Label>{label}</Label>
          <h1 className="display mt-6 text-[clamp(40px,6vw,96px)] text-ink">{title}</h1>
        </div>
        {(lede || children) && (
          <div className="lg:col-span-4 lg:self-end">
            {lede && <p className="text-[17px] leading-relaxed text-ink-2">{lede}</p>}
            {children}
          </div>
        )}
      </Reveal>
    </header>
  );
}
