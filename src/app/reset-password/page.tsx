"use client";

import {Suspense, useEffect, useState} from "react";
import {useSearchParams} from "next/navigation";
import Link from "next/link";
import {AlertCircle, Check, Clock, Eye, EyeOff, KeyRound, Link2Off, Loader2, LogIn} from "lucide-react";
import {manrope, raleway} from "@/app/fonts";
import {Skeleton} from "@/components/ui/skeleton";
import {rememberEmail} from "@/lib/prefillEmail";

const MIN_LENGTH = 8;
const INPUT = `${manrope.className} w-full h-12 px-4 pr-12 rounded-xl bg-white text-[15px] text-[#12100F] placeholder:text-gray-400
    ring-1 ring-[#B8485B]/20 outline-none transition focus:ring-2 focus:ring-[#B8485B]/50`;
const LABEL = `${manrope.className} block text-sm font-semibold text-[#12100F] mb-1.5`;
const PRIMARY_BTN = `${manrope.className} inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full main-button-color text-white text-[15px] font-semibold shadow-sm transition hover:brightness-110`;

type State =
    | { kind: "checking" }
    | { kind: "form"; email: string }
    | { kind: "done"; email: string }
    | { kind: "expired" | "invalid" | "network" };

const api = (path: string) => `${process.env.NEXT_PUBLIC_API_URL}${path}`;

function PasswordInput({id, label, value, onChange, autoFocus}: {
    id: string; label: string; value: string; onChange: (v: string) => void; autoFocus?: boolean;
}) {
    const [show, setShow] = useState(false);
    return (
        <div>
            <label htmlFor={id} className={LABEL}>{label}</label>
            <div className="relative">
                <input id={id} type={show ? "text" : "password"} required minLength={MIN_LENGTH} autoComplete="new-password"
                       autoFocus={autoFocus} value={value} onChange={(e) => onChange(e.target.value)} className={INPUT}/>
                <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? "Hide password" : "Show password"}
                        className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 hover:text-[#B8485B] cursor-pointer">
                    {show ? <EyeOff className="size-4"/> : <Eye className="size-4"/>}
                </button>
            </div>
        </div>
    );
}

