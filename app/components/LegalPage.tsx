import PageHead from "./PageHead";

export type LegalSection = { h: string; items: (string | [string, string])[] };

/** Plain, readable legal page. Items are either a sentence or a [term, explanation] pair. */
export default function LegalPage({ title, intro, sections, updated }: { title: string; intro?: string; sections: LegalSection[]; updated?: string }) {
  return (
    <>
      <PageHead crumbs={[{ label: "Home", href: "/" }, { label: title }]} label="Legal" title={title} lede={intro} />
      <article className="wrap pb-28">
        <div className="max-w-[760px]">
          {updated && <p className="mb-10 text-[14px] text-muted">{updated}</p>}
          {sections.map((s) => (
            <section key={s.h} className="border-t border-line py-8">
              <h2 className="text-[20px] font-semibold text-ink [font-stretch:108%]">{s.h}</h2>
              <ul className="mt-4 space-y-3 text-[16px] leading-relaxed text-ink-2">
                {s.items.map((it, i) =>
                  typeof it === "string" ? (
                    <li key={i}>{it}</li>
                  ) : (
                    <li key={i}>
                      <strong className="font-semibold text-ink">{it[0]}</strong> {it[1]}
                    </li>
                  ),
                )}
              </ul>
            </section>
          ))}
        </div>
      </article>
    </>
  );
}
