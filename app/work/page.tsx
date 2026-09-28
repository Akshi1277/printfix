import type { Metadata } from "next";
import PageHead from "../components/PageHead";
import FinalCta from "../components/FinalCta";
import WorkIndex from "./WorkIndex";
import { projects } from "../portfolio";

export const metadata: Metadata = {
  title: "Our Work — Packaging & Print Portfolio",
  description: `${projects.length} packaging and print projects by Printfix: rigid boxes, corrugated mailers, product cartons, paper bags and printed books.`,
  alternates: { canonical: "/work/" },
};

export default function WorkPage() {
  return (
    <>
      <PageHead
        crumbs={[{ label: "Home", href: "/" }, { label: "Work" }]}
        label="Portfolio"
        title="Our work."
        lede="Rigid boxes, corrugated mailers, product cartons, paper bags and books — with the structure, closure and finish behind each one."
      />
      <WorkIndex />
      <FinalCta />
    </>
  );
}
