"use client";

import Link from "next/link";
import { ArrowRight, Mail, MessageCircle, Globe, MapPin } from "lucide-react";

export default function Footer() {
  const companyLinks = [
    { name: "About Us", href: "/about" },
    { name: "Open Tenders", href: "/projects" },
    { name: "How it Works", href: "/#how-it-works" },
    { name: "Contact Support", href: "/contact" },
  ];

  const legalLinks = [
    { name: "Terms & Conditions", href: "#terms" },
    { name: "Privacy Policy", href: "#privacy" },
    { name: "Cookie Policy", href: "#cookies" },
    { name: "Contact us", href: "#contact" },
  ];

  return (
    <footer className="relative bg-[#0a111a] text-zinc-400 overflow-hidden pt-24 pb-12 border-t border-zinc-800">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-[#0088FF]/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#0088FF]/15 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Subtle Dark Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Top Pre-Footer CTA */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-20 pb-16 border-b border-white/10">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
              Ready to build the future of <span className="text-[#0088FF]">Nigeria?</span>
            </h2>
            <p className="text-lg text-zinc-400">
              Join thousands of verified vendors and government agencies streamlining infrastructure development.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link
              href="#signup"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#0088FF] px-8 text-base font-bold text-white shadow-[0_0_40px_rgba(0,136,255,0.4)] transition-all hover:bg-[#0070D1] hover:shadow-[0_0_60px_rgba(0,136,255,0.6)] hover:-translate-y-1"
            >
              Get Started Now
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 mb-16">
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2 group w-max">
              <svg
                className="h-8 w-8 text-[#0088FF] transition-transform duration-300 group-hover:scale-110"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <span className="text-2xl font-black tracking-tight text-white">
                NaijaPass
              </span>
            </Link>
            <p className="text-sm leading-6 text-zinc-400 max-w-sm">
              NaijaPass is a dynamic platform specializing in contracting and bidding for projects. 
              With a focus on transparency, efficiency, and professionalism across Nigeria.
            </p>
          </div>

          {/* Column 2: Company Links */}
          <div className="lg:col-span-2 lg:col-start-6 flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">Company</h3>
            <ul className="mt-2 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-zinc-400 hover:text-[#0088FF] transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal Links */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">Legal</h3>
            <ul className="mt-2 space-y-3">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-zinc-400 hover:text-[#0088FF] transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">Newsletter</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Subscribe to get the latest infrastructure updates.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="mt-2 flex flex-col sm:flex-row gap-2">
              <input
                id="email-address"
                name="email"
                type="email"
                required
                placeholder="Email address..."
                className="w-full min-w-0 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-zinc-500 shadow-sm transition-colors focus:border-[#0088FF] focus:bg-white/10 focus:outline-none"
              />
              <button
                type="submit"
                className="flex h-[46px] w-[46px] flex-shrink-0 items-center justify-center rounded-xl bg-[#0088FF] text-white shadow-md hover:bg-[#0070D1] transition-all hover:scale-105"
                aria-label="Subscribe"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>

        {/* Divider and Footer Bottom */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-zinc-500">
            &copy; {new Date().getFullYear()} NaijaPass. All rights reserved.
          </p>
          
          {/* Social Links */}
          <div className="flex items-center gap-4">
            {[
              { icon: Mail, href: "#" },
              { icon: MessageCircle, href: "#" },
              { icon: Globe, href: "#" },
              { icon: MapPin, href: "#" },
            ].map((Social, idx) => (
              <Link 
                key={idx} 
                href={Social.href}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-zinc-400 transition-all hover:bg-[#0088FF] hover:text-white hover:-translate-y-1"
              >
                <Social.icon className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
