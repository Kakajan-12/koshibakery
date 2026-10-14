'use client'

import {formatPrice} from "@/lib/price";
import React, {useEffect, useState} from "react";
import {manrope, raleway} from "@/app/fonts";
import {FaHeart} from "react-icons/fa";
import {ArrowRight} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Categories from "@/components/menu/Categories";
import Products from "@/components/menu/Products";
import FilterBar from "@/components/menu/Filter";
import {useCategory} from "@/app/context/CategoryContext";
import {Skeleton} from "@/components/ui/skeleton";
import LoadError from "@/components/LoadError";

interface Variant {
    id: number;
    variant_name: string;
    price: number;
}

interface Product {
    id: number;
    main_image: string;
    product_name: string;
    category_name?: string | null;
    loved: number;
    variants?: Variant[];
    price?: number;
}

// Карточка «Most Loved»: вся кликабельна (ссылка), категория, цена «от»
function LovedCard({item}: { item: Product }) {
    const prices = (item.variants ?? []).map(v => Number(v.price)).filter(Number.isFinite);
    const minPrice = prices.length ? Math.min(...prices) : item.price ?? 0;

    return (
        <Link
            href={`/menu/${item.id}`}
            className="group flex items-center gap-4 w-full sm:w-[23rem] p-2.5 pr-5 rounded-2xl
                       bg-white/85 backdrop-blur-sm ring-1 ring-[#B8485B]/10 shadow-[0_2px_12px_rgba(131,59,70,0.08)]
                       transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(131,59,70,0.18)]
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8485B]"
        >
            <div className="relative shrink-0 w-20 sm:w-28 lg:w-32 aspect-square overflow-hidden rounded-xl bg-[#B8485B]/10">
                <Image
                    src={item.main_image}
                    alt={item.product_name}
                    fill
                    sizes="128px"
                    className="object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-105"
                />
            </div>

            {/* Колонка тянется на высоту картинки: категория — у верхнего края, название и цена — у нижнего */}
            <div className="flex-1 min-w-0 self-stretch flex flex-col justify-between py-1">
                <p className={`${manrope.className} text-[10px] sm:text-xs uppercase tracking-[0.14em] text-[#B8485B]`}>
                    {item.category_name}
                </p>
                <div>
                    <p className={`${raleway.className} font-bold text-base sm:text-md lg:text-lg text-[#12100F] truncate`}>
                        {item.product_name}
                    </p>
                    <p className={`${manrope.className} mt-1 text-sm sm:text-base text-[#6F5E53]`}>
                        {prices.length > 1 && "from "}
                        <span className="font-semibold text-[#12100F]">£{formatPrice(minPrice)}</span>
                    </p>
                </div>
            </div>

            <ArrowRight
                aria-hidden="true"
                className="shrink-0 w-5 h-5 text-[#B8485B] transition-transform duration-300 group-hover:translate-x-1"
            />
        </Link>
    );
}

