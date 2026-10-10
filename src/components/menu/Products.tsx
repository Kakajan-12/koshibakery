"use client";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {workSans} from "@/app/fonts";
import {SortOption} from "@/lib/sorts"
import {useCart} from "@/app/context/CartContext";
import LoadError from "@/components/LoadError";
import ProductCard, {ProductCardSkeleton} from "@/components/menu/ProductCard";

interface Allergen {
    id: number;
    name: string;
}
type Variant = { id: number; variant_name: string; price: number };

type Product = {
    id: number;
    main_image: string;
    product_name: string;
    product_desc: string;
    notice: string;
    product_availability: number | string;
    product_types: number;
    product_category: number;
    allergens: Allergen[];
    variants: Variant[];
    price: number;
};

function stripHtml(html: string) {
    return html.replace(/<[^>]+>/g, "");
}

const PRODUCTS_PER_PAGE = 12;
// Поиск уходит на сервер после паузы в наборе, а не на каждую букву
const SEARCH_DELAY_MS = 300;

export default function Products({sort, search, selectedType, availability, priceRange, maxPrice, selectedCategory}: {
    sort: SortOption;
    search: string;
    selectedType: number | null;
    availability: "all" | "in-stock" | "pre-order";
    priceRange: [number, number];
    // Верхняя граница ползунка: если диапазон не сужен, фильтр по цене не отправляем
    maxPrice: number;
    selectedCategory: number | null
}) {
    const [products, setProducts] = useState<Product[]>([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    // Увеличивается по кнопке «Try again» — повторяет тот же запрос
    const [attempt, setAttempt] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const { cart} = useCart();

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search.trim()), SEARCH_DELAY_MS);
        return () => clearTimeout(timer);
    }, [search]);

    // Новые условия — снова с первой страницы
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, selectedType, availability, priceRange, debouncedSearch, sort]);

    // Поиск, фильтры, сортировка и пагинация выполняются на сервере (/api/product/catalog)
    const query = useMemo(() => {
        const params = new URLSearchParams({page: String(currentPage), limit: String(PRODUCTS_PER_PAGE)});
        if (debouncedSearch) params.set("q", debouncedSearch);
        if (selectedCategory !== null) params.set("category", String(selectedCategory));
        if (selectedType !== null) params.set("type", String(selectedType));
        if (availability !== "all") params.set("availability", availability);
        if (sort !== "all") params.set("sort", sort);
        if (priceRange[0] > 0) params.set("minPrice", String(priceRange[0]));
        if (priceRange[1] < maxPrice) params.set("maxPrice", String(priceRange[1]));
        return params.toString();
    }, [currentPage, debouncedSearch, selectedCategory, selectedType, availability, sort, priceRange, maxPrice]);

    useEffect(() => {
        // Отменяем прошлый запрос: при быстрой смене фильтров не должен «победить» устаревший ответ
        const controller = new AbortController();
        setRefreshing(true);

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product/catalog?${query}`, {
            cache: "no-store",
            signal: controller.signal,
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load products");
                return res.json();
            })
            .then((data: { items: any[]; total: number; pages: number }) => {
                setProducts(data.items.map((p) => ({
                    ...p,
                    main_image: `${process.env.NEXT_PUBLIC_API_URL}/${String(p.main_image).replace(/\\/g, "/")}`,
                    product_name: stripHtml(p.product_name || ""),
                    variants: p.variants || [],
                    price: Number(p.price) || 0,
                })));
                setTotal(data.total);
                setTotalPages(data.total > 0 ? data.pages : 0);
                setError(null);
                setLoading(false);
                setRefreshing(false);
            })
            .catch((err) => {
                if (err.name === "AbortError") return;
                console.error("Fetch error:", err);
                setError(err.message);
                setLoading(false);
                setRefreshing(false);
            });

        return () => controller.abort();
    }, [query, attempt]);

    if (loading) {
        return (
            <div className="container mx-auto px-4" aria-busy="true" aria-label="Loading products">
                <div className="py-14 min-h-[500px] main-block-color rounded-xl p-6 mb-20">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
                        {Array.from({length: 8}).map((_, i) => <ProductCardSkeleton key={i}/>)}
                    </div>
                </div>
            </div>
        );
    }
    // Ошибка показывается внутри обычной панели списка: высота блока сохраняется, вёрстка страницы не «проваливается»
    if (error) {
        return (
            <div className="container mx-auto px-4">
                <div className="py-14 min-h-[500px] main-block-color rounded-xl p-6 mb-20 flex items-center justify-center">
                    <LoadError what="products" onRetry={() => setAttempt((a) => a + 1)}/>
                </div>
            </div>
        );
    }


    // К началу списка прокручиваем только при переключении страницы — кнопки пагинации внизу,
    // а новые товары начинаются сверху. Смена категории или фильтров страницу не двигает.
    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <div ref={containerRef} className="container mx-auto px-4">
            {/* Пока грузится новая выдача, старые товары остаются на месте и слегка тускнеют — без мигания скелетоном */}
            <div
                aria-busy={refreshing}
                className={`py-14 min-h-[500px] main-block-color rounded-xl p-6 mb-20 transition-opacity duration-200 ${
                    refreshing ? "opacity-60" : ""
                }`}
            >
                {/* Без этого при пустой выдаче оставался пустой блок, и было непонятно, что дело в фильтрах */}
                {total === 0 && !refreshing && (
                    <div className="flex flex-col items-center justify-center text-center py-20">
                        <p className="text-xl font-bold text-[#12100F]">No treats match your search</p>
                        <p className="mt-2 text-sm text-[#6F5E53]">Try another category or remove some filters.</p>
                    </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
                    {products.map((item) => (
                        <ProductCard key={item.id} item={item} inCart={cart.some((p) => p.id === item.id)}/>
                    ))}
                </div>
                {totalPages > 1 && (
                    <div className="flex justify-center mt-8 space-x-2">
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`${workSans.className} px-3 py-1 border rounded disabled:opacity-50 cursor-pointer`}
                        >
                            Prev
                        </button>

                        {Array.from({length: totalPages}, (_, i) => (
                            <button
                                key={i}
                                onClick={() => goToPage(i + 1)}
                                className={`${workSans.className} px-3 py-1 border rounded cursor-pointer ${
                                    currentPage === i + 1 ? "main-button-color text-white" : "hover:bg-gray-200"
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`${workSans.className} px-3 py-1 border rounded disabled:opacity-50 cursor-pointer`}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
