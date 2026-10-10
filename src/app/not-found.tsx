import type {Metadata} from "next";
import Link from "next/link";
import {ArrowLeft, CakeSlice, Mail, ShoppingBag} from "lucide-react";
import {manrope, raleway} from "@/app/fonts";

export const metadata: Metadata = {
    title: "Page not found",
    robots: {index: false},
};

const PRIMARY_BTN = `${manrope.className} inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full main-button-color text-white text-[15px] font-semibold shadow-sm transition hover:brightness-110`;
const SECONDARY_BTN = `${manrope.className} inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-white text-[#B8485B] text-[15px] font-semibold ring-1 ring-[#B8485B]/30 transition hover:ring-[#B8485B]`;

// Неверная ссылка или удалённый товар
export default function NotFound() {
    return (
        <div className="mt-24 my-container mx-auto">
            <div className="container mx-auto px-4 pt-6 pb-16">
                <div className="main-block-color rounded-3xl px-6 py-14 sm:py-20 flex flex-col items-center text-center">
                    <div className="relative" aria-hidden="true">
                        <p className={`${raleway.className} select-none text-[96px] sm:text-[140px] font-bold leading-none text-[#B8485B]/15`}>404</p>
                        <span className="absolute inset-0 flex items-center justify-center">
                            <span className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-white text-[#B8485B] shadow-md">
                                <CakeSlice className="h-10 w-10 sm:h-12 sm:w-12"/>
                            </span>
                        </span>
                    </div>
                    <p className={`${manrope.className} mt-6 text-xs uppercase tracking-[0.18em] text-[#B8485B]`}>Page not found</p>
                    <h1 className={`${raleway.className} mt-2 text-3xl sm:text-4xl font-bold text-[#12100F]`}>This page isn&apos;t on the menu</h1>
                    <p className={`${manrope.className} mt-3 max-w-md text-[#6F5E53]`}>
                        The link may be old, or the page has moved. Our cakes and biscuits are still right where you left them.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                        <Link href="/menu" className={PRIMARY_BTN}><ShoppingBag className="w-4 h-4" aria-hidden="true"/> Browse the menu</Link>
                        <Link href="/" className={SECONDARY_BTN}><ArrowLeft className="w-4 h-4" aria-hidden="true"/> Back to home</Link>
                    </div>
                    <p className={`${manrope.className} mt-6 text-sm text-[#6F5E53]`}>
                        Looking for something specific?{" "}
                        <Link href="/contact" className="inline-flex items-center gap-1 font-semibold text-[#B8485B] link-underline">
                            <Mail className="w-3.5 h-3.5" aria-hidden="true"/> Contact us
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
