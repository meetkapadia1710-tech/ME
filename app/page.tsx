"use client";

import { useState } from "react";
import Preloader from "@/components/Preloader";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import CoreTools from "@/components/CoreTools";
import SelectedWorks from "@/components/SelectedWorks";
import ReachOut from "@/components/ReachOut";
import Footer from "@/components/Footer";

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <Preloader onComplete={() => setLoaded(true)} />
      <Nav />
      <main>
        <Hero loaded={loaded} />
        <Intro ready={loaded} />
        <CoreTools ready={loaded} />
        <SelectedWorks ready={loaded} />
        <ReachOut ready={loaded} />
      </main>
      <Footer />
    </>
  );
}