function ResetPasswordForm() {
    const token = useSearchParams().get("token");
    const [state, setState] = useState<State>(token ? {kind: "checking"} : {kind: "invalid"});
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // Сначала проверяем ссылку, чтобы не просить придумать пароль по уже недействительной
    useEffect(() => {
        if (!token) return;
        let cancelled = false;
        fetch(api(`/api/auth/reset-password?token=${encodeURIComponent(token)}`))
            .then(async (res) => {
                const data = await res.json().catch(() => ({}));
                if (cancelled) return;
                if (res.ok) setState({kind: "form", email: data.email ?? ""});
                else if (res.status === 400) setState({kind: data.code === "expired" ? "expired" : "invalid"});
                else setState({kind: "network"});
            })
            .catch(() => !cancelled && setState({kind: "network"}));
        return () => {
            cancelled = true;
        };
    }, [token]);

    const tooShort = password.length > 0 && password.length < MIN_LENGTH;
    const mismatch = confirm.length > 0 && confirm !== password;

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (state.kind !== "form" || password.length < MIN_LENGTH || password !== confirm) return;
        setSaving(true);
        setError("");
        try {
            const res = await fetch(api("/api/auth/reset-password"), {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({token, password}),
            });
            const data = await res.json().catch(() => ({}));
            if (res.ok) {
                setState({kind: "done", email: data.email ?? state.email});
            } else if (data.code === "expired" || data.code === "invalid") {
                setState({kind: data.code});
            } else {
                setError(data.message || data.error || "We couldn't change your password. Please try again.");
            }
        } catch {
            setError("We couldn't reach the server. Please check your connection and try again.");
        } finally {
            setSaving(false);
        }
    };

    if (state.kind === "checking") {
        return (
            <div className="space-y-4" aria-busy="true" aria-label="Checking your link">
                <Skeleton className="h-14 w-14 rounded-full"/>
                <Skeleton className="h-8 w-64"/>
                <Skeleton className="h-12 w-full rounded-xl"/>
                <Skeleton className="h-12 w-full rounded-xl"/>
            </div>
        );
    }

    if (state.kind === "done") {
        const loginHref = "/login?reset=1";
        return (
            <div className="flex flex-col items-center text-center" role="status">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#2F6B3F] text-white shadow-sm">
                    <Check className="h-8 w-8" strokeWidth={3} aria-hidden="true"/>
                </span>
                <h1 className={`${raleway.className} mt-5 text-2xl sm:text-3xl font-bold text-[#12100F]`}>Password changed</h1>
                <p className={`${manrope.className} mt-3 text-[#6F5E53]`}>
                    You can now log in with your new password. For your security, you&apos;ve been logged out on all other devices.
                </p>
                <Link href={loginHref} onClick={() => rememberEmail(state.email)} className={`${PRIMARY_BTN} mt-8`}><LogIn className="w-4 h-4" aria-hidden="true"/> Log in</Link>
            </div>
        );
    }

    if (state.kind !== "form") {
        const expired = state.kind === "expired";
        const network = state.kind === "network";
        return (
            <div className="flex flex-col items-center text-center">
                <span className={`flex h-16 w-16 items-center justify-center rounded-full ${expired || network ? "bg-[#FFF1DE] text-[#9A5B13]" : "bg-[#FEF3F2] text-[#B42318]"}`}>
                    {expired ? <Clock className="h-8 w-8" aria-hidden="true"/> : network ? <AlertCircle className="h-8 w-8" aria-hidden="true"/> : <Link2Off className="h-8 w-8" aria-hidden="true"/>}
                </span>
                <h1 className={`${raleway.className} mt-5 text-2xl sm:text-3xl font-bold text-[#12100F]`}>
                    {expired ? "This link has expired" : network ? "Something went wrong" : "This link isn't valid"}
                </h1>
                <p className={`${manrope.className} mt-3 text-[#6F5E53]`}>
                    {expired
                        ? "Reset links work for 60 minutes. Request a new one and we'll email it right away."
                        : network
                            ? "We couldn't reach the server. Your link may still work — please try again in a moment."
                            : "It may have been used already, or it's from an older email. Request a new link to reset your password."}
                </p>
                {network ? (
                    <button type="button" onClick={() => window.location.reload()} className={`${PRIMARY_BTN} mt-8 cursor-pointer`}>Try again</button>
                ) : (
                    <Link href="/forgot-password" className={`${PRIMARY_BTN} mt-8`}>Get a new link</Link>
                )}
                <Link href="/login" className={`${manrope.className} mt-4 text-sm font-semibold text-[#B8485B] link-underline`}>Back to log in</Link>
            </div>
        );
    }

    return (
        <>
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#B8485B]/10 text-[#B8485B]">
                <KeyRound className="h-7 w-7" aria-hidden="true"/>
            </span>
            <h1 className={`${raleway.className} mt-5 text-2xl sm:text-3xl font-bold text-[#12100F]`}>Choose a new password</h1>
            {state.email && (
                <p className={`${manrope.className} mt-2 text-[#6F5E53]`}>
                    For <span className="font-semibold text-[#12100F]">{state.email}</span>
                </p>
            )}
            <form onSubmit={submit} className="mt-8 space-y-5">
                {/* Скрытое поле логина — менеджер паролей сохранит новый пароль к нужному аккаунту */}
                <input type="email" name="email" autoComplete="username" value={state.email} readOnly hidden/>
                <div>
                    <PasswordInput id="new-password" label="New password" value={password} onChange={setPassword} autoFocus/>
                    <p className={`${manrope.className} mt-1.5 text-xs ${tooShort ? "text-[#B42318]" : "text-[#6F5E53]"}`}>
                        At least {MIN_LENGTH} characters.
                    </p>
                </div>
                <div>
                    <PasswordInput id="confirm-password" label="Repeat new password" value={confirm} onChange={setConfirm}/>
                    {mismatch && <p className={`${manrope.className} mt-1.5 text-xs text-[#B42318]`}>Passwords don&apos;t match.</p>}
                </div>
                {error && (
                    <div role="alert" className="flex items-start gap-3 rounded-2xl bg-[#FEF3F2] ring-1 ring-[#B42318]/20 p-4">
                        <AlertCircle className="w-5 h-5 shrink-0 text-[#B42318] mt-0.5" aria-hidden="true"/>
                        <p className={`${manrope.className} text-sm text-[#912018]`}>{error}</p>
                    </div>
                )}
                <button type="submit" disabled={saving || password.length < MIN_LENGTH || password !== confirm}
                        className={`${manrope.className} w-full inline-flex items-center justify-center gap-2 h-12 rounded-full main-button-color text-white text-base font-semibold shadow-md cursor-pointer transition hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed`}>
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true"/> : <Check className="w-5 h-5" aria-hidden="true"/>}
                    {saving ? "Saving…" : "Save new password"}
                </button>
            </form>
        </>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="mt-24 my-container mx-auto">
            <div className="container mx-auto px-4 pt-6 pb-16">
                <div className="mx-auto max-w-md rounded-3xl bg-white p-6 sm:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
                    <Suspense fallback={<Skeleton className="h-64 w-full rounded-2xl"/>}>
                        <ResetPasswordForm/>
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
