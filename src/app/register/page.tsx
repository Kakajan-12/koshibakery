"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {AlertCircle, Check, Eye, EyeOff, Gift, Loader2, MailCheck, ShoppingBag, Truck, UserPlus} from "lucide-react";
import {manrope, raleway} from "@/app/fonts";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import {useAuth} from "@/app/context/AuthContext";
import AddressPicker from "@/components/AddressPicker";
import {formatAddress, PickedPlace} from "@/lib/places";

const INPUT = `${manrope.className} w-full h-12 px-4 rounded-xl bg-white text-[15px] text-[#12100F] placeholder:text-gray-400
    ring-1 ring-[#B8485B]/20 outline-none transition focus:ring-2 focus:ring-[#B8485B]/50`;
const LABEL = `${manrope.className} block text-sm font-semibold text-[#12100F] mb-1.5`;
const HINT = `${manrope.className} mt-1.5 text-xs text-[#6F5E53]`;

const PERKS = [
    {icon: ShoppingBag, text: "Faster checkout with saved details"},
    {icon: Truck, text: "Saved delivery addresses"},
    {icon: Gift, text: "Your order history in one place"},
];

export default function RegisterPage() {
    const [fname, setfName] = useState("");
    const [lname, setlName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Адрес выбирается из подсказок (components/AddressPicker.tsx)
    const [picked, setPicked] = useState<PickedPlace | null>(null);
    const [housenumber, setHouseNumber] = useState("");

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [sentTo, setSentTo] = useState<string | null>(null);

    const router = useRouter();
    const {status, setStatus} = useAuth();

    // Уже вошёл — регистрация не нужна
    useEffect(() => {
        if (status === "user") router.replace("/profile");
    }, [status, router]);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (submitting) return;
        setError("");

        if (!picked) {
            setError("Please choose your address from the suggestions.");
            return;
        }

        const address = formatAddress(picked, housenumber);
        setSubmitting(true);

        try {
            const checkRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/check-address`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({address}),
            });
            const checkData = await checkRes.json().catch(() => ({}));
            if (!checkRes.ok) throw new Error(checkData.error || "We couldn't check this address. Please try another one.");

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    fname: fname.trim(),
                    lname: lname.trim(),
                    address,
                    phone: phone.trim(),
                    email: email.trim(),
                    password,
                    latitude: picked.latitude,
                    longitude: picked.longitude,
                }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.message || data.error || "We couldn't create your account. Please try again.");

            // Сервер отвечает одинаково и для нового, и для уже занятого email — письмо уходит в любом случае
            setSentTo(email.trim());
            window.scrollTo({top: 0, behavior: "smooth"});
        } catch (err) {
            const text = err instanceof Error ? err.message : "";
            setError(text === "Failed to fetch"
                ? "We couldn't reach the server. Please check your connection and try again."
                : text || "We couldn't create your account. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mt-24 my-container mx-auto">
            <div className="container mx-auto px-4 pt-6 pb-16">
                <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] grid lg:grid-cols-[2fr_3fr]">
                    {/* Левая панель: зачем регистрироваться */}
                    <aside className="hidden lg:flex flex-col justify-between main-block-color p-10">
                        <div>
                            <p className={`${manrope.className} text-xs uppercase tracking-[0.18em] text-[#B8485B]`}>New here?</p>
                            <h2 className={`${raleway.className} mt-2 text-3xl font-bold text-[#12100F] leading-tight`}>
                                Join Koşi Bakery
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
                            className="mx-auto mt-8 w-full max-w-[280px] h-auto drop-shadow-xl"
                        />
                    </aside>

                    <div className="p-6 sm:p-10">
                        {sentTo ? (
                            <div role="status" className="flex flex-col items-center text-center py-10 gap-4">
                                <span className="w-16 h-16 rounded-full bg-[#EAF5EC] text-[#2F6B3F] flex items-center justify-center">
                                    <MailCheck className="w-8 h-8" aria-hidden="true"/>
                                </span>
                                <h1 className={`${raleway.className} text-2xl font-bold text-[#12100F]`}>Check your inbox</h1>
                                <p className={`${manrope.className} max-w-sm text-[#6F5E53]`}>
                                    We&apos;ve sent a confirmation link to <span className="font-semibold text-[#12100F] break-all">{sentTo}</span>.
                                    Open it to activate your account — the link is valid for 1 hour.
                                </p>
                                <p className={`${manrope.className} max-w-sm text-sm text-[#6F5E53]`}>
                                    Can&apos;t find it? Check your spam folder, or register again to get a new link.
                                </p>
                                <Link
                                    href="/login"
                                    className={`${manrope.className} mt-2 inline-flex items-center justify-center h-12 px-6 rounded-full main-button-color text-white font-semibold shadow-md transition hover:brightness-110`}
                                >
                                    Go to log in
                                </Link>
                            </div>
                        ) : (
                            <>
                                <h1 className={`${raleway.className} text-3xl font-bold text-[#12100F]`}>Create an account</h1>
                                <p className={`${manrope.className} mt-2 text-sm text-[#6F5E53]`}>
                                    Already have one?{" "}
                                    <Link href="/login" className="link-underline font-semibold text-[#B8485B]">Log in</Link>
                                </p>

                                {/* Регистрация через Google: имя и email из аккаунта Google, email уже подтверждён */}
                                {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
                                    <div className="mt-6 space-y-5">
                                        <GoogleSignInButton
                                            remember={false}
                                            text="signup_with"
                                            onSuccess={() => {
                                                setStatus("user");
                                                router.replace("/profile");
                                            }}
                                            onError={setError}
                                        />
                                        <div className={`${manrope.className} flex items-center gap-3 text-xs uppercase tracking-[0.14em] text-[#6F5E53]`}>
                                            <span className="h-px flex-1 bg-[#B8485B]/15"/>
                                            or with email
                                            <span className="h-px flex-1 bg-[#B8485B]/15"/>
                                        </div>
                                    </div>
                                )}

                                <form onSubmit={handleRegister} className="mt-6 space-y-5">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="reg-fname" className={LABEL}>First name</label>
                                            <input id="reg-fname" type="text" autoComplete="given-name" required maxLength={100}
                                                   value={fname} onChange={(e) => setfName(e.target.value)} className={INPUT}/>
                                        </div>
                                        <div>
                                            <label htmlFor="reg-lname" className={LABEL}>Last name</label>
                                            <input id="reg-lname" type="text" autoComplete="family-name" required maxLength={100}
                                                   value={lname} onChange={(e) => setlName(e.target.value)} className={INPUT}/>
                                        </div>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="reg-email" className={LABEL}>Email</label>
                                            <input id="reg-email" type="email" autoComplete="email" required maxLength={255}
                                                   value={email} onChange={(e) => setEmail(e.target.value)}
                                                   placeholder="you@example.com" className={INPUT}/>
                                        </div>
                                        <div>
                                            <label htmlFor="reg-phone" className={LABEL}>Phone</label>
                                            <input id="reg-phone" type="tel" autoComplete="tel" required maxLength={50}
                                                   value={phone} onChange={(e) => setPhone(e.target.value)}
                                                   placeholder="+44 7…" className={INPUT}/>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="reg-password" className={LABEL}>Password</label>
                                        <div className="relative">
                                            <input
                                                id="reg-password"
                                                type={showPassword ? "text" : "password"}
                                                autoComplete="new-password"
                                                required
                                                minLength={8}
                                                maxLength={72}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
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
                                        <p className={`${HINT} flex items-center gap-1 ${password.length >= 8 ? "text-[#2F6B3F]" : ""}`}>
                                            {password.length >= 8 && <Check className="w-3.5 h-3.5" aria-hidden="true"/>}
                                            At least 8 characters
                                        </p>
                                    </div>

                                    <AddressPicker
                                        id="reg-address"
                                        label="Delivery address"
                                        hint="We deliver within London. Choose your address from the list."
                                        required
                                        onChange={(place, house) => {
                                            setPicked(place);
                                            setHouseNumber(house);
                                        }}
                                    />

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
                                            ? <><Loader2 className="w-5 h-5 animate-spin" aria-hidden="true"/> Creating your account…</>
                                            : <><UserPlus className="w-5 h-5" aria-hidden="true"/> Create account</>}
                                    </button>

                                    <p className={`${manrope.className} text-xs text-center text-[#6F5E53]`}>
                                        By creating an account you agree to our{" "}
                                        <Link href="/termsandconditions" className="link-underline">Terms</Link> and{" "}
                                        <Link href="/privacypolicy" className="link-underline">Privacy Policy</Link>.
                                    </p>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
