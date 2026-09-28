import { bySlug, projects, selectedWork } from "../../portfolio";
import ProjectCard from "../ProjectCard";
import { Button, Label, Reveal } from "../ui";

/**
 * Selected work — an asymmetric editorial layout, not a uniform grid.
 * Row 1: one large + one tall narrow.  Row 2: three at staggered heights.  Row 3: a wide pair.
 */
export default function SelectedWork() {
  const [a, b, c, d, e, f, g] = selectedWork.map(bySlug);

  return (
    <section id="work" className="section">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <Label>Selected work</Label>
            <h2 className="display mt-6 max-w-[15ch] text-[clamp(34px,4.4vw,68px)] text-ink">Made for brands that care how it feels.</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Button href="/work/" variant="outline">View all {projects.length} projects</Button>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-x-6 gap-y-14 md:grid-cols-12 lg:mt-20">
          <Reveal className="md:col-span-7">
            <ProjectCard p={a} sizes="lg" />
          </Reveal>
          <Reveal delay={0.08} className="md:col-span-4 md:col-start-9 md:mt-32">
            <ProjectCard p={b} aspect="aspect-[4/5]" />
          </Reveal>

          <Reveal className="md:col-span-4">
            <ProjectCard p={c} aspect="aspect-[4/5]" />
          </Reveal>
          <Reveal delay={0.08} className="md:col-span-4 md:mt-24">
            <ProjectCard p={d} />
          </Reveal>
          <Reveal delay={0.16} className="md:col-span-4 md:mt-8">
            <ProjectCard p={e} aspect="aspect-[4/5]" />
          </Reveal>

          <Reveal className="md:col-span-5 md:col-start-2">
            <ProjectCard p={f} />
          </Reveal>
          <Reveal delay={0.08} className="md:col-span-5 md:col-start-8 md:mt-20">
            <ProjectCard p={g} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
