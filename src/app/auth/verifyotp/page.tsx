"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { verifyOtp, resendOtp, VerifyOtpPayload, ResendOtpPayload } from "@/src/services/auth/verifyOtp";

export default function VerifyOtpPage() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const savedEmail = localStorage.getItem("email");
        if (savedEmail) {
            setEmail(savedEmail);
        }
    }, []);


    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const data: VerifyOtpPayload = {
            email,
            otp,
        };

        try {
            const response = await verifyOtp(data);
            toast.success(response.message || "OTP Verified Successfully!");
            // Store token here after OTP verification
            if (response.token) {
                localStorage.setItem("token", response.token);
            }
            setTimeout(() => {
                router.push("/dashboard");
            }, 2000);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Invalid OTP or Email.");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (!email) {
            toast.error("Please enter your email to resend OTP.");
            return;
        }
        setResending(true);

        const data: ResendOtpPayload = { email };
        try {
            const response = await resendOtp(data);
            toast.success(response.message || "OTP has been resent!");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to resend OTP.");
        } finally {
            setResending(false);
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
                            <span className="text-xl font-black tracking-tight text-[#101D2D]">
                                Edo<span className="text-[#FF6B2B]">Bid</span>
                            </span>
                        </Link>
                        <h2 className="mt-4 text-2xl font-bold tracking-tight text-[#101D2D]">
                            Verify your account
                        </h2>
                        <p className="mt-2 text-sm text-zinc-500">
                            Enter the OTP sent to your email to continue.
                        </p>
                    </div>

                    <form onSubmit={handleVerify} className="mt-8 space-y-5">
                        {/* OTP */}
                        <div className="space-y-1.5">
                            <input
                                id="otp"
                                type="text"
                                required
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="123456"
                                maxLength={6}
                                className="block w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-3 pl-4 pr-10 text-center text-2xl tracking-widest text-zinc-800 placeholder-zinc-300 outline-none transition-all focus:border-[#FF6B2B]/60 focus:bg-white focus:ring-1 focus:ring-[#FF6B2B]/60"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 flex w-full h-12 items-center justify-center rounded-xl bg-[#FF6B2B] text-sm font-semibold text-white shadow-lg shadow-[#FF6B2B]/10 transition-all hover:bg-[#E55F23] hover:shadow-[#E55F23]/25 focus:outline-none hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0"
                        >
                            {loading ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                "Verify OTP"
                            )}
                        </button>
                    </form>

                    {/* Resend OTP */}
                    <div className="mt-6 text-center text-sm">
                        <span className="text-zinc-500">Didn't receive the code? </span>
                        <button
                            onClick={handleResend}
                            disabled={resending}
                            className="font-bold text-[#FF6B2B] hover:text-[#E55F23] transition-colors focus:outline-none disabled:opacity-50"
                        >
                            {resending ? "Resending..." : "Resend OTP"}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}