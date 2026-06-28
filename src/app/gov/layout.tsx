"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import GovSidebar from "@/src/components/gov/GovSidebar";
import GovTopNav from "@/src/components/gov/GovTopNav";
import { useAuth } from "@/src/hooks/useAuth";

export default function GovLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && pathname !== '/gov/login') {
      if (!user || user.role !== 'gov') {
        router.push('/gov/login');
      }
    }
  }, [user, loading, pathname, router]);

  if (loading && pathname !== '/gov/login') {
    return <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">Loading Admin Portal...</div>;
  }

  if (pathname === '/gov/login') {
    return <div className="min-h-screen bg-[#F8F9FA]">{children}</div>;
  }

  if (!user || user.role !== 'gov') return null;

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] font-sans">
      <GovSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      <div className="flex flex-1 flex-col lg:pl-64">
        <GovTopNav onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
