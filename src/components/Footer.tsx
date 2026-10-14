'use client';

import {useEffect, useState} from "react";
import {manrope, raleway} from "@/app/fonts";
import {Clock, Mail, MapPin, Phone} from "lucide-react";
import {FiFacebook, FiLinkedin} from "react-icons/fi";
import {FaInstagram, FaTelegram, FaTiktok, FaWhatsapp} from "react-icons/fa6";
import {RiTwitterXLine} from "react-icons/ri";
import {Skeleton} from "@/components/ui/skeleton";
import {safeHref} from "@/lib/html";
import Link from "next/link";
import Image from "next/image";
import CreamWave from "@/components/CreamWave";

interface Contact {
    id: number;
    address: string;
    phone: string;
    mail: string;
    map: string;
}

interface SocialLink {
    id: number;
    icon: string;
    url: string;
}

interface OpenTime {
    id: number;
    days: string;
    times: string;
}

const NAV = [
    {href: "/", label: "Home"},
    {href: "/menu", label: "Menu"},
    {href: "/custom", label: "Custom order"},
    {href: "/about", label: "About us"},
    {href: "/contact", label: "Contact us"},
];

const HEADING = `${raleway.className} text-white font-bold text-base lg:text-lg mb-4`;
const TEXT = `${manrope.className} text-sm text-white/80`;

// Каждый блок грузится отдельно: если что-то не загрузилось, остальной футер на месте
async function getJson<T>(path: string): Promise<T | null> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {cache: "no-store"});
        if (!res.ok) throw new Error(`${path} responded ${res.status}`);
        return await res.json();
    } catch {
        return null;
    }
}

