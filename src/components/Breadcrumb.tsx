"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeroGeometric } from "@/src/components/ui/shape-landing-hero";

export default function Breadcrumb() {
  const pathname = usePathname() || "";
  const paths = pathname.split("/").filter(Boolean);

  if (paths.length === 0) return null;

  // Clean display name for the current page
  const currentPath = paths[paths.length - 1];
  const pageTitle = currentPath
    ? currentPath
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "";

  return (
    <div className="mb-6">
      <HeroGeometric 
        badge="Current Location" 
        title1={pageTitle || "Overview"} 
        title2=""
      >
        <nav className="flex items-center justify-center gap-2 text-sm font-semibold text-zinc-300 mt-4" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-white transition-colors">
            Home
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
                <svg className="h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
                {isLast ? (
                  <span className="text-white font-bold">{displayName}</span>
                ) : (
                  <Link href={href} className="hover:text-white transition-colors">
                    {displayName}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>
      </HeroGeometric>
    </div>
  );
}
