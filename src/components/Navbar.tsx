"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname() || "";

  const activeTab = pathname === "/projects" 
    ? "Project" 
    : pathname === "/tables" 
      ? "Tables" 
      : pathname === "/visualization" 
        ? "Visualization" 
        : "Home";

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/#about" },
    { name: "Project", href: "/projects" },
    { name: "Tables", href: "/tables" },
    { name: "Visualization", href: "/visualization" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link href="#" className="flex items-center gap-2.5 group">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#101D2D] text-white shadow-md transition-transform duration-300 group-hover:scale-105">
                {/* SVG Icon representing Bid / Contracting (3 overlapping circular points) */}
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <circle cx="12" cy="5" r="3" fill="#FF6B2B" stroke="#FF6B2B" />
                  <circle cx="6" cy="17" r="3" fill="currentColor" />
                  <circle cx="18" cy="17" r="3" fill="currentColor" />
                  <path d="M6 14l6-6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-[#101D2D]">
                Edo <span className="text-[#FF6B2B]">Bid</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center justify-center space-x-8">
            {navLinks.map((link) => {
              const isActive = activeTab === link.name;
              return (
                <a
                  key={link.name}
                  href={link.href}

                  className={`relative py-2 text-sm font-semibold transition-colors duration-250 ${isActive
                      ? "text-[#FF6B2B]"
                      : "text-zinc-600 hover:text-[#FF6B2B]"
                    }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 h-[3px] w-full rounded-full bg-[#FF6B2B]" />
                  )}
                </a>
              );
            })}
          </div>

          {/* Right Utilities (Login, Signup, and Mobile Hamburger) */}
          <div className="flex items-center gap-4">
            {/* Desktop Login & Signup Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-semibold text-[#101D2D] hover:text-[#FF6B2B] transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="inline-flex h-10 items-center justify-center rounded-xl bg-[#FF6B2B] px-5 text-sm font-semibold text-white shadow-sm hover:bg-[#E55F23] transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                Sign up
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex md:hidden p-2 text-zinc-500 hover:text-[#FF6B2B] rounded-lg focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Side Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-sm border-l border-zinc-100 bg-white px-6 py-6 transition-transform duration-300 md:hidden shadow-2xl ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="#" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#101D2D] text-white">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="5" r="3" fill="#FF6B2B" stroke="#FF6B2B" />
                  <circle cx="6" cy="17" r="3" fill="currentColor" />
                  <circle cx="18" cy="17" r="3" fill="currentColor" />
                  <path d="M6 14l6-6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-lg font-bold tracking-tight text-[#101D2D]">
                Edo <span className="text-[#FF6B2B]">Bid</span>
              </span>
            </Link>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-md p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700"
          >
            <span className="sr-only">Close menu</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="mt-8 flow-root">
          <div className="my-6 divide-y divide-zinc-100">
            <div className="space-y-2 py-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => {
                    setIsOpen(false);
                  }}
                  className={`block rounded-lg px-3 py-2 text-base font-semibold transition-colors ${activeTab === link.name
                      ? "bg-zinc-50 text-[#FF6B2B]"
                      : "text-zinc-600 hover:bg-zinc-50 hover:text-[#FF6B2B]"
                    }`}
                >
                  {link.name}
                </a>
              ))}
            </div>
            <div className="space-y-3 py-6">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-[#101D2D] hover:bg-zinc-50 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center rounded-xl bg-[#FF6B2B] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#E55F23] transition-colors"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
