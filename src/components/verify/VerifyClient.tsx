"use client";

import {useEffect, useState} from "react";
import {useSearchParams} from "next/navigation";
import Link from "next/link";
import {Check, Clock, Link2Off, Loader2, LogIn, ShoppingBag, WifiOff} from "lucide-react";
import {manrope, raleway} from "@/app/fonts";
import {useAuth} from "@/app/context/AuthContext";
import ResendVerification from "@/components/ResendVerification";
import {rememberEmail} from "@/lib/prefillEmail";

type State =
    | { kind: "loading" }
    | { kind: "verified" | "already_verified"; email: string }
    | { kind: "expired" | "invalid" | "network" };

const PRIMARY_BTN = `${manrope.className} inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full main-button-color text-white text-[15px] font-semibold shadow-sm transition hover:brightness-110`;
const SECONDARY_BTN = `${manrope.className} inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-white text-[#B8485B] text-[15px] font-semibold ring-1 ring-[#B8485B]/30 transition hover:ring-[#B8485B] cursor-pointer`;

function Badge({tone, children}: { tone: "success" | "warning" | "error"; children: React.ReactNode }) {
    const colors = {
        success: "bg-[#2F6B3F] text-white",
        warning: "bg-[#FFF1DE] text-[#9A5B13]",
        error: "bg-[#FEF3F2] text-[#B42318]",
    }[tone];
    return <span className={`flex h-20 w-20 items-center justify-center rounded-full shadow-sm ${colors}`}>{children}</span>;
}

export default function VerifyClient() {
    const token = useSearchParams().get("token");
    const {status} = useAuth();
    const [state, setState] = useState<State>(token ? {kind: "loading"} : {kind: "invalid"});
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        if (!token) return;
        let cancelled = false;
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify?token=${encodeURIComponent(token)}`)
            .then(async (res) => {
                const data = await res.json().catch(() => ({}));
                if (cancelled) return;
                if (res.ok && (data.status === "verified" || data.status === "already_verified")) {
                    setState({kind: data.status, email: data.email ?? ""});
                } else if (res.status === 400) {
                    setState({kind: data.code === "expired" ? "expired" : "invalid"});
                } else {
                    setState({kind: "network"});
                }
            })
            .catch(() => !cancelled && setState({kind: "network"}));
        return () => {
            cancelled = true;
        };
    }, [token, attempt]);

    let content: React.ReactNode;

    if (state.kind === "loading") {
        content = (
            <div aria-busy="true" className="flex flex-col items-center">
                <Badge tone="warning"><Loader2 className="h-9 w-9 animate-spin" aria-hidden="true"/></Badge>
                <h1 className={`${raleway.className} mt-6 text-2xl sm:text-3xl font-bold text-[#12100F]`}>Confirming your email…</h1>
                <p className={`${manrope.className} mt-2 text-[#6F5E53]`}>This only takes a second.</p>
            </div>
        );
    } else if (state.kind === "verified" || state.kind === "already_verified") {
        const loggedIn = status === "user";
        const loginHref = "/login?verified=1";
        const email = state.email;
        content = (
            <div className="flex flex-col items-center">
                <Badge tone="success"><Check className="h-10 w-10" strokeWidth={3} aria-hidden="true"/></Badge>
                <p className={`${manrope.className} mt-6 text-xs uppercase tracking-[0.18em] text-[#B8485B]`}>
                    {state.kind === "verified" ? "All set" : "Nothing to do"}
                </p>
                <h1 className={`${raleway.className} mt-2 text-2xl sm:text-3xl font-bold text-[#12100F]`}>
                    {state.kind === "verified" ? "Your email is confirmed!" : "Your email is already confirmed"}
                </h1>
                <p className={`${manrope.className} mt-3 max-w-md text-[#6F5E53]`}>
                    {state.kind === "verified"
                        ? <>Welcome to Koşi Bakery{state.email && <> — your account <span className="font-semibold text-[#12100F]">{state.email}</span> is ready</>}. Log in to start ordering.</>
                        : "This link has already been used. You can log in to your account."}
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                    {loggedIn ? (
                        <Link href="/menu" className={PRIMARY_BTN}><ShoppingBag className="w-4 h-4" aria-hidden="true"/> Browse the menu</Link>
                    ) : (
                        <>
                            <Link href={loginHref} onClick={() => rememberEmail(email)} className={PRIMARY_BTN}><LogIn className="w-4 h-4" aria-hidden="true"/> Log in</Link>
                            <Link href="/menu" className={SECONDARY_BTN}>Browse the menu</Link>
                        </>
                    )}
                </div>
            </div>
        );
    } else if (state.kind === "network") {
        content = (
            <div className="flex flex-col items-center">
                <Badge tone="warning"><WifiOff className="h-9 w-9" aria-hidden="true"/></Badge>
                <h1 className={`${raleway.className} mt-6 text-2xl sm:text-3xl font-bold text-[#12100F]`}>We couldn&apos;t confirm your email</h1>
                <p className={`${manrope.className} mt-3 max-w-md text-[#6F5E53]`}>
                    Our server didn&apos;t respond. Your link is still fine — please try again in a moment.
                </p>
                <button type="button" onClick={() => {
                    setState({kind: "loading"});
                    setAttempt((a) => a + 1);
                }} className={`${PRIMARY_BTN} mt-8 cursor-pointer`}>
                    Try again
                </button>
            </div>
        );
    } else {
        const expired = state.kind === "expired";
        content = (
            <div className="flex flex-col items-center">
                <Badge tone={expired ? "warning" : "error"}>
                    {expired ? <Clock className="h-9 w-9" aria-hidden="true"/> : <Link2Off className="h-9 w-9" aria-hidden="true"/>}
                </Badge>
                <h1 className={`${raleway.className} mt-6 text-2xl sm:text-3xl font-bold text-[#12100F]`}>
                    {expired ? "This link has expired" : "This link isn't valid"}
                </h1>
                <p className={`${manrope.className} mt-3 max-w-md text-[#6F5E53]`}>
                    {expired
                        ? "Confirmation links work for 24 hours. Enter your email and we'll send you a fresh one."
                        : "It may be incomplete or from an older email. Make sure you opened the latest link, or request a new one below."}
                </p>
                <div className="mt-8 w-full max-w-md">
                    <ResendVerification/>
                </div>
                <p className={`${manrope.className} mt-6 text-sm text-[#6F5E53]`}>
                    Already confirmed?{" "}
                    <Link href="/login" className="link-underline font-semibold text-[#B8485B]">Log in</Link>
                </p>
            </div>
        );
    }

    return (
        <div className="mt-24 my-container mx-auto">
            <div className="container mx-auto px-4 pt-6 pb-16">
                <div className="mx-auto max-w-2xl rounded-3xl main-block-color px-6 py-12 sm:px-12 sm:py-16 text-center">
                    <div aria-live="polite">{content}</div>
                </div>
            </div>
        </div>
    );
}
