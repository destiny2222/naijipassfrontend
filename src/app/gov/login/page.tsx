"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LoginPayload, loginUser } from "@/src/services/auth/login";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/src/hooks/useAuth";

export default function GovLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'admin') {
        router.push("/admin/dashboard");
      } else if (user.role === 'gov') {
        router.push("/gov/dashboard");
      } else {
        router.push("/dashboard");
      }
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data: LoginPayload = { email, password };
    try {
      const response = await loginUser(data);
      toast.success(response.message); 
      localStorage.setItem("email", email);
      router.push("/auth/verifyotp");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid Government Credentials.");
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-mod-bg px-4 py-12 sm:px-6 lg:px-8">
      
      {/* Top Left Navigation Back Home */}
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-mod-primary transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Main Site
        </Link>
      </div>

      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="rounded-[18px] border border-slate-100 bg-white p-8 shadow-sm sm:p-10">

          {/* Logo Section */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-2 group mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mod-primary/10 text-mod-primary">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <span className="text-2xl font-bold tracking-tight text-slate-800">
                Gov<span className="text-mod-primary">Portal</span>
              </span>
            </div>
            <p className="mt-4 text-sm font-medium text-slate-500">
              State Administrator Access
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                Official Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@state.gov.ng"
                  className="block w-full rounded-lg border border-slate-200 bg-transparent py-2.5 px-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-mod-primary focus:ring-1 focus:ring-mod-primary"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full rounded-lg border border-slate-200 bg-transparent py-2.5 px-4 pr-12 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-mod-primary focus:ring-1 focus:ring-mod-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-mod-primary focus:outline-none"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="flex w-full h-11 items-center justify-center rounded-lg bg-mod-primary text-sm font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-mod-primary focus:ring-offset-2"
            >
              Sign In
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
