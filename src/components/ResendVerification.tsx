"use client";

import {useState} from "react";
import {AlertCircle, Loader2, MailCheck, Send} from "lucide-react";
import {manrope} from "@/app/fonts";

const INPUT = `${manrope.className} w-full h-12 px-4 rounded-xl bg-white text-[15px] text-[#12100F] placeholder:text-gray-400
    ring-1 ring-[#B8485B]/20 outline-none transition focus:ring-2 focus:ring-[#B8485B]/50`;

/**
 * Повторная отправка письма с подтверждением email.
 * Сервер отвечает одинаково для любого адреса, поэтому и здесь — одно нейтральное сообщение.
 */
export default function ResendVerification({defaultEmail = "", compact = false}: { defaultEmail?: string; compact?: boolean }) {
    const [email, setEmail] = useState(defaultEmail);
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        setError("");
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/resend-verification`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email: email.trim()}),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.message || data.error || "We couldn't send the email. Please try again.");
            setSent(true);
        } catch (err) {
            const text = err instanceof Error ? err.message : "";
            setError(text === "Failed to fetch" ? "We couldn't reach the server. Please try again." : text || "We couldn't send the email. Please try again.");
        } finally {
            setSending(false);
        }
    };

    if (sent) {
        return (
            <div role="status" className="flex items-start gap-3 rounded-2xl bg-[#EAF5EC] ring-1 ring-[#2F6B3F]/20 p-4 text-left">
                <MailCheck className="w-5 h-5 shrink-0 text-[#2F6B3F] mt-0.5" aria-hidden="true"/>
                <div className={`${manrope.className} text-sm text-[#1F4A2B]`}>
                    <p className="font-semibold">Check your inbox</p>
                    <p className="mt-0.5">
                        If <span className="font-semibold">{email.trim()}</span> is waiting for confirmation, a new link is on its way.
                        It can take a minute — check your spam folder too.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={submit} className="space-y-3 text-left">
            {!compact && (
                <label htmlFor="resend-email" className={`${manrope.className} block text-sm font-semibold text-[#12100F]`}>
                    Get a new confirmation link
                </label>
            )}
            <div className="flex flex-col sm:flex-row gap-2">
                <input
                    id="resend-email"
                    type="email"
                    required
                    autoComplete="email"
                    aria-label={compact ? "Email for a new confirmation link" : undefined}
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={INPUT}
                />
                <button type="submit" disabled={sending}
                        className={`${manrope.className} shrink-0 inline-flex items-center justify-center gap-2 h-12 px-5 rounded-full main-button-color text-white text-sm font-semibold shadow-sm cursor-pointer transition hover:brightness-110 disabled:opacity-70 disabled:cursor-wait`}>
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true"/> : <Send className="w-4 h-4" aria-hidden="true"/>}
                    {sending ? "Sending…" : "Send new link"}
                </button>
            </div>
            {error && (
                <p role="alert" className={`${manrope.className} flex items-center gap-2 text-sm text-[#B42318]`}>
                    <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true"/> {error}
                </p>
            )}
        </form>
    );
}
