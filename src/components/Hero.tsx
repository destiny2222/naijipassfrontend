export default function Hero() {
  return (
    <section className="relative flex min-h-[85vh] items-center justify-start overflow-hidden bg-[#101D2D] py-20">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/hero-bg.png')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#101D2D]/95 via-[#101D2D]/80 to-transparent" />
      
      {/* Watermark / Graphics */}
      <div className="absolute right-12 bottom-12 hidden lg:block opacity-10">
        <svg
          className="h-96 w-96 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </div>

      {/* Main Content Area */}
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl text-left">
          {/* Subheading / Tag */}
          <div className="inline-flex items-center gap-2 rounded-md bg-[#FF6B2B]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#FF6B2B]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B2B]" />
            Naijapass Portal
          </div>

          {/* Heading */}
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl leading-[1.1]">
            Unified Gateway to <br />
            <span className="text-[#FF6B2B]">Nigeria&apos;s 36 States</span>
          </h1>

          {/* Paragraph Description */}
          <p className="mt-6 text-lg leading-8 text-zinc-300">
            Partnering businesses with government projects to drive growth and development.
            Access verified intelligence, secure directories, and streamline your procurement
            journey across the nation.
          </p>

          {/* Call to Actions */}
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#opportunities"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-[#FF6B2B] px-6 text-sm font-semibold text-white shadow-lg shadow-[#FF6B2B]/20 transition-all hover:bg-[#E55F23] hover:shadow-[#E55F23]/30 focus:outline-none hover:-translate-y-0.5 active:translate-y-0"
            >
              Explore Opportunities
            </a>
            <a
              href="#about"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10 focus:outline-none hover:-translate-y-0.5 active:translate-y-0"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
