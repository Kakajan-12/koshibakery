import {manrope, raleway} from "@/app/fonts";
import Image from "next/image";
import Link from "next/link";
import {ArrowRight, CalendarHeart, Clock, Mail, MapPin, Navigation, Phone, Sparkles, Store} from "lucide-react";

type OpenTime = {
    id: number;
    days: string;
    times: string;
};

type Contact = {
    address?: string;
    phone?: string;
    mail?: string;
};

// null — данные не загрузились. Страница всё равно открывается: часы и контакты — лишь её блоки
async function getJson<T>(path: string): Promise<T | null> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {cache: "no-store"});
        if (!res.ok) throw new Error(`${path} responded ${res.status}`);
        return await res.json();
    } catch (err) {
        console.error(`Failed to fetch ${path}:`, err);
        return null;
    }
}

// Только факты из текста о пекарне
const FACTS = [
    {icon: MapPin, label: "Central London"},
    {icon: CalendarHeart, label: "Since 2019"},
    {icon: Sparkles, label: "Time-honoured recipes"},
];

const SPECIALITIES = ["Elegant patisserie", "Rustic favourites", "Modern classics", "Custom cakes"];

const EYEBROW = `${manrope.className} text-xs uppercase tracking-[0.18em] text-[#B8485B]`;

