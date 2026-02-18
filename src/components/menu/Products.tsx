"use client";
import React, {useEffect, useRef, useState} from "react";
import Image from "next/image";
import {manrope, raleway, workSans} from "@/app/fonts";
import {FaPoundSign} from "react-icons/fa";
import {SortOption} from "@/lib/sorts"
import {useRouter} from "next/navigation";
import {useCart} from "@/app/context/CartContext";

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

export default function Products({sort, search, selectedType, availability, priceRange, selectedCategory}: {
    sort: SortOption;
    search: string;
    selectedType: number | null;
    availability: "all" | "in-stock" | "pre-order";
    priceRange: [number, number];
    selectedCategory: number | null
}) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);
    const firstProductRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { cart} = useCart();

    const productsPerPage = 12;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product`, {
                    cache: "no-store",
                });
                if (!res.ok) throw new Error("Failed to load products");
                const data: Product[] = await res.json();
                const formatted = data.map((p: any) => {
                    const variants: Variant[] = p.variants || [];
                    const mainVariantPrice = variants.length > 0 ? variants[0].price : 0;

                    return {
                        ...p,
                        main_image: `${process.env.NEXT_PUBLIC_API_URL}/${p.main_image.replace(/\\/g, "/")}`,
                        product_name: stripHtml(p.product_name || ""),
                        product_desc: stripHtml(p.product_desc || ""),
                        variants,
                        price: mainVariantPrice,
                    };
                });

                setProducts(formatted);
            } catch (err: any) {
                console.error("Fetch error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, selectedType, availability, priceRange, search]);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [currentPage, selectedCategory, selectedType, sort]);



    if (loading) return <p className="text-center py-10">Loading...</p>;
    if (error) return <p className="text-center text-red-500 py-10">{error}</p>;

    let filteredProducts = [...products];

    if (selectedCategory) {
        filteredProducts = filteredProducts.filter(
            (p) => p.product_category === selectedCategory
        );
    }

    if (selectedType) {
        filteredProducts = filteredProducts.filter(
            (p) => p.product_types === selectedType
        );
    }


    if (search) {
        filteredProducts = filteredProducts.filter(p =>
            p.product_name.toLowerCase().includes(search.toLowerCase())
        );
    }

    if (sort === "price-low") filteredProducts.sort((a, b) => a.price - b.price);
    else if (sort === "price-high") filteredProducts.sort((a, b) => b.price - a.price);
    else if (sort === "alphabetical") filteredProducts.sort((a, b) => a.product_name.localeCompare(b.product_name));

    if (availability === "in-stock") {
        filteredProducts = filteredProducts.filter((p) => p.product_availability === 1);
    } else if (availability === "pre-order") {
        filteredProducts = filteredProducts.filter((p) => p.product_availability === 0);
    }

    filteredProducts = filteredProducts.filter(p =>
        p.price >= (priceRange?.[0] || 0) && p.price <= (priceRange?.[1] || Infinity)
    );



    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);


    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div ref={containerRef} className="container mx-auto px-4">
            <div className="py-14 min-h-[500px] main-block-color rounded-xl p-6 mb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-items-center">
                    {currentProducts.map((item, i) => {
                        const isInCart = cart.some((p) => p.id === item.id);

                        return (
                            <div
                                key={item.id}
                                ref={i === 0 ? firstProductRef : null}
                                className="flex flex-col justify-between items-center text-center cursor-pointer border-2 rounded-xl w-full scroll-mt-24 bg-white p-4"
                            >
                                <div className="w-full flex-1" onClick={() => router.push(`/menu/${item.id}`)}>
                                    <div className="w-full aspect-square relative">
                                        <Image
                                            src={item.main_image}
                                            alt={item.product_name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="space-y-3 w-full px-2 py-4">
                                        <div className={`${raleway.className} font-semibold text-xs text-red-500`}>
                                            {item.notice}
                                        </div>
                                        <div className="flex items-center justify-center">
                                            <div className="flex items-center">
                                                <FaPoundSign size={14}/>
                                                <div
                                                    className={`${manrope.className} text-md md:text-lg font-bold`}>{item.price}</div>
                                            </div>
                                        </div>
                                        <div
                                            className={`${manrope.className} text-md sm:text-lg lg:text-xl text-center`}
                                        >
                                            {item.product_name}
                                        </div>
                                        <div className="flex flex-wrap justify-center gap-2 max-w-full">
                                            {item.allergens?.map((a) => (
                                                <p
                                                    key={a.id}
                                                    className={`${manrope.className} bg-red-400 rounded-md px-2 py-1 text-white text-sm break-words max-w-[100px] text-center`}
                                                >
                                                    {a.name}
                                                </p>
                                            ))}
                                        </div>

                                    </div>
                                </div>

                                <div className="w-full mb-4 flex items-center justify-center">
                                    <button
                                        onClick={() => router.push(`/menu/${item.id}`)}
                                        className={`${raleway.className} w-56 border-2 cursor-pointer main-border-color main-text-color font-bold rounded-full px-8 py-1 transition-all`}
                                    >
                                        PLACE AN ORDER
                                    </button>
                                </div>

                            </div>
                        );
                    })}
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
