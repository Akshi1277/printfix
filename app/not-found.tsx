import { Button } from "./components/ui";

export default function NotFound() {
  return (
    <section className="wrap flex min-h-[70vh] flex-col justify-center pb-20 pt-40">
      <p className="label text-red">404</p>
      <h1 className="display mt-6 text-[clamp(40px,6vw,96px)] text-ink">This page isn&rsquo;t here.</h1>
      <p className="mt-6 max-w-[460px] text-[17px] text-ink-2">It may have moved when the site was redesigned. Try our work or get in touch.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button href="/work/" variant="ink">See our work</Button>
        <Button href="/contact/" variant="outline">Contact</Button>
      </div>
    </section>
  );
}