const About = async () => {
    const [openTimes, contacts] = await Promise.all([
        getJson<OpenTime[]>("/api/open-time"),
        getJson<Contact[]>("/api/contact"),
    ]);
    const contact = contacts?.[0];
    const address = contact?.address?.trim();
    const phone = contact?.phone?.trim();
    const email = contact?.mail?.trim();

    return (
        <div className="flex flex-col">
            {/* 1. Первый экран */}
            <section className="my-container main-block-color pt-24 pb-8 lg:pt-14 lg:pb-0">
                <div className="container mx-auto px-4">
                    <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
                        <div className="hidden lg:flex justify-center">
                            <Image
                                // Увеличена нейросетью (Real-ESRGAN) из about_main.png 345×722 — исходник был мал для ретина-экранов
                                src="/images/about_main.webp"
                                alt="A tower of colourful macarons"
                                width={760}
                                height={1590}
                                priority
                                className="h-auto w-full max-w-[280px] xl:max-w-[320px] drop-shadow-xl"
                            />
                        </div>

                        <div className="space-y-6">
                            <p className={EYEBROW}>Our story · London</p>
                            <h1 className={`${raleway.className} text-4xl sm:text-5xl xl:text-6xl font-bold text-[#12100F] leading-tight`}>
                                About Us
                            </h1>
                            <p className={`${manrope.className} text-base sm:text-lg xl:text-xl text-[#3B302B] leading-relaxed`}>
                                We are a patisserie proudly located in the heart of central London, nestled on the vibrant
                                and diverse Edgware Road. Established in 2019, Koşi Bakery was born from a deep passion for
                                baking and a desire to share authentic flavours with our community. What started as a love
                                for traditional sweets soon evolved into a thriving bakery where quality, creativity, and
                                heritage come together.
                            </p>

                            <ul className="flex flex-wrap gap-3 pt-2">
                                {FACTS.map(({icon: Icon, label}) => (
                                    <li
                                        key={label}
                                        className={`${manrope.className} inline-flex items-center gap-2 h-10 px-4 rounded-full bg-white text-sm font-semibold text-[#12100F] shadow-sm`}
                                    >
                                        <Icon className="w-4 h-4 text-[#B8485B]" aria-hidden="true"/>
                                        {label}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Откуда название + 3. что мы печём */}
            <section className="my-container main-background-color py-14 lg:py-20">
                <div className="container mx-auto px-4">
                    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-stretch">
                        <div className="relative min-h-[360px] overflow-hidden rounded-3xl shadow-xl">
                            <Image
                                src="/images/about.webp"
                                alt="Inside Koşi Bakery"
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                        </div>

                        <div className="flex flex-col gap-6">
                            <div className="rounded-3xl main-block-color p-8 lg:p-10">
                                <p className={EYEBROW}>Our name</p>
                                <h2 className={`${raleway.className} mt-2 text-2xl lg:text-3xl font-bold text-[#12100F]`}>
                                    The story behind “Koşi”
                                </h2>
                                <blockquote className="mt-5 border-l-4 border-[#B8485B] pl-5">
                                    <p className={`${manrope.className} text-base lg:text-lg text-[#3B302B] leading-relaxed`}>
                                        The name “Koşi Bakery” carries personal significance. It originates from the
                                        small, culturally rich town of Koşi in Turkmenistan — the birthplace of our founder
                                        and the source of much of our culinary inspiration. We honour these roots by
                                        incorporating time-honoured recipes and techniques into many of our creations.
                                    </p>
                                </blockquote>
                            </div>

                            <div className="rounded-3xl bg-white p-8 lg:p-10 shadow-sm">
                                <p className={EYEBROW}>What we bake</p>
                                <h2 className={`${raleway.className} mt-2 text-2xl lg:text-3xl font-bold text-[#12100F]`}>
                                    A story in every bite
                                </h2>
                                <p className={`${manrope.className} mt-4 text-base lg:text-lg text-[#3B302B] leading-relaxed`}>
                                    From elegant patisserie items to rustic favourites and modern classics, our menu
                                    reflects both our Turkmen heritage and the multicultural spirit of London. Whether
                                    you&apos;re visiting for a sweet treat, a custom cake, or something truly unique, Koşi
                                    Bakery is your home for heartfelt, handcrafted baking.
                                </p>
                                <ul className="mt-5 flex flex-wrap gap-2">
                                    {SPECIALITIES.map((s) => (
                                        <li key={s} className={`${manrope.className} px-3 py-1.5 rounded-full bg-[#F6EEEC] text-sm text-[#12100F]`}>
                                            {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Приходите в гости */}
            <section className="my-container main-background-color pb-16 lg:pb-24">
                <div className="container mx-auto px-4">
                    <div className="rounded-3xl main-block-color p-8 lg:p-12">
                        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
                            <div className="space-y-5">
                                <p className={EYEBROW}>Visit us</p>
                                <h2 className={`${raleway.className} text-3xl lg:text-4xl font-bold text-[#12100F]`}>
                                    Come and say hello
                                </h2>
                                <p className={`${manrope.className} text-base lg:text-lg text-[#3B302B]`}>
                                    Drop in for something sweet, or order online and we&apos;ll have it ready for you.
                                </p>

                                <ul className={`${manrope.className} space-y-3 text-base text-[#12100F]`}>
                                    {address && (
                                        <li className="flex items-start gap-3">
                                            <MapPin className="w-5 h-5 shrink-0 text-[#B8485B] mt-0.5" aria-hidden="true"/>
                                            {address}
                                        </li>
                                    )}
                                    {phone && (
                                        <li className="flex items-center gap-3">
                                            <Phone className="w-5 h-5 shrink-0 text-[#B8485B]" aria-hidden="true"/>
                                            <a href={`tel:${phone.replace(/\s+/g, "")}`} className="link-underline">{phone}</a>
                                        </li>
                                    )}
                                    {email && (
                                        <li className="flex items-center gap-3">
                                            <Mail className="w-5 h-5 shrink-0 text-[#B8485B]" aria-hidden="true"/>
                                            <a href={`mailto:${email}`} className="link-underline">{email}</a>
                                        </li>
                                    )}
                                </ul>

                                <div className="flex flex-wrap gap-3 pt-3">
                                    <Link
                                        href="/menu"
                                        className={`${manrope.className} group inline-flex items-center gap-2 h-12 px-6 rounded-full main-button-color text-white font-semibold shadow-md transition hover:brightness-110`}
                                    >
                                        <Store className="w-5 h-5" aria-hidden="true"/>
                                        View menu
                                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true"/>
                                    </Link>
                                    <Link
                                        href="/custom"
                                        className={`${manrope.className} inline-flex items-center gap-2 h-12 px-6 rounded-full bg-white text-[#B8485B] font-semibold ring-1 ring-[#B8485B]/30 transition hover:ring-[#B8485B]`}
                                    >
                                        Order a custom cake
                                    </Link>
                                    {address && (
                                        <a
                                            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`${manrope.className} inline-flex items-center gap-2 h-12 px-6 rounded-full text-[#12100F] font-semibold transition hover:bg-white/60`}
                                        >
                                            <Navigation className="w-4 h-4 text-[#B8485B]" aria-hidden="true"/>
                                            Get directions
                                        </a>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-2xl bg-white p-6 lg:p-8 shadow-sm self-start w-full">
                                <h3 className={`${raleway.className} flex items-center gap-2 text-xl font-bold text-[#12100F]`}>
                                    <Clock className="w-5 h-5 text-[#B8485B]" aria-hidden="true"/>
                                    Opening hours
                                </h3>
                                {openTimes && openTimes.length > 0 ? (
                                    <dl className={`${manrope.className} mt-5 divide-y divide-[#F0E6E3]`}>
                                        {openTimes.map((item) => (
                                            <div key={item.id} className="flex items-center justify-between gap-4 py-3">
                                                <dt className="text-[#3B302B]">{item.days}</dt>
                                                <dd className="font-semibold text-[#12100F] tabular-nums lining-nums">{item.times}</dd>
                                            </div>
                                        ))}
                                    </dl>
                                ) : (
                                    <p className={`${manrope.className} mt-5 text-[#6F5E53]`}>
                                        Opening hours are temporarily unavailable. Please contact us or try again later.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
