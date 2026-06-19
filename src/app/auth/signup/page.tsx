"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { registerUser, RegisterPayload } from "@/src/services/auth/register";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name,
    email,
    phone,
    password,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!agreeTerms) {
      toast.error("Please agree to the terms and conditions");
      setLoading(false);
      return;
    }

    try {
      const response = await registerUser(formData);
      toast.success(response.message);
      localStorage.setItem("email", formData.email);
      // set timeout
      setTimeout(() => {
        router.push("/auth/verifyotp");
      }, 2000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An unexpected error occurred during signup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-white">

      {/* Left Column: Register Form */}
      <div className="flex w-full flex-col justify-center px-6 py-20 lg:w-[50%] xl:w-[55%] sm:px-12 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-lg">

          {/* Logo Section */}
          <div className="flex items-center gap-2.5 mb-8">
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
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-[#101D2D]">
            Create your account
          </h1>
          <p className="mt-3 text-sm text-zinc-500">
            Join the premier governance and bidding portal.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label htmlFor="fullName" className="block text-xs font-bold uppercase tracking-wider text-[#101D2D]">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Chukwudi Okafor"
                className="block w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-3 px-4 text-sm text-zinc-800 placeholder-zinc-400 outline-none transition-all focus:border-[#FF6B2B]/60 focus:bg-white focus:ring-1 focus:ring-[#FF6B2B]/60"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-[#101D2D]">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@company.com"
                className="block w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-3 px-4 text-sm text-zinc-800 placeholder-zinc-400 outline-none transition-all focus:border-[#FF6B2B]/60 focus:bg-white focus:ring-1 focus:ring-[#FF6B2B]/60"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label htmlFor="phoneNumber" className="block text-xs font-bold uppercase tracking-wider text-[#101D2D]">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+234 800 000  0000"
                className="block w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-3 px-4 text-sm text-zinc-800 placeholder-zinc-400 outline-none transition-all focus:border-[#FF6B2B]/60 focus:bg-white focus:ring-1 focus:ring-[#FF6B2B]/60"
              />
            </div>



            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-[#101D2D]">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="block w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-3 pl-4 pr-12 text-sm text-zinc-800 placeholder-zinc-400 outline-none transition-all focus:border-[#FF6B2B]/60 focus:bg-white focus:ring-1 focus:ring-[#FF6B2B]/60"
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

            {/* Terms Agreement Checkbox */}
            <div className="flex items-start">
              <div className="flex h-5 items-center">
                <input
                  id="agreeTerms"
                  name="agreeTerms"
                  type="checkbox"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-300 text-[#FF6B2B] focus:ring-[#FF6B2B]"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agreeTerms" className="text-zinc-500">
                  I agree to the{" "}
                  <Link href="#terms" className="font-semibold text-[#FF6B2B] hover:text-[#E55F23] transition-colors">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#privacy" className="font-semibold text-[#FF6B2B] hover:text-[#E55F23] transition-colors">
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full h-12 items-center justify-center rounded-xl bg-[#FF6B2B] text-sm font-semibold text-white shadow-lg shadow-[#FF6B2B]/10 transition-all hover:bg-[#E55F23] hover:shadow-[#E55F23]/25 focus:outline-none hover:-translate-y-0.5 active:translate-y-0"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Redirect to Login */}
          <div className="mt-8 text-center text-sm">
            <span className="text-zinc-500">Already have an account? </span>
            <Link
              href="/login"
              className="font-semibold text-[#FF6B2B] hover:text-[#E55F23] transition-colors"
            >
              Sign in to portal
            </Link>
          </div>

        </div>
      </div>

      {/* Right Column: Premium Marketing/Details Panel */}
      <div className="hidden lg:relative lg:flex lg:w-[50%] xl:w-[45%] flex-col justify-between bg-[#101D2D] p-12 xl:p-16 text-white overflow-hidden">

        {/* Dynamic Abstract Background Elements */}
        <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-[#FF6B2B]/20 to-transparent blur-[80px] opacity-40 pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 h-[300px] w-[300px] rounded-full bg-gradient-to-tr from-sky-500/10 to-transparent blur-[60px] opacity-30 pointer-events-none" />

        {/* Top Spacer or logo */}
        <div className="w-full" />

        {/* Central Marketing Info */}
        <div className="relative max-w-md my-auto">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-[#FF6B2B] shadow-inner backdrop-blur-md">
            {/* Wrench/Hammer Crossed Icon */}
            <svg className="h-7 w-7 text-[#FF6B2B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
            Building Transparency, <br />One Bid at a Time.
          </h2>

          <p className="mt-4 text-sm leading-6 text-zinc-300">
            Join thousands of certified contractors and government officials on NaijaPass.
            Access real-time procurement data, track project execution, and participate in a fair,
            open marketplace designed for modern Nigerian governance.
          </p>

          {/* Feature List */}
          <div className="mt-10 space-y-6">
            {/* Feature 1 */}
            <div className="flex gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FF6B2B]/10 text-[#FF6B2B]">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Localized Alerts</h4>
                <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                  Get instant notifications for new tenders specifically in your registered state of operation.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Verified Ecosystem</h4>
                <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                  Engage with thoroughly vetted contractors and legitimate institutional bodies.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info or contact */}
        <div className="text-xs text-zinc-500 mt-8">
          NaijaPass Portal v1.0.0
        </div>
      </div>
    </div>
  );
}
