"use client";

import {Suspense, useEffect, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {AlertCircle, CheckCircle2, Eye, EyeOff, Loader2, LogIn, ShoppingBag, Sparkles, Truck} from "lucide-react";
import {manrope, raleway} from "@/app/fonts";
import {useAuth} from "@/app/context/AuthContext";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import ResendVerification from "@/components/ResendVerification";
import {rememberEmail, takeEmail} from "@/lib/prefillEmail";

// Ответ сервера для неподтверждённой почты (controllers/login/userLoginController.js)
const VERIFY_FIRST = "Please verify your email first.";

const INPUT = `${manrope.className} w-full h-12 px-4 rounded-xl bg-white text-[15px] text-[#12100F] placeholder:text-gray-400
    ring-1 ring-[#B8485B]/20 outline-none transition focus:ring-2 focus:ring-[#B8485B]/50`;
const LABEL = `${manrope.className} block text-sm font-semibold text-[#12100F] mb-1.5`;

const PERKS = [
    {icon: ShoppingBag, text: "Faster checkout with saved details"},
    {icon: Truck, text: "Saved delivery addresses"},
    {icon: Sparkles, text: "Your order history in one place"},
];

// Куда вернуть после входа: только путь внутри сайта. «//evil.com» и «https://…» отбрасываем —
// иначе ссылка вида /login?next=https://evil.com уводила бы на чужой сайт после входа
const safeNext = (value: string | null) =>
    value && value.startsWith("/") && !value.startsWith("//") && !value.startsWith("/\\") ? value : "/profile";

function LoginForm() {
    const params = useSearchParams();
    const [email, setEmail] = useState("");
    const justVerified = params.get("verified") === "1";
    const justReset = params.get("reset") === "1";
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    // «Remember me»: вход на 30 дней; без галочки — до закрытия браузера
    const [remember, setRemember] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const next = safeNext(params.get("next"));
    const fromCart = next === "/cart";
    const {status, setStatus} = useAuth();

    // После подтверждения почты или смены пароля адрес не нужно вводить заново (lib/prefillEmail.ts)
    useEffect(() => {
        const remembered = takeEmail();
        if (remembered) setEmail(remembered);
    }, []);

    // Уже вошёл — форма не нужна
    useEffect(() => {
        if (status === "user") router.replace(next);
    }, [status, next, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (submitting) return;
        setSubmitting(true);
        setError("");

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                // Сервер ставит httpOnly-cookie с токеном — сам токен странице не виден
                credentials: "include",
                body: JSON.stringify({email: email.trim(), password, remember}),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                // Неверный пароль — message; лимит попыток (429) — error
                throw new Error(data.message || data.error || "We couldn't log you in. Please try again.");
            }

            setStatus("user");
            router.replace(next);
        } catch (err) {
            const text = err instanceof Error ? err.message : "";
            setError(text === "Failed to fetch"
                ? "We couldn't reach the server. Please check your connection and try again."
                : text === "Incorrect credentials"
                    ? "The email or password is incorrect."
                    : text || "We couldn't log you in. Please try again.");
            setSubmitting(false);
        }
    };

    return (
        <div className="mt-24 my-container mx-auto">
            <div className="container mx-auto px-4 pt-6 pb-16">
                <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] grid lg:grid-cols-2">
                    {/* Левая панель: зачем входить */}
                    <aside className="relative hidden lg:flex flex-col justify-between main-block-color p-10">
                        <div>
                            <p className={`${manrope.className} text-xs uppercase tracking-[0.18em] text-[#B8485B]`}>Your account</p>
                            <h2 className={`${raleway.className} mt-2 text-3xl font-bold text-[#12100F] leading-tight`}>
                                Sweet to see you again
                            </h2>
                            <ul className="mt-6 space-y-3">
                                {PERKS.map(({icon: Icon, text}) => (
                                    <li key={text} className={`${manrope.className} flex items-center gap-3 text-[15px] text-[#3B302B]`}>
                                        <span className="w-9 h-9 shrink-0 rounded-full bg-white text-[#B8485B] flex items-center justify-center shadow-sm">
                                            <Icon className="w-4 h-4" aria-hidden="true"/>
                                        </span>
                                        {text}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <Image
                            src="/images/menu_hero.webp"
                            alt=""
                            aria-hidden="true"
                            width={1010}
                            height={1006}
                            className="mx-auto mt-8 w-full max-w-[320px] h-auto drop-shadow-xl"
                        />
                    </aside>

                    {/* Форма */}
                    <div className="p-6 sm:p-10 flex flex-col justify-center">
                        <h1 className={`${raleway.className} text-3xl font-bold text-[#12100F]`}>Log in</h1>
                        <p className={`${manrope.className} mt-2 text-sm text-[#6F5E53]`}>
                            {fromCart
                                ? "Log in to finish your order — your cart is saved."
                                : "Welcome back! Enter your details to continue."}
                        </p>

                        {(justVerified || justReset) && (
                            <div role="status" className="mt-6 flex items-start gap-3 rounded-2xl bg-[#EAF5EC] ring-1 ring-[#2F6B3F]/20 p-4">
                                <CheckCircle2 className="w-5 h-5 shrink-0 text-[#2F6B3F] mt-0.5" aria-hidden="true"/>
                                <p className={`${manrope.className} text-sm text-[#1F4A2B]`}>
                                    {justReset
                                        ? "Your password has been changed. Log in with your new password."
                                        : "Your email is confirmed. Enter your password to log in."}
                                </p>
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="mt-8 space-y-5">
                            <div>
                                <label htmlFor="login-email" className={LABEL}>Email</label>
                                <input
                                    id="login-email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className={INPUT}
                                />
                            </div>

                            <div>
                                <div className="flex items-baseline justify-between gap-3">
                                    <label htmlFor="login-password" className={LABEL}>Password</label>
                                    <Link
                                        href="/forgot-password"
                                        onClick={() => rememberEmail(email)}
                                        className={`${manrope.className} text-sm font-semibold text-[#B8485B] link-underline`}
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <input
                                        id="login-password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Your password"
                                        className={`${INPUT} pr-12`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((v) => !v)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        title={showPassword ? "Hide password" : "Show password"}
                                        className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 hover:text-[#B8485B] cursor-pointer"
                                    >
                                        {showPassword ? <EyeOff className="size-4"/> : <Eye className="size-4"/>}
                                    </button>
                                </div>
                            </div>

                            {/* Текст — одним блоком рядом с галочкой: иначе flex делал из него две колонки на телефоне */}
                            <label className={`${manrope.className} flex items-start gap-2.5 w-fit cursor-pointer select-none text-sm text-[#3B302B]`}>
                                <input
                                    type="checkbox"
                                    checked={remember}
                                    onChange={(e) => setRemember(e.target.checked)}
                                    className="size-4 mt-0.5 shrink-0 accent-[#B8485B] cursor-pointer"
                                />
                                <span>
                                    Remember me <span className="text-[#6F5E53]">— stay logged in for 30 days</span>
                                </span>
                            </label>

                            {error && (
                                <div role="alert" className="flex items-start gap-3 rounded-2xl bg-[#FEF3F2] ring-1 ring-[#B42318]/20 p-4">
                                    <AlertCircle className="w-5 h-5 shrink-0 text-[#B42318] mt-0.5" aria-hidden="true"/>
                                    <p className={`${manrope.className} text-sm text-[#912018]`}>{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={submitting}
                                className={`${manrope.className} w-full inline-flex items-center justify-center gap-2 h-12 rounded-full
                                            main-button-color text-white text-base font-semibold shadow-md cursor-pointer transition
                                            hover:brightness-110 hover:shadow-lg disabled:opacity-70 disabled:cursor-wait
                                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8485B]/50 focus-visible:ring-offset-2`}
                            >
                                {submitting
                                    ? <><Loader2 className="w-5 h-5 animate-spin" aria-hidden="true"/> Logging in…</>
                                    : <><LogIn className="w-5 h-5" aria-hidden="true"/> Log in</>}
                            </button>
                        </form>

                        {/* Почта не подтверждена — сразу предлагаем новую ссылку, без поиска старого письма */}
                        {error === VERIFY_FIRST && (
                            <div className="mt-4 rounded-2xl bg-[#FBF7F6] p-4">
                                <p className={`${manrope.className} mb-3 text-sm text-[#3B302B]`}>
                                    Can&apos;t find the confirmation email? We&apos;ll send a new link.
                                </p>
                                <ResendVerification defaultEmail={email} compact/>
                            </div>
                        )}

                        {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
                            <div className="mt-6 space-y-4">
                                <div className={`${manrope.className} flex items-center gap-3 text-xs uppercase tracking-[0.14em] text-[#6F5E53]`}>
                                    <span className="h-px flex-1 bg-[#B8485B]/15"/>
                                    or
                                    <span className="h-px flex-1 bg-[#B8485B]/15"/>
                                </div>
                                <GoogleSignInButton
                                    remember={remember}
                                    text="continue_with"
                                    onSuccess={() => {
                                        setStatus("user");
                                        router.replace(next);
                                    }}
                                    onError={setError}
                                />
                            </div>
                        )}

                        <p className={`${manrope.className} mt-6 text-sm text-[#6F5E53] text-center`}>
                            New to Koşi Bakery?{" "}
                            <Link href="/register" className="link-underline font-semibold text-[#B8485B]">
                                Create an account
                            </Link>
                        </p>
                        {fromCart && (
                            <p className={`${manrope.className} mt-2 text-sm text-[#6F5E53] text-center`}>
                                Or{" "}
                                <Link href="/cart" className="link-underline font-semibold text-[#B8485B]">
                                    continue as a guest
                                </Link>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// useSearchParams требует Suspense при сборке страницы
export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen"/>}>
            <LoginForm/>
        </Suspense>
    );
}
