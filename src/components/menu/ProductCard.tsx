import Image from "next/image";
import Link from "next/link";
import {ArrowRight, Clock, ShoppingBag} from "lucide-react";
import {formatPrice} from "@/lib/price";
import {htmlToText, isEmptyHtml} from "@/lib/html";
import {manrope, raleway} from "@/app/fonts";
import {Skeleton} from "@/components/ui/skeleton";

export type ProductCardData = {
    id: number;
    main_image: string;
    product_name: string;
    category_name?: string | null;
    notice?: string | null;
    product_availability: number | string;
    allergens?: { id: number; name: string }[];
    variants?: { id: number; variant_name: string; price: number }[];
    price: number;
};

// Карточка товара в меню: вся кликабельна (одна ссылка), наличие и «в корзине» — бейджами на фото
export default function ProductCard({item, inCart}: { item: ProductCardData; inCart: boolean }) {
    const inStock = Number(item.product_availability) === 1;
    const prices = (item.variants ?? []).map((v) => Number(v.price)).filter(Number.isFinite);
    const minPrice = prices.length ? Math.min(...prices) : item.price;
    const notice = isEmptyHtml(item.notice) ? "" : htmlToText(item.notice);

    return (
        <Link
            href={`/menu/${item.id}`}
            className="group flex flex-col h-full w-full overflow-hidden rounded-2xl bg-white ring-1 ring-[#B8485B]/10
                       shadow-[0_2px_12px_rgba(131,59,70,0.08)] transition-all duration-300
                       hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(131,59,70,0.18)]
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8485B]"
        >
            <div className="relative aspect-square overflow-hidden bg-[#F6EEEC]">
                <Image
                    src={item.main_image}
                    alt={item.product_name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-105"
                />

                <span
                    className={`${manrope.className} absolute top-3 left-3 inline-flex items-center gap-1.5 h-7 px-3 rounded-full
                                text-xs font-semibold backdrop-blur-sm shadow-sm ${
                        inStock ? "bg-white/90 text-[#2F6B3F]" : "bg-white/90 text-[#9A5B13]"
                    }`}
                >
                    <span className={`w-1.5 h-1.5 rounded-full ${inStock ? "bg-[#3C9A57]" : "bg-[#D18A2C]"}`} aria-hidden="true"/>
                    {inStock ? "In stock" : "Pre-order"}
                </span>

                {inCart && (
                    <span
                        className={`${manrope.className} absolute top-3 right-3 inline-flex items-center gap-1.5 h-7 px-3 rounded-full
                                    bg-[#B8485B] text-white text-xs font-semibold shadow-sm`}
                    >
                        <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true"/>
                        In your cart
                    </span>
                )}
            </div>

            <div className="flex flex-col flex-1 p-4 sm:p-5 gap-3">
                <div className="space-y-1">
                    {item.category_name && (
                        <p className={`${manrope.className} text-[11px] uppercase tracking-[0.14em] text-[#B8485B]`}>
                            {item.category_name}
                        </p>
                    )}
                    <h3 className={`${raleway.className} text-lg sm:text-xl font-bold text-[#12100F] leading-snug line-clamp-2`}>
                        {item.product_name}
                    </h3>
                    <p className={`${manrope.className} text-sm text-[#6F5E53]`}>
                        {prices.length > 1 && "from "}
                        <span className="text-lg font-bold text-[#B8485B]">£{formatPrice(minPrice)}</span>
                    </p>
                </div>

                {notice && (
                    <p className={`${manrope.className} flex items-start gap-1.5 text-xs text-[#9A5B13]`} title={notice}>
                        <Clock className="w-3.5 h-3.5 shrink-0 mt-px" aria-hidden="true"/>
                        {/* line-clamp — на тексте: на flex-контейнере обрезка строк не работает */}
                        <span className="line-clamp-2">{notice}</span>
                    </p>
                )}

                {item.allergens && item.allergens.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5">
                        <span className={`${manrope.className} text-[11px] text-[#6F5E53]`}>Contains:</span>
                        {item.allergens.map((a) => (
                            <span
                                key={a.id}
                                className={`${manrope.className} px-2 py-0.5 rounded-full bg-[#F6EEEC] text-[11px] text-[#12100F]`}
                            >
                                {a.name}
                            </span>
                        ))}
                    </div>
                )}

                {/* Не кнопка, а часть ссылки-карточки: вложенные интерактивные элементы в ссылке недопустимы */}
                <span
                    className={`${manrope.className} mt-auto inline-flex items-center justify-center gap-2 h-11 rounded-full
                                text-sm font-semibold ring-1 ring-[#B8485B]/40 text-[#B8485B] transition-colors duration-300
                                group-hover:bg-[#B8485B] group-hover:text-white group-hover:ring-[#B8485B]`}
                >
                    Order now
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true"/>
                </span>
            </div>
        </Link>
    );
}

export function ProductCardSkeleton() {
    return (
        <div className="flex flex-col w-full overflow-hidden rounded-2xl bg-white ring-1 ring-[#B8485B]/10" aria-hidden="true">
            <Skeleton className="w-full aspect-square rounded-none"/>
            <div className="flex flex-col gap-3 p-4 sm:p-5">
                <Skeleton className="h-3 w-16"/>
                <Skeleton className="h-6 w-3/4"/>
                <Skeleton className="h-5 w-20"/>
                <Skeleton className="h-3 w-full"/>
                <Skeleton className="h-11 w-full rounded-full mt-2"/>
            </div>
        </div>
    );
}
