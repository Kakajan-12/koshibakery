"use client";
import {useEffect, useRef, useState} from "react";
import Image from "next/image";
import { quicksand, sora } from "@/app/fonts";
import { FaShoppingCart } from "react-icons/fa";
import { FaPoundSign } from "react-icons/fa";
import { SortOption } from "@/lib/sorts"

type Product = {
    id: number;
    main_image: string;
    product_name: string;
    product_desc: string;
    price: number;
    product_availability: number | string;
    product_types: number;
    product_category: number;
};

function stripHtml(html: string) {
    return html.replace(/<[^>]+>/g, "");
}

export default function Products({ sort, search, selectedType, availability, priceRange,selectedCategory }: { sort: SortOption; search: string; selectedType: number | null; availability: "all" | "in-stock" | "pre-order"; priceRange: [number, number]; selectedCategory: number | null}) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);
    const firstProductRef = useRef<HTMLDivElement>(null);

    const productsPerPage = 4;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product`, {
                    cache: "no-store",
                });
                if (!res.ok) throw new Error("Failed to load products");
                const data: Product[] = await res.json();

                const formatted = data.map((p) => ({
                    ...p,
                    main_image: `${process.env.NEXT_PUBLIC_API_URL}/${p.main_image.replace(/\\/g, "/")}`,
                    product_name: stripHtml(p.product_name || ""),
                    product_desc: stripHtml(p.product_desc || ""),
                }));

                setProducts(formatted);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [sort]);


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

    filteredProducts = filteredProducts.filter(
        p => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);




    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);

            if (firstProductRef.current) {
                firstProductRef.current.scrollIntoView({ behavior: "smooth" });
            }
        }
    };

    return (
        <div ref={containerRef} className="container mx-auto px-4 py-14 min-h-[500px]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
                {currentProducts.map((item, i) => (
                    <div
                        key={item.id}
                        ref={i === 0 ? firstProductRef : null}
                        className="flex flex-col items-center text-center cursor-pointer border border-2 rounded-lg p-2 w-full scroll-mt-24"
                    >
                        <div className="w-full h-40 sm:h-60 rounded-lg overflow-hidden">
                            <Image
                                src={item.main_image}
                                alt={item.product_name}
                                width={500}
                                height={500}
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <div className="space-y-1 w-full">
                            <div
                                className={`${quicksand.className} mt-2 font-bold text-md sm:text-lg lg:text-2xl text-[#3B3B3B] text-start`}
                            >
                                {item.product_name}
                            </div>
                            <p
                                className={`${quicksand.className} mt-2 font-bold text-sm sm:text-md lg:text-lg text-[#6F5E53] text-start`}
                            >
                                {item.product_desc}
                            </p>
                            <div className="w-full">
                                <button
                                    className={`${sora.className} w-full flex items-center justify-center border-2 border-[#264D30] text-[#0E2D16] font-bold rounded-lg px-8 py-1 space-x-2`}
                                >
                                    <FaShoppingCart className="mb-1"/>
                                    <div className="flex items-center"><div className="text-md">{item.price}</div><div className="flex items-center h-full pb-1"><FaPoundSign size={14}/></div> </div>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Пагинация */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-8 space-x-2">
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Prev
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => goToPage(i + 1)}
                            className={`px-3 py-1 border rounded ${
                                currentPage === i + 1 ? "bg-[#264D30] text-white" : "hover:bg-gray-200"
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
