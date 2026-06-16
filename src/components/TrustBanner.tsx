export default function TrustBanner() {
  return (
    <section className="border-y border-zinc-100 bg-zinc-50/50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-xs font-bold uppercase tracking-widest text-zinc-400">
          Trusted by Leading Institutions
        </h2>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 md:gap-x-20">
          {/* Logo 1: Federal Gov */}
          <div className="flex items-center gap-2 text-zinc-400 opacity-60 hover:opacity-85 transition-opacity duration-250 cursor-default">
            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="text-sm font-black tracking-wider uppercase">Federal Gov</span>
          </div>

          {/* Logo 2: State Ministries */}
          <div className="flex items-center gap-2 text-zinc-400 opacity-60 hover:opacity-85 transition-opacity duration-250 cursor-default">
            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.778.099-1.533.284-2.253" />
            </svg>
            <span className="text-sm font-black tracking-wider uppercase">State Ministries</span>
          </div>

          {/* Logo 3: World Bank */}
          <div className="flex items-center gap-2 text-zinc-400 opacity-60 hover:opacity-85 transition-opacity duration-250 cursor-default">
            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            <span className="text-sm font-black tracking-wider uppercase">World Bank</span>
          </div>

          {/* Logo 4: AFDB */}
          <div className="flex items-center gap-2 text-zinc-400 opacity-60 hover:opacity-85 transition-opacity duration-250 cursor-default">
            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-sm font-black tracking-wider uppercase">AFDB</span>
          </div>
        </div>
      </div>
    </section>
  );
}
