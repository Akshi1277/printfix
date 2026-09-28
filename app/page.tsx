import Hero from "./components/home/Hero";
import TrustStrip from "./components/home/TrustStrip";
import Intro from "./components/home/Intro";
import ServiceIndex from "./components/home/ServiceIndex";
import OffsetBand from "./components/home/OffsetBand";
import Featured from "./components/home/Featured";
import SelectedWork from "./components/home/SelectedWork";
import Finishes from "./components/home/Finishes";
import Industries from "./components/home/Industries";
import Why from "./components/home/Why";
import Process from "./components/home/Process";
import Craft from "./components/home/Craft";
import Testimonials from "./components/home/Testimonials";
import Faq from "./components/Faq";
import FinalCta from "./components/FinalCta";

/*
 * The homepage answers a B2B buyer's questions in order:
 * what do you do → what can you make → can you handle my industry → do you have the craft →
 * can I trust you → how do I start.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <Intro />
      <ServiceIndex />
      <OffsetBand />
      <Featured />
      <SelectedWork />
      <Finishes />
      <Industries />
      <Why />
      <Process />
      <Craft />
      <Testimonials />
      <Faq />
      <FinalCta />
    </>
  );
}
