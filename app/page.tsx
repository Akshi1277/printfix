import Hero from "./components/home/Hero";
import TrustStrip from "./components/home/TrustStrip";
import Intro from "./components/home/Intro";
import ServiceIndex from "./components/home/ServiceIndex";
import SelectedWork from "./components/home/SelectedWork";
import Featured from "./components/home/Featured";
import Finishes from "./components/home/Finishes";
import Industries from "./components/home/Industries";
import Why from "./components/home/Why";
import ProcessSticky from "./components/home/ProcessSticky";
import Testimonials from "./components/home/Testimonials";
import FinalCta from "./components/FinalCta";

/*
 * Printfix makes physical things people notice, touch, open and keep.
 * Rhythm: calm sections, punctuated by a few interactive ones — hero scene, product switcher,
 * work reel, finish light, industries, process story, close. The FAQ lives on /contact.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <Intro />
      <ServiceIndex />
      <SelectedWork />
      <Featured />
      <Finishes />
      <Industries />
      <Why />
      <ProcessSticky />
      <Testimonials />
      <FinalCta />
    </>
  );
}
