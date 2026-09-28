"use client";

import { useState } from "react";
import { company, services, whatsappLink } from "../content";
import { WhatsAppIcon } from "../components/ui";

/*
 * The site is a static export with no backend, so the form doesn't POST anywhere.
 * It validates, then turns the answers into a ready-to-send message:
 * WhatsApp (primary — Printfix clients already use it) or email.
 * Artwork files are sent in that WhatsApp / email thread.
 */
type Fields = { name: string; company: string; phone: string; email: string; product: string; quantity: string; size: string; deadline: string; message: string };
const empty: Fields = { name: "", company: "", phone: "", email: "", product: "", quantity: "", size: "", deadline: "", message: "" };

const field =
  "mt-2 block w-full border-0 border-b border-ink/25 bg-transparent px-0 py-3 text-[16px] text-ink placeholder:text-muted/70 focus:border-red focus:outline-none focus:ring-0";
const lab = "text-[13px] font-semibold uppercase tracking-[0.1em] text-ink-2";

export default function QuoteForm() {
  const [f, setF] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [ready, setReady] = useState<null | { text: string }>(null);

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setF((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const validate = () => {
    const e: typeof errors = {};
    if (!f.name.trim()) e.name = "Please enter your name.";
    if (!f.phone.trim() && !f.email.trim()) e.phone = "Add a phone number or an email so we can reply.";
    if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "That email doesn't look right.";
    if (!f.product) e.product = "Choose what you need.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const compose = () =>
    [
      "Hello Printfix, I'd like a quote.\n",
      `Name: ${f.name}`,
      f.company && `Company: ${f.company}`,
      f.phone && `Phone: ${f.phone}`,
      f.email && `Email: ${f.email}`,
      `Product: ${f.product}`,
      f.quantity && `Quantity: ${f.quantity}`,
      f.size && `Size / dimensions: ${f.size}`,
      f.deadline && `Needed by: ${f.deadline}`,
      f.message && `\nDetails: ${f.message}`,
    ]
      .filter(Boolean)
      .join("\n");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      const first = document.querySelector<HTMLElement>("[aria-invalid='true']");
      first?.focus();
      return;
    }
    setReady({ text: compose() });
  };

  const err = (k: keyof Fields) =>
    errors[k] ? (
      <p id={`${k}-err`} className="mt-2 text-[13px] text-red">{errors[k]}</p>
    ) : null;
  const a = (k: keyof Fields) => ({ id: k, name: k, value: f[k], onChange: set(k), "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `${k}-err` : undefined });

  if (ready) {
    const subject = `Quote request — ${f.product}${f.company ? ` — ${f.company}` : ""}`;
    return (
      <div className="border border-line bg-white p-8 md:p-10" role="status">
        <p className="label text-red">Almost done</p>
        <h3 className="display mt-4 text-[clamp(26px,2.6vw,38px)] text-ink">Send your request.</h3>
        <p className="mt-4 max-w-[520px] text-[16px] leading-relaxed text-ink-2">
          Your details are ready as a message. Send it on WhatsApp or by email — you can attach artwork, references or dielines in the same thread.
        </p>
        <pre className="mt-6 max-h-60 overflow-auto whitespace-pre-wrap bg-paper p-5 font-sans text-[14px] leading-relaxed text-ink-2">{ready.text}</pre>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={whatsappLink(ready.text)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center gap-3 bg-red px-6 text-[13px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-red-deep"
          >
            <WhatsAppIcon /> Send on WhatsApp
          </a>
          <a
            href={`mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(ready.text)}`}
            className="inline-flex min-h-12 items-center border border-ink/25 px-6 text-[13px] font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ink hover:text-white"
          >
            Send by email
          </a>
          <button type="button" onClick={() => setReady(null)} className="min-h-12 px-2 text-[14px] text-muted underline underline-offset-4 hover:text-ink">
            Edit details
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
      <div>
        <label htmlFor="name" className={lab}>Name *</label>
        <input {...a("name")} autoComplete="name" className={field} placeholder="Your name" />
        {err("name")}
      </div>
      <div>
        <label htmlFor="company" className={lab}>Company</label>
        <input {...a("company")} autoComplete="organization" className={field} placeholder="Brand or company" />
      </div>
      <div>
        <label htmlFor="phone" className={lab}>Phone / WhatsApp</label>
        <input {...a("phone")} type="tel" autoComplete="tel" inputMode="tel" className={field} placeholder="+91" />
        {err("phone")}
      </div>
      <div>
        <label htmlFor="email" className={lab}>Email</label>
        <input {...a("email")} type="email" autoComplete="email" className={field} placeholder="you@company.com" />
        {err("email")}
      </div>
      <div>
        <label htmlFor="product" className={lab}>What do you need? *</label>
        <select {...a("product")} className={`${field} appearance-none`}>
          <option value="">Choose…</option>
          {services.map((s) => (
            <option key={s.slug} value={s.title}>{s.title}</option>
          ))}
          <option value="Other / not sure">Other / not sure</option>
        </select>
        {err("product")}
      </div>
      <div>
        <label htmlFor="quantity" className={lab}>Quantity</label>
        <input {...a("quantity")} inputMode="numeric" className={field} placeholder="e.g. 500" />
      </div>
      <div>
        <label htmlFor="size" className={lab}>Size / dimensions</label>
        <input {...a("size")} className={field} placeholder="L × W × H, or A4 / A5" />
      </div>
      <div>
        <label htmlFor="deadline" className={lab}>Needed by</label>
        <input {...a("deadline")} className={field} placeholder="Date or week" />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="message" className={lab}>Project details</label>
        <textarea {...a("message")} rows={4} className={`${field} resize-y`} placeholder="Product, stock, finishes (foil, emboss, spot UV…), references" />
      </div>
      <div className="flex flex-wrap items-center gap-5 sm:col-span-2">
        <button type="submit" className="inline-flex min-h-12 items-center bg-red px-8 text-[13px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-red-deep">
          Prepare my quote request
        </button>
        <p className="text-[13px] text-muted">* Required · Office hours {company.hoursShort}</p>
      </div>
    </form>
  );
}
