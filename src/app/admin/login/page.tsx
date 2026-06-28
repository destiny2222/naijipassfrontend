"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/src/hooks/useAuth";
import { loginUser, LoginPayload } from "@/src/services/auth/login";
import toast from "react-hot-toast";

export default function AdminLogin() {
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

  const [formData, setFormData] = useState<LoginPayload>({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await loginUser(formData);
      localStorage.setItem("email", formData.email);
      // For auth/verifyotp logic if applicable, or straight to dashboard
      // Usually admins don't have OTP unless configured, but assuming we follow the same flow
      router.push("/auth/verifyotp");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid admin credentials");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 py-12 sm:px-6 lg:px-8 selection:bg-mod-primary/20">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-2 text-center text-3xl font-black tracking-tight text-slate-800">
          Admin Portal
        </h2>
        <p className="mt-2 text-center text-sm font-medium text-slate-500">
          Sign in to access system configurations
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[420px]">
        <div className="rounded-[18px] bg-white px-8 py-10 shadow-sm border border-slate-100 sm:px-10 relative overflow-hidden">
          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-50 p-4 text-sm font-bold text-red-600">
              <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-bold text-slate-700"
              >
                Admin Email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm placeholder:text-slate-400 placeholder:font-medium focus:border-mod-primary focus:bg-white focus:ring-4 focus:ring-mod-primary/10 transition-all"
                  placeholder="admin@system.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-bold text-slate-700"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm placeholder:text-slate-400 placeholder:font-medium focus:border-mod-primary focus:bg-white focus:ring-4 focus:ring-mod-primary/10 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-mod-primary focus:ring-mod-primary/30"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm font-semibold text-slate-600"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-bold text-mod-primary hover:text-blue-700 transition-colors"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-mod-primary px-4 py-3 text-sm font-bold text-white shadow-md shadow-mod-primary/20 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-mod-primary/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Authenticating...
                  </>
                ) : (
                  "Sign in to System"
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
            >
              ← Back to main site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
