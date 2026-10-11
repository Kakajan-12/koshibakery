"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import Image from "next/image";
import {usePathname} from "next/navigation";
import {Menu, ShoppingBag, User, X} from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import {manrope} from "@/app/fonts";
import {useAuth} from "@/app/context/AuthContext";

const NAV_ITEMS = [
    {href: "/", label: "Home"},
    {href: "/menu", label: "Menu"},
    {href: "/custom", label: "Custom order"},
    {href: "/about", label: "About Us"},
    {href: "/contact", label: "Contact Us"},
];

// Главная активна только на "/", остальные — и на вложенных страницах (товар /menu/12 → Menu)
const isActive = (pathname: string, href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

// Наведение выглядит так же, как активный пункт: цвет, жирный шрифт и метка (подчёркивание / полоска слева).
// Жирный текст шире обычного — невидимая жирная копия подписи (::after из data-label)
// заранее держит нужную ширину, поэтому соседние пункты не дёргаются при наведении.
// Без transition: жирность у шрифта (только 400 и 700) переключается скачком, а плавный цвет
// догонял её с задержкой — наведение ощущалось как два эффекта подряд. Теперь всё меняется в одном кадре.
const LINK_BASE = `inline-flex flex-col hover:text-[#B8485B] hover:font-semibold
    after:content-[attr(data-label)] after:font-semibold after:h-0 after:invisible after:overflow-hidden`;
const ACTIVE = "text-[#B8485B] font-semibold";

const linkClass = (active: boolean, variant: "desktop" | "mobile") => {
    // Метка есть всегда, но прозрачная — текст не смещается, когда она появляется
    const mark = variant === "desktop"
        ? `underline decoration-2 underline-offset-8 hover:decoration-[#B8485B] ${active ? "decoration-[#B8485B]" : "decoration-transparent"}`
        : `border-l-2 pl-2 hover:border-[#B8485B] ${active ? "border-[#B8485B]" : "border-transparent"}`;
    return `${LINK_BASE} ${mark} ${active ? ACTIVE : ""}`;
};

// Иконки справа: один набор и размер, круглая кнопка 40×40 — по ней удобно попадать пальцем
const ICON_CLASS = "w-[22px] h-[22px]";
const iconButtonClass = (active: boolean) =>
    `inline-flex items-center justify-center w-8 h-8 rounded-sm cursor-pointer transition-colors
     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8485B]/50
     ${active ? "bg-[#B8485B]/10 text-[#B8485B]" : "text-gray-800 hover:bg-[#B8485B]/10 hover:text-[#B8485B]"}`;

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { cart } = useCart();
    const pathname = usePathname();
    // Гость сразу идёт на вход — без захода на /profile и перенаправления оттуда
    const {status: authStatus} = useAuth();
    const profileHref = authStatus === "guest" ? "/login" : "/profile";
    const closeMenu = () => setMenuOpen(false);

    // Меню закрывается при любом переходе (и по ссылкам вне меню: логотип, профиль, корзина) и по Esc
    useEffect(() => setMenuOpen(false), [pathname]);
    useEffect(() => {
        if (!menuOpen) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [menuOpen]);

    return (
        <header
            className={`w-full fixed top-0 z-50 bg-white shadow-md`}
        >
            <div
                className="container mx-auto px-4 py-2 flex items-center justify-between border-b border-black md:border-none">
                <Link
                    href="/"
                    onClick={closeMenu}
                    className="flex items-center gap-2 font-bold text-gray-900"
                >
                    <Image src="/icon.svg" alt="Logo" width={50} height={50}
                           className="w-20"/>
                </Link>

                <nav className="hidden md:flex space-x-6">
                    {NAV_ITEMS.map(({href, label}) => {
                        const active = isActive(pathname, href);
                        return (
                            <Link
                                key={href}
                                href={href}
                                aria-current={active ? "page" : undefined}
                                data-label={label}
                                className={linkClass(active, "desktop")}
                            >
                                {label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="flex items-center gap-1">
                    <Link href={profileHref} onClick={closeMenu} aria-label={authStatus === "guest" ? "Log in" : "Profile"} aria-current={isActive(pathname, "/profile") ? "page" : undefined}
                          className={iconButtonClass(isActive(pathname, "/profile"))}>
                        <User className={ICON_CLASS} strokeWidth={1.75}/>
                    </Link>
                    <Link href="/cart"
                          onClick={closeMenu}
                          aria-label={cart.length > 0 ? `Cart, ${cart.length} item${cart.length === 1 ? "" : "s"}` : "Cart"}
                          aria-current={isActive(pathname, "/cart") ? "page" : undefined}
                          className={`relative ${iconButtonClass(isActive(pathname, "/cart"))}`}>
                        <ShoppingBag className={ICON_CLASS} strokeWidth={1.75}/>
                        {cart.length > 0 && (
                            // Небольшой счётчик на углу кнопки, а не поверх иконки. Шрифт — Manrope с обычными цифрами:
                            // у Raleway (шрифт сайта) «старостильные» цифры, и они не стоят по центру
                            <span
                                aria-hidden="true"
                                className={`${manrope.className} absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1 flex items-center justify-center
                                            rounded-full bg-[#B8485B] text-white text-[10px] font-bold leading-none lining-nums tabular-nums
                                            ring-2 ring-white`}>
                                {cart.length > 99 ? "99+" : cart.length}
                            </span>
                        )}
                    </Link>
                    <button
                        type="button"
                        className={`md:hidden ${iconButtonClass(menuOpen)}`}
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={menuOpen}
                    >
                        {menuOpen
                            ? <X className={ICON_CLASS} strokeWidth={1.75}/>
                            : <Menu className={ICON_CLASS} strokeWidth={1.75}/>}
                    </button>
                </div>
            </div>

            {menuOpen && (
                <div className="md:hidden bg-white shadow-md border-t">
                    <nav className="flex flex-col p-4 space-y-4">
                        {NAV_ITEMS.map(({href, label}) => {
                            const active = isActive(pathname, href);
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    onClick={closeMenu}
                                    aria-current={active ? "page" : undefined}
                                    data-label={label}
                                    className={linkClass(active, "mobile")}
                                >
                                    {label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            )}
        </header>
    );
}
