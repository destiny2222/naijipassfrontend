"use client";

import ProtectedRoute from "@/src/components/ProtectedRoute";
import Sidebar from "@/src/components/sidebar/page";
import TopNav from "@/src/components/tobnav/page";
import { useState } from "react";
import { useAuth } from "@/src/hooks/useAuth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-50/50 text-[#101D2D]">
        <Sidebar 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)} 
        />
        <div className="lg:pl-64 flex flex-col min-h-screen">
          <TopNav 
            userName={user?.name || "Contractor"} 
            userRole={user?.kyc?.details?.type === 'business' || (user as any)?.kyc?.type === 'business' ? "Certified Business" : "Individual User"} 
            onMenuClick={() => setIsMobileMenuOpen(true)}
          />
          <main className="flex-grow">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
