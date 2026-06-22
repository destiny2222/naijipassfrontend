"use client";

import { useState } from "react";
import Link from "next/link";
import { LoginPayload, loginUser } from "@/src/services/auth/login";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data: LoginPayload = {
      email,
      password,
    };
    try {
      const response = await loginUser(data);
      toast.success(response.message); 
      localStorage.setItem("email", email);
      // localStorage.setItem("token", response?.token);
      // localStorage.setItem("user", JSON.stringify(response.user));
      router.push("/auth/verifyotp");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An unexpected error occurred during login.");
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-zinc-50/50 px-4 py-12 sm:px-6 lg:px-8 bg-[radial-gradient(#e5e7eb_1.5px,transparent_1.5px)] [background-size:24px_24px]">

      {/* Top Left Navigation Back Home */}
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-[#101D2D] transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
      </div>

      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="rounded-2xl border border-zinc-100 bg-white p-8 shadow-xl shadow-zinc-100/50 sm:p-10">

          {/* Logo Section */}
          <div className="flex flex-col items-center text-center">
            <Link href="/" className="flex items-center gap-2 group mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#101D2D] text-white">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="5" r="3" fill="#FF6B2B" stroke="#FF6B2B" />
                  <circle cx="6" cy="17" r="3" fill="currentColor" />
                  <circle cx="18" cy="17" r="3" fill="currentColor" />
                  <path d="M6 14l6-6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-2xl font-black tracking-tight text-[#101D2D]">
                Naija<span className="text-[#FF6B2B]">Pass</span>
              </span>
            </Link>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Governance Portal
            </span>
            <p className="mt-4 text-sm text-zinc-500">
              Sign in to access your governance portal.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-[#101D2D]">
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-400">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="block w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-3 pl-11 pr-4 text-sm text-zinc-800 placeholder-zinc-400 outline-none transition-all focus:border-[#FF6B2B]/60 focus:bg-white focus:ring-1 focus:ring-[#FF6B2B]/60"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-[#101D2D]">
                  Password
                </label>
                <Link
                  href="#forgot"
                  className="text-xs font-semibold text-[#FF6B2B] hover:text-[#E55F23] transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-400">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-3 pl-11 pr-12 text-sm text-zinc-800 placeholder-zinc-400 outline-none transition-all focus:border-[#FF6B2B]/60 focus:bg-white focus:ring-1 focus:ring-[#FF6B2B]/60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-zinc-400 hover:text-zinc-600 focus:outline-none"
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
              className="flex w-full h-12 items-center justify-center rounded-xl bg-[#FF6B2B] text-sm font-semibold text-white shadow-lg shadow-[#FF6B2B]/10 transition-all hover:bg-[#E55F23] hover:shadow-[#E55F23]/25 focus:outline-none hover:-translate-y-0.5 active:translate-y-0"
            >
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="relative mt-8">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-zinc-150" />
            </div>
            <div className="relative flex justify-center text-xs font-bold uppercase tracking-wider">
              <span className="bg-white px-3 text-zinc-400">Or continue with</span>
            </div>
          </div>

          {/* Google Login */}
          <button
            type="button"
            className="mt-6 flex w-full h-12 items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-white text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 focus:outline-none active:bg-zinc-100"
          >
            {/* Google Icon */}
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.53-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-8.77z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.08 1.16-3.14 0-5.8-2.11-6.75-4.96H1.31v3.15C3.29 22.36 7.39 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.25 14.24A7.18 7.18 0 014.9 12c0-.79.13-1.57.35-2.31V6.54H1.31A11.94 11.94 0 000 12c0 2.01.5 3.91 1.31 5.61l3.94-3.37z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.22 0 12 0 7.39 0 3.29 1.64 1.31 5.37l3.94 3.09c.95-2.85 3.61-4.96 6.75-4.96z"
              />
            </svg>
            Sign in with Google
          </button>

          {/* Redirect to Register / Request Access */}
          <div className="mt-8 text-center text-sm">
            <span className="text-zinc-500">Don&apos;t have an account? </span>
            <Link
              href="/signup"
              className="font-semibold text-[#FF6B2B] hover:text-[#E55F23] transition-colors"
            >
              Request Access
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
