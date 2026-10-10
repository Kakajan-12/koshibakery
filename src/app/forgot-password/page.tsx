"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import {AlertCircle, ArrowLeft, KeyRound, Loader2, MailCheck, Send} from "lucide-react";
import {manrope, raleway} from "@/app/fonts";
import {takeEmail} from "@/lib/prefillEmail";

const INPUT = `${manrope.className} w-full h-12 px-4 rounded-xl bg-white text-[15px] text-[#12100F] placeholder:text-gray-400
    ring-1 ring-[#B8485B]/20 outline-none transition focus:ring-2 focus:ring-[#B8485B]/50`;

function ForgotPasswordForm() {
    const [email, setEmail] = useState("");
    // С формы входа приходит уже введённый email (lib/prefillEmail.ts)
    useEffect(() => {
        const remembered = takeEmail();
        if (remembered) setEmail(remembered);
    }, []);
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        setError("");
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email: email.trim()}),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.message || data.error || "We couldn't send the email. Please try again.");
            setSent(true);
        } catch (err) {
            const text = err instanceof Error ? err.message : "";
            setError(text === "Failed to fetch" ? "We couldn't reach the server. Please check your connection and try again." : text);
        } finally {
            setSending(false);
        }
    };

    if (sent) {
        return (
            <div className="flex flex-col items-center text-center" role="status">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF5EC] text-[#2F6B3F]">
                    <MailCheck className="h-8 w-8" aria-hidden="true"/>
                </span>
                <h1 className={`${raleway.className} mt-5 text-2xl sm:text-3xl font-bold text-[#12100F]`}>Check your inbox</h1>
                <p className={`${manrope.className} mt-3 text-[#6F5E53]`}>
                    If an account exists for <span className="font-semibold text-[#12100F]">{email.trim()}</span>, we&apos;ve sent a link
                    to reset your password. It works for 60 minutes.
                </p>
                <p className={`${manrope.className} mt-3 text-sm text-[#6F5E53]`}>
                    Can&apos;t see it? Check your spam folder, or{" "}
                    <button type="button" onClick={() => setSent(false)} className="font-semibold text-[#B8485B] link-underline cursor-pointer">
                        try another email
                    </button>.
                </p>
                <Link href="/login" className={`${manrope.className} mt-8 inline-flex items-center gap-2 h-12 px-6 rounded-full main-button-color text-white text-[15px] font-semibold shadow-sm transition hover:brightness-110`}>
                    <ArrowLeft className="w-4 h-4" aria-hidden="true"/> Back to log in
                </Link>
            </div>
        );
    }

    return (
        <>
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#B8485B]/10 text-[#B8485B]">
                <KeyRound className="h-7 w-7" aria-hidden="true"/>
            </span>
            <h1 className={`${raleway.className} mt-5 text-2xl sm:text-3xl font-bold text-[#12100F]`}>Forgot your password?</h1>
            <p className={`${manrope.className} mt-2 text-[#6F5E53]`}>
                Enter the email you use for Koşi Bakery and we&apos;ll send you a link to choose a new password.
            </p>
            <form onSubmit={submit} className="mt-8 space-y-5">
                <div>
                    <label htmlFor="forgot-email" className={`${manrope.className} block text-sm font-semibold text-[#12100F] mb-1.5`}>Email</label>
                    <input id="forgot-email" type="email" required autoComplete="email" autoFocus maxLength={255}
                           placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className={INPUT}/>
                </div>
                {error && (
                    <div role="alert" className="flex items-start gap-3 rounded-2xl bg-[#FEF3F2] ring-1 ring-[#B42318]/20 p-4">
                        <AlertCircle className="w-5 h-5 shrink-0 text-[#B42318] mt-0.5" aria-hidden="true"/>
                        <p className={`${manrope.className} text-sm text-[#912018]`}>{error}</p>
                    </div>
                )}
                <button type="submit" disabled={sending}
                        className={`${manrope.className} w-full inline-flex items-center justify-center gap-2 h-12 rounded-full main-button-color text-white text-base font-semibold shadow-md cursor-pointer transition hover:brightness-110 disabled:opacity-70 disabled:cursor-wait`}>
                    {sending ? <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true"/> : <Send className="w-5 h-5" aria-hidden="true"/>}
                    {sending ? "Sending…" : "Send reset link"}
                </button>
            </form>
            <p className={`${manrope.className} mt-6 text-center text-sm text-[#6F5E53]`}>
                Remembered it?{" "}
                <Link href="/login" className="font-semibold text-[#B8485B] link-underline">Back to log in</Link>
            </p>
        </>
    );
}

export default function ForgotPasswordPage() {
    return (
        <div className="mt-24 my-container mx-auto">
            <div className="container mx-auto px-4 pt-6 pb-16">
                <div className="mx-auto max-w-md rounded-3xl bg-white p-6 sm:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
                    <ForgotPasswordForm/>
                </div>
            </div>
        </div>
    );
}
