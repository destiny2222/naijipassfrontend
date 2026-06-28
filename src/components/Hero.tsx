import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section
      className="relative flex min-h-screen flex-col items-center justify-start overflow-hidden pt-28 pb-20"
      style={{
        backgroundImage: "url('/city-image.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Heavy White/Glass Overlay to maintain the clean light theme visibility */}
      <div className="absolute inset-0 bg-white/85 backdrop-blur-[4px]" />

      {/* Background Grid Pattern on top of the overlay for texture */}
      <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />

      {/* Blue Glow effect behind the text */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#0088FF]/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 z-10 flex flex-col items-center text-center">

        {/* Top Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#0088FF]/20 bg-white/60 backdrop-blur-md px-4 py-2 text-sm font-semibold text-[#0088FF] shadow-sm transition-all hover:bg-white/80 cursor-pointer">
          Introducing Naijapass Portal
          <ArrowRight className="w-4 h-4" />
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl font-extrabold tracking-tight text-[#101D2D] sm:text-6xl md:text-7xl leading-[1.15] max-w-4xl">
          Unified Gateway to <br />
          <span className="text-[#0088FF]">Nigeria's 36 States</span>
        </h1>

        {/* Subheading */}
        <p className="mt-8 text-xl leading-8 text-zinc-600 max-w-2xl font-medium">
          Partnering businesses with government projects to drive growth and development.
          Access verified intelligence, secure directories, and streamline your procurement journey.
        </p>

        {/* Centered CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="#opportunities"
            className="inline-flex h-14 items-center justify-center rounded-full bg-[#101D2D] px-8 text-base font-bold text-white shadow-lg shadow-[#101D2D]/20 transition-all hover:bg-[#1a2e45] hover:-translate-y-0.5 active:translate-y-0"
          >
            Explore Opportunities
          </Link>
          <Link
            href="#about"
            className="inline-flex h-14 items-center justify-center rounded-full border-2 border-zinc-200 bg-white/50 backdrop-blur-sm px-8 text-base font-bold text-[#101D2D] transition-all hover:border-zinc-300 hover:bg-white hover:-translate-y-0.5 active:translate-y-0"
          >
            Contact Sales
          </Link>
        </div>

        {/* Trust & Rating Section */}
        <div className="mt-20 flex w-full flex-col sm:flex-row items-center justify-between gap-8 border-t border-zinc-200/60 pt-10">

          {/* Left: Trusted Companies */}
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {/* Overlapping Avatar Circles */}
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#0088FF] text-white font-bold text-xs shadow-sm z-30">
                FG
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-green-600 text-white font-bold text-xs shadow-sm z-20">
                LS
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#101D2D] text-white font-bold text-xs shadow-sm z-10">
                +3K
              </div>
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-[#101D2D]">Trusted by 3K+ businesses</p>
              <p className="text-xs text-zinc-500">across the nation</p>
            </div>
          </div>

          {/* Right: Rating */}
          <div className="flex items-center gap-4">
            <div className="text-4xl font-extrabold text-[#101D2D]">4.9</div>
            <div className="text-left">
              <div className="flex text-[#FFB800] mb-1">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
              </div>
              <p className="text-xs font-medium text-zinc-500">Based on 200+ reviews</p>
            </div>
          </div>

        </div>
      </div>
 
    </section>
  );
}
