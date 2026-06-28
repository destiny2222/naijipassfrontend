import React from "react";

const logos = [
  {
    name: "Federal Gov",
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    name: "State Ministries",
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.778.099-1.533.284-2.253" />
      </svg>
    ),
  },
  {
    name: "World Bank",
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
  },
  {
    name: "AFDB",
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    name: "NEXIM",
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }
];

export default function TrustBanner() {
  return (
    <section className="border-y border-zinc-100 bg-zinc-50/30 py-12 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-xs font-bold uppercase tracking-widest text-zinc-400 mb-10">
          Trusted by Leading Institutions
        </h2>
        
        {/* Marquee Wrapper */}
        <div className="relative flex overflow-hidden">
          {/* Fading edges for seamless look */}
          <div className="absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-white to-transparent md:w-32" />
          <div className="absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-white to-transparent md:w-32" />

          {/* Marquee Inner Content */}
          <div className="flex animate-marquee whitespace-nowrap">
            {/* First Set of Logos */}
            <div className="flex w-max items-center justify-center gap-16 px-8 md:gap-32 md:px-16">
              {logos.map((logo, idx) => (
                <div key={idx} className="group flex items-center gap-3 text-zinc-400 transition-colors duration-300 hover:text-[#0088FF] cursor-pointer">
                  <div className="transition-transform group-hover:scale-110">
                    {logo.icon}
                  </div>
                  <span className="text-sm font-black tracking-wider uppercase">{logo.name}</span>
                </div>
              ))}
            </div>
            
            {/* Second Set of Logos (Duplicate for infinite scrolling) */}
            <div className="flex w-max items-center justify-center gap-16 px-8 md:gap-32 md:px-16">
              {logos.map((logo, idx) => (
                <div key={`dup-${idx}`} className="group flex items-center gap-3 text-zinc-400 transition-colors duration-300 hover:text-[#0088FF] cursor-pointer">
                  <div className="transition-transform group-hover:scale-110">
                    {logo.icon}
                  </div>
                  <span className="text-sm font-black tracking-wider uppercase">{logo.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
