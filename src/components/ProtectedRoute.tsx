"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, hasSubmittedKyc } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in
        router.push("/auth/login");
      } else if (!hasSubmittedKyc && !pathname.includes("/onboarding")) {
        // Logged in but KYC not submitted -> redirect to onboarding
        router.push("/onboarding");
      }
    }
  }, [user, loading, hasSubmittedKyc, pathname, router]);

  // Show loading state while auth is being checked
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50/50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-200 border-t-[#FF6B2B]"></div>
      </div>
    );
  }

  // If redirecting to onboarding, don't flash the protected content
  if (!hasSubmittedKyc && !pathname.includes("/onboarding")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50/50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-200 border-t-[#FF6B2B]"></div>
      </div>
    );
  }

  return <>{children}</>;
}