export default function Footer() {
    const [contact, setContact] = useState<Contact | null>(null);
    const [links, setLinks] = useState<SocialLink[]>([]);
    const [hours, setHours] = useState<OpenTime[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            getJson<Contact[]>("/api/contact"),
            getJson<SocialLink[]>("/api/links"),
            getJson<OpenTime[]>("/api/open-time"),
        ]).then(([contactData, linksData, hoursData]) => {
            setContact(contactData?.[0] ?? null);
            setLinks(Array.isArray(linksData) ? linksData : []);
            setHours(Array.isArray(hoursData) ? hoursData : null);
            setLoading(false);
        });
    }, []);

    const address = contact?.address?.trim();
    const phone = contact?.phone?.trim();
    const email = contact?.mail?.trim();

    return (
        <footer className="my-container mx-auto pt-10">
            <CreamWave/>

            <div className="container mx-auto px-4">
                <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.3fr_1.1fr] lg:gap-12">
                    {/* О пекарне и соцсети */}
                    <div className="space-y-5">
                        <Link href="/" className={`${raleway.className} inline-block text-3xl font-bold text-white`}>
                            Koşi Bakery
                        </Link>
                        <p className={`${TEXT} max-w-xs leading-relaxed`}>
                            Handcrafted cakes and patisserie, baked with love in central London since 2019.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <SocialLinks links={links} loading={loading}/>
                        </div>
                    </div>

                    <nav aria-label="Footer">
                        <h2 className={HEADING}>Explore</h2>
                        <ul className="space-y-2.5">
                            {NAV.map((item) => (
                                <li key={item.href}>
                                    <Link href={item.href} className={`${TEXT} link-underline hover:text-white transition-colors`}>
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div>
                        <h2 className={HEADING}>Contact</h2>
                        <ul className="space-y-3.5">
                            <ContactItem
                                icon={MapPin}
                                text={address}
                                href={address ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}` : undefined}
                                external
                                loading={loading}
                            />
                            <ContactItem icon={Phone} text={phone} href={phone ? `tel:${phone.replace(/\s+/g, "")}` : undefined} loading={loading}/>
                            <ContactItem icon={Mail} text={email} href={email ? `mailto:${email}` : undefined} loading={loading}/>
                        </ul>
                    </div>

                    <div>
                        <h2 className={HEADING}>Opening hours</h2>
                        {loading ? (
                            <div className="space-y-3">
                                <Skeleton tone="dark" className="h-4 w-full"/>
                                <Skeleton tone="dark" className="h-4 w-4/5"/>
                            </div>
                        ) : hours && hours.length > 0 ? (
                            <dl className="space-y-3">
                                {hours.map((h) => (
                                    <div key={h.id} className="flex items-start gap-3">
                                        <Clock className="w-4 h-4 shrink-0 mt-0.5 text-white/60" aria-hidden="true"/>
                                        <div>
                                            <dt className={TEXT}>{h.days}</dt>
                                            <dd className={`${manrope.className} text-sm font-semibold text-white tabular-nums lining-nums`}>{h.times}</dd>
                                        </div>
                                    </div>
                                ))}
                            </dl>
                        ) : (
                            <p className={TEXT}>Please contact us for opening hours.</p>
                        )}
                    </div>
                </div>

                <div className={`${manrope.className} flex flex-col items-center gap-3 border-t border-white/15 py-6 text-xs sm:text-sm text-white/70 md:flex-row md:justify-between`}>
                    <p>© {new Date().getFullYear()} Koşi Bakery. All rights reserved.</p>
                    <div className="flex items-center gap-4">
                        <Link className="link-underline hover:text-white transition-colors" href="/termsandconditions">Terms &amp; Conditions</Link>
                        <span aria-hidden="true" className="text-white/30">·</span>
                        <Link className="link-underline hover:text-white transition-colors" href="/privacypolicy">Privacy Policy</Link>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span>Powered by</span>
                        <Image src="/hebent_logo.svg" alt="" width={50} height={50} className="w-4" aria-hidden="true"/>
                        <Link
                            href="https://hebent.tech"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link-underline text-white hover:text-white"
                        >
                            Hebent Tech
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function ContactItem({icon: Icon, text, href, external, loading}: {
    icon: React.ComponentType<{ className?: string }>;
    text?: string;
    href?: string;
    external?: boolean;
    loading?: boolean;
}) {
    return (
        <li className="flex items-start gap-3">
            <Icon className="w-4 h-4 shrink-0 mt-0.5 text-white/60" aria-hidden="true"/>
            {loading ? (
                <Skeleton tone="dark" className="h-4 w-40"/>
            ) : !text ? (
                <span className={TEXT}>—</span>
            ) : href ? (
                <a
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className={`group ${TEXT} hover:text-white transition-colors`}
                >
                    {/* Полоска на строчном span: у длинного адреса она идёт под каждой строкой текста */}
                    <span className="link-underline">{text}</span>
                </a>
            ) : (
                <span className={TEXT}>{text}</span>
            )}
        </li>
    );
}

const ICONS: Record<string, { icon: React.ReactNode; label: string }> = {
    instagram: {icon: <FaInstagram size={18}/>, label: "Instagram"},
    facebook: {icon: <FiFacebook size={18}/>, label: "Facebook"},
    linkedin: {icon: <FiLinkedin size={18}/>, label: "LinkedIn"},
    twitter: {icon: <RiTwitterXLine size={18}/>, label: "X"},
    x: {icon: <RiTwitterXLine size={18}/>, label: "X"},
    tiktok: {icon: <FaTiktok size={18}/>, label: "TikTok"},
    whatsapp: {icon: <FaWhatsapp size={18}/>, label: "WhatsApp"},
    telegram: {icon: <FaTelegram size={18}/>, label: "Telegram"},
};

function SocialLinks({links, loading}: { links: SocialLink[]; loading?: boolean }) {
    if (loading) {
        return <>{Array.from({length: 3}).map((_, i) => <Skeleton key={i} tone="dark" className="size-10 rounded-full"/>)}</>;
    }

    return (
        <>
            {/* Ссылки из админки: javascript: и прочие небезопасные адреса, а также неизвестные иконки не выводим */}
            {links
                .filter((item) => safeHref(item.url) && ICONS[item.icon?.toLowerCase()])
                .map((item) => {
                    const {icon, label} = ICONS[item.icon.toLowerCase()];
                    return (
                        <Link
                            key={item.id}
                            href={safeHref(item.url)!}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={label}
                            title={label}
                            className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center transition-colors
                                       hover:bg-white hover:text-[#B8485B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                        >
                            {icon}
                        </Link>
                    );
                })}
        </>
    );
}
