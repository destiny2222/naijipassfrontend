"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname() || "";
  const { user, logout } = useAuth();

  const activeTab = pathname === "/about" 
    ? "About" 
    : pathname === "/tables" 
      ? "Table" 
      : pathname === "/visualization" 
        ? "Visualization" 
        : pathname === "/projects" 
          ? "Projects"
          : pathname === "/" 
            ? "Home"
            : "Home";

  const navLinks = [
    { name: "About", href: "/about" },
    { name: "Projects", href: "/projects" },
    { name: "Table", href: "/tables" },
    { name: "Visualization", href: "/visualization" },
  ];

  return (
    <>
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              {/* Brain / Node Icon */}
              <svg
                className="h-8 w-8 text-[#0088FF] transition-transform duration-300 group-hover:scale-105"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <span className="text-2xl font-bold tracking-tight text-[#101D2D]">
                NaijaPass
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
                      ? "text-[#0088FF]"
                      : "text-zinc-600 hover:text-[#0088FF]"
                    }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 h-[3px] w-full rounded-full bg-[#0088FF]" />
                  )}
                </a>
              );
            })}
          </div>

          {/* Right Utilities */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-sm font-semibold text-[#101D2D] hover:text-[#0088FF] transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="inline-flex h-10 items-center justify-center rounded-xl bg-zinc-100 px-5 text-sm font-semibold text-zinc-700 shadow-sm hover:bg-zinc-200 transition-all active:translate-y-0"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="text-sm font-semibold text-[#101D2D] hover:text-[#0088FF] transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="inline-flex h-10 items-center justify-center rounded-xl bg-[#0088FF] px-6 text-sm font-semibold text-white shadow-sm hover:bg-[#0070D1] transition-all hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex md:hidden p-2 text-zinc-500 hover:text-[#0088FF] rounded-lg focus:outline-none"
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
    </nav>

      {/* Mobile Menu Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-zinc-900/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu Side Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-[60] w-full max-w-sm border-l border-zinc-100 bg-white px-6 py-6 transition-transform duration-300 md:hidden shadow-2xl ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <svg className="h-6 w-6 text-[#0088FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <span className="text-xl font-bold tracking-tight text-[#101D2D]">
                NaijaPass
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
                  onClick={() => setIsOpen(false)}
                  className={`block rounded-lg px-3 py-2 text-base font-semibold transition-colors ${activeTab === link.name
                      ? "bg-zinc-50 text-[#0088FF]"
                      : "text-zinc-600 hover:bg-zinc-50 hover:text-[#0088FF]"
                    }`}
                >
                  {link.name}
                </a>
              ))}
            </div>
            <div className="mt-6 flex flex-col gap-3 border-t border-zinc-100 pt-6">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex w-full items-center justify-center rounded-xl border border-zinc-200 bg-white py-3 text-sm font-semibold text-[#101D2D] shadow-sm hover:bg-zinc-50"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="flex w-full items-center justify-center rounded-xl bg-zinc-100 py-3 text-sm font-semibold text-zinc-700 shadow-sm hover:bg-zinc-200"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setIsOpen(false)}
                    className="flex w-full items-center justify-center rounded-xl border border-zinc-200 bg-white py-3 text-sm font-semibold text-[#101D2D] shadow-sm hover:bg-zinc-50"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setIsOpen(false)}
                    className="flex w-full items-center justify-center rounded-xl bg-[#0088FF] py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#0070D1]"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
