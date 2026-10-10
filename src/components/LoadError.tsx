import {RotateCw, WifiOff} from "lucide-react";
import {manrope, raleway} from "@/app/fonts";

// Блок вместо данных, которые не загрузились (сервер недоступен). Занимает место самого блока,
// чтобы вёрстка не «проваливалась», и даёт повторить загрузку без перезагрузки страницы.
// tone="dark" — для бордового фона, "light" — для светлых карточек.
export default function LoadError({what, onRetry, tone = "light", className = ""}: {
    what: string;
    onRetry?: () => void;
    tone?: "light" | "dark";
    className?: string;
}) {
    const dark = tone === "dark";

    return (
        <div role="alert" className={`flex flex-col items-center justify-center text-center gap-3 py-10 px-4 ${className}`}>
            <span
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    dark ? "bg-white/10 text-white" : "bg-[#B8485B]/10 text-[#B8485B]"
                }`}
            >
                <WifiOff className="w-5 h-5" aria-hidden="true"/>
            </span>
            <p className={`${raleway.className} text-lg font-bold ${dark ? "text-white" : "text-[#12100F]"}`}>
                We couldn&apos;t load {what}
            </p>
            <p className={`${manrope.className} text-sm max-w-sm ${dark ? "text-white/75" : "text-[#6F5E53]"}`}>
                Please check your connection and try again in a moment.
            </p>
            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className={`${manrope.className} mt-1 inline-flex items-center gap-2 h-10 px-5 rounded-full text-sm font-semibold
                                cursor-pointer transition focus-visible:outline-none focus-visible:ring-2 ${
                        dark
                            ? "bg-white text-[#B8485B] hover:bg-[#F6EEEC] focus-visible:ring-white/60"
                            : "main-button-color text-white hover:brightness-110 focus-visible:ring-[#B8485B]/50"
                    }`}
                >
                    <RotateCw className="w-4 h-4" aria-hidden="true"/>
                    Try again
                </button>
            )}
        </div>
    );
}
