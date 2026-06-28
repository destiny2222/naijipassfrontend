"use client";

import { useState } from "react";
import AdminSidebar from "@/src/components/admin/AdminSidebar";
import AdminTopNav from "@/src/components/admin/AdminTopNav";
import { useAuth } from "@/src/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === "/admin/login";

  // Temporary guard: if not admin, redirect. Assuming admin role exists.
  // For now we just check if there is a user, and eventually you might want a stricter check.
  useEffect(() => {
    if (!isLoginPage && !loading && !user) {
      router.push("/admin/login");
    }
  }, [user, loading, router, isLoginPage]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-mod-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!isLoginPage && !user) {
    return null; // Will redirect
  }

  if (isLoginPage) {
    return <div className="min-h-screen bg-slate-50 font-sans">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-mod-primary/20">
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex flex-col lg:pl-64 transition-all duration-300">
        <AdminTopNav onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
