"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumb() {
  const pathname = usePathname() || "";
  const paths = pathname.split("/").filter(Boolean);

  // If we are on the home page, don't show the breadcrumb/header
  if (paths.length === 0) return null;

  // Clean display name for the current page
  const currentPath = paths[paths.length - 1];
  const pageTitle = currentPath
    ? currentPath
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "Overview";

  return (
    <div className="w-full relative overflow-hidden pt-32 pb-16 bg-zinc-50 border-b border-zinc-200">
      
      {/* Animated Box Line Grid Overlay (Moving Lines) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:40px_40px] animate-grid pointer-events-none" />
      
      {/* Subtle fade at the top and bottom so the lines blend nicely */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-50 via-transparent to-zinc-50 pointer-events-none" />

      {/* Very faint blue decorative orb */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0088FF]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10 flex flex-col items-center text-center">
        
        {/* Top Pill / Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-zinc-500 backdrop-blur-md mb-6 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-[#0088FF] animate-pulse" />
          NaijaPass Portal
        </div>

        {/* Dynamic Page Title */}
        <h1 className="text-4xl font-extrabold tracking-tight text-[#101D2D] sm:text-5xl mb-6">
          {pageTitle}
        </h1>
        
        {/* Sleek Breadcrumb Navigation inside a Glass Card */}
        <nav className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 bg-white/70 backdrop-blur-md px-6 py-3 rounded-full border border-zinc-200 shadow-sm" aria-label="Breadcrumb">
          <Link 
            href="/" 
            className="flex items-center gap-1.5 hover:text-[#0088FF] transition-colors"
            aria-label="Home"
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
          
          {paths.map((path, index) => {
            const href = "/" + paths.slice(0, index + 1).join("/");
            const isLast = index === paths.length - 1;
            
            const displayName = path
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");

            return (
              <div key={path} className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-zinc-300" />
                {isLast ? (
                  <span className="text-[#101D2D] font-bold">
                    {displayName}
                  </span>
                ) : (
                  <Link 
                    href={href} 
                    className="hover:text-[#0088FF] transition-colors"
                  >
                    {displayName}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>
        
      </div>
    </div>
  );
}