const Menu = () => {
    const [lovedProducts, setLovedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [lovedError, setLovedError] = useState(false);
    // Увеличивается по кнопке «Try again» — запускает загрузку Most Loved заново
    const [lovedAttempt, setLovedAttempt] = useState(0);
    const [sort, setSort] = useState<"all" | "price-low" | "price-high" | "alphabetical">("all");
    const [search, setSearch] = useState("");
    const [selectedType, setSelectedType] = useState<number | null>(null);
    const [availability, setAvailability] = useState<"all" | "in-stock" | "pre-order">("all");
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
    const [maxPrice, setMaxPrice] = useState(100);
    const {selectedCategory, setSelectedCategory} = useCategory();

    const resetFilters = () => {
        setSort("all");
        setAvailability("all");
        setPriceRange([0, maxPrice]);
        setSelectedType(null);
    };


    useEffect(() => {
        const fetchLovedProducts = async () => {
            try {
                // Только три «любимых» товара — сервер отбирает их сам; заодно отдаёт максимальную цену каталога для ползунка
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product/catalog?loved=1&limit=3`, {cache: "no-store"});
                if (!res.ok) throw new Error("Failed to load products");

                const data: { items: Product[]; priceMax: number } = await res.json();

                setMaxPrice(data.priceMax);
                setPriceRange([0, data.priceMax]);
                setLovedProducts(data.items.map(item => ({
                    ...item,
                    main_image: `${process.env.NEXT_PUBLIC_API_URL}/${item.main_image.replace(/\\/g, "/")}`
                })));
                setLovedError(false);
            } catch (err) {
                console.error(err);
                setLovedError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchLovedProducts();
    }, [lovedAttempt]);

    const retryLoved = () => {
        setLovedError(false);
        setLoading(true);
        setLovedAttempt((a) => a + 1);
    };


    return (
        <div className="my-container mx-auto mt-[64px]">
            <div className="container mx-auto px-4">
                <div
                    className="mt-24 lg:mt-32 flex flex-col items-center h-50 lg:h-96"
                    style={{
                        backgroundImage: "url('/images/shopping-cart.svg')",
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "bottom",
                    }}
                >
                    <h6
                        className={`${raleway.className} text-white pt-6 lg:pt-18 text-center font-bold text-3xl mb-3 sm:text-4xl lg:text-6xl xl:text-7xl`}
                    >
                        Place an Order
                    </h6>
                    <p
                        className={`${manrope.className} text-white text-center max-w-2xl text-sm sm:text-md lg:text-lg pt-8 leading-8`}
                    >
                        Whether you're planning a birthday, surprising a friend, or simply craving something sweet —
                        we're here to make
                        it special.
                    </p>
                </div>
            </div>

            <div className="relative">
                <div className="absolute inset-x-0 lg:hidden">
                    <Image src="/images/menu_bg_mobile.png" alt="mobile menu bg" width={100} height={500}
                           className="w-full"/>
                </div>
                <div className="absolute inset-x-0 hidden lg:block">
                    <Image src="/images/menu_bg.png" alt="menu bg" width={900} height={900}
                           className="w-full h-[800px]"/>
                </div>

                <div className="container mx-auto px-4">
                    <div className="relative pt-10 2xl:pt-20">
                        <div className="flex flex-col items-start space-y-5 lg:space-y-7">
                            <div className="flex items-center gap-3">
                                <span
                                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#B8485B] text-white flex items-center justify-center shadow-md shadow-[#B8485B]/30">
                                    <FaHeart className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true"/>
                                </span>
                                <div>
                                    <p className={`${manrope.className} text-[11px] sm:text-xs uppercase tracking-[0.18em] text-[#B8485B]`}>
                                        Customer favourites
                                    </p>
                                    <h2 className={`${raleway.className} font-bold text-2xl sm:text-3xl lg:text-4xl text-[#12100F]`}>
                                        Most Loved
                                    </h2>
                                </div>
                            </div>

                            <div className="flex flex-col items-start w-full space-y-3 lg:space-y-4">
                                {loading && Array.from({length: 3}).map((_, i) => (
                                    <div key={i} aria-hidden="true"
                                         className="flex items-center gap-4 sm:gap-5 w-full sm:w-[26rem] p-2.5 pr-5 rounded-2xl bg-white/85">
                                        <Skeleton className="shrink-0 w-20 sm:w-28 lg:w-32 aspect-square rounded-xl"/>
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-3 w-16"/>
                                            <Skeleton className="h-5 w-36 sm:w-44"/>
                                            <Skeleton className="h-4 w-20"/>
                                        </div>
                                    </div>
                                ))}
                                {/* При ошибке не пишем «нет любимых товаров» — это была бы неправда */}
                                {!loading && lovedError && (
                                    <div className="w-full sm:w-[26rem] rounded-2xl bg-white/85">
                                        <LoadError what="our favourites" onRetry={retryLoved} className="py-6"/>
                                    </div>
                                )}
                                {!loading && !lovedError && lovedProducts.length === 0 && (
                                    <p className={`${raleway.className} text-gray-600`}>No loved products yet.</p>
                                )}
                                {lovedProducts.map((item) => (
                                    <LovedCard key={item.id} item={item}/>
                                ))}
                            </div>
                        </div>

                        <div className="hidden lg:block absolute right-0 -top-5 lg:top-30 xl:top-20 2xl:top-10">
                            <Image
                                src="/images/menu_hero.webp"
                                alt="menu_hero"
                                width={500}
                                height={500}
                                className="opacity-50 w-46 sm:w-66 md:w-76 lg:opacity-100 lg:w-[400px] xl:w-[450px] 2xl:w-[550px]"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="my-container relative z-20 mt-10 lg:mt-20 main-background-color">
                <Categories/>
                <FilterBar sort={sort} setSort={setSort} search={search} setSearch={setSearch}
                           selectedType={selectedType}
                           setSelectedType={setSelectedType} availability={availability}
                           setAvailability={setAvailability} priceRange={priceRange}
                           setPriceRange={setPriceRange} maxPrice={maxPrice} resetFilters={resetFilters}/>
                <Products sort={sort} search={search} selectedType={selectedType} availability={availability} maxPrice={maxPrice}
                          priceRange={priceRange} selectedCategory={selectedCategory}/>
            </div>
        </div>
    )
        ;
};

export default Menu;
