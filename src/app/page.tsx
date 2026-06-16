import { Metadata } from "next";
import Navbar from "@/src/components/Navbar";
import Hero from "@/src/components/Hero";
import TrustBanner from "@/src/components/TrustBanner";
import Services from "@/src/components/Services";
import Projects from "@/src/components/Projects";
import Footer from "@/src/components/Footer";

export const metadata: Metadata = {
  title: "Edo Bid | Unified Gateway to Nigeria's 36 States",
  description: "Partnering businesses with government projects to drive growth, development, and transparency. Access state intelligence, AI support, and verified directories.",
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <TrustBanner />
        <Services />
        <Projects />
      </main>
      <Footer />
    </div>
  );
}
