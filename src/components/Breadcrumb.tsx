"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumb() {
  const pathname = usePathname() || "";
  const paths = pathname.split("/").filter(Boolean);
  console.log("Breadcrumb debug:", { pathname, paths });

  if (paths.length === 0) return null;

  return (
    <nav className="flex items-center gap-2 text-xs font-semibold text-zinc-500 mb-6" aria-label="Breadcrumb">
      <Link href="/" className="hover:text-[#FF6B2B] transition-colors">
        Home
      </Link>
      {paths.map((path, index) => {
        const href = "/" + paths.slice(0, index + 1).join("/");
        const isLast = index === paths.length - 1;
        
        // Clean display name, handle dashes to spaces, e.g. "active-bids" to "Active Bids"
        const displayName = path
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        return (
          <div key={path} className="flex items-center gap-2">
            <svg className="h-3 w-3 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            {isLast ? (
              <span className="text-zinc-700 font-bold">{displayName}</span>
            ) : (
              <Link href={href} className="hover:text-[#FF6B2B] transition-colors">
                {displayName}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
