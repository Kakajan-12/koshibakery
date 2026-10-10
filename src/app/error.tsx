"use client";

import {useEffect} from "react";
import Link from "next/link";
import {ArrowLeft, RotateCcw, TriangleAlert} from "lucide-react";
import {manrope, raleway} from "@/app/fonts";

const PRIMARY_BTN = `${manrope.className} inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full main-button-color text-white text-[15px] font-semibold shadow-sm cursor-pointer transition hover:brightness-110`;
const SECONDARY_BTN = `${manrope.className} inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-white text-[#B8485B] text-[15px] font-semibold ring-1 ring-[#B8485B]/30 transition hover:ring-[#B8485B]`;

// Непредвиденная ошибка на странице. Шапка и подвал остаются — покупатель может уйти в другой раздел.
export default function PageError({error, reset}: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="mt-24 my-container mx-auto">
            <div className="container mx-auto px-4 pt-6 pb-16">
                <div className="main-block-color rounded-3xl px-6 py-14 sm:py-20 flex flex-col items-center text-center" role="alert">
                    <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#FFF1DE] text-[#9A5B13] shadow-sm">
                        <TriangleAlert className="h-10 w-10" aria-hidden="true"/>
                    </span>
                    <p className={`${manrope.className} mt-6 text-xs uppercase tracking-[0.18em] text-[#B8485B]`}>Something went wrong</p>
                    <h1 className={`${raleway.className} mt-2 text-3xl sm:text-4xl font-bold text-[#12100F]`}>We couldn&apos;t load this page</h1>
                    <p className={`${manrope.className} mt-3 max-w-md text-[#6F5E53]`}>
                        Sorry about that — it&apos;s on our side, not yours. Please try again; if it keeps happening, come back a little later.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                        <button type="button" onClick={reset} className={PRIMARY_BTN}><RotateCcw className="w-4 h-4" aria-hidden="true"/> Try again</button>
                        <Link href="/" className={SECONDARY_BTN}><ArrowLeft className="w-4 h-4" aria-hidden="true"/> Back to home</Link>
                    </div>
                    {error.digest && (
                        <p className={`${manrope.className} mt-6 text-xs text-[#6F5E53]`}>
                            Error reference: <span className="font-mono">{error.digest}</span>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
