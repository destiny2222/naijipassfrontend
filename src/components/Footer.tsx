"use client";

import Link from "next/link";

export default function Footer() {
  const companyLinks = [
    { name: "About", href: "#about" },
    { name: "Blog", href: "#blog" },
    { name: "FAQ", href: "#faq" },
  ];

  const legalLinks = [
    { name: "Terms & Conditions", href: "#terms" },
    { name: "Claim", href: "#claim" },
    { name: "Privacy & Policy", href: "#privacy" },
    { name: "Contact us", href: "#contact" },
  ];

  return (
    <footer className="bg-[#101D2D] text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <Link href="#" className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition-transform duration-300 group-hover:scale-105">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="5" r="3" fill="#FF6B2B" stroke="#FF6B2B" />
                  <circle cx="6" cy="17" r="3" fill="currentColor" />
                  <circle cx="18" cy="17" r="3" fill="currentColor" />
                  <path d="M6 14l6-6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Edo <span className="text-[#FF6B2B]">Bid</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-6 text-zinc-400 max-w-sm">
              Edo Bid is a dynamic brand specializing in contracting and bidding for projects. 
              With a focus on transparency, efficiency, and professionalism.
            </p>
          </div>

          {/* Column 2: Company Links */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Company</h3>
            <ul className="mt-4 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal Links */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Legal</h3>
            <ul className="mt-4 space-y-3">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Newsletter</h3>
            <p className="mt-4 text-sm leading-6 text-zinc-400">
              Subscribe to our weekly Newsletter and receive updates via email.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="mt-4 flex max-w-md gap-x-2">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                placeholder="Email*"
                className="min-w-0 flex-auto rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder-zinc-500 shadow-sm focus:border-[#FF6B2B]/80 focus:ring-1 focus:ring-[#FF6B2B]/80 outline-none"
              />
              <button
                type="submit"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF6B2B] text-white shadow-md hover:bg-[#E55F23] transition-colors"
                aria-label="Subscribe"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </form>
          </div>
        </div>

        {/* Divider and Footer Bottom */}
        <div className="mt-16 border-t border-white/10 pt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-zinc-500">
            All Rights Reserved @ Company 2026
          </p>
          <div className="flex gap-x-6">
            <Link href="#terms" className="text-xs hover:text-white transition-colors duration-200">
              Terms & Conditions
            </Link>
            <Link href="#claim" className="text-xs hover:text-white transition-colors duration-200">
              Claim
            </Link>
            <Link href="#privacy" className="text-xs hover:text-white transition-colors duration-200">
              Privacy & Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
