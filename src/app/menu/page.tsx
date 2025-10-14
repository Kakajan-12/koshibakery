'use client'

import React, {useEffect, useState} from "react";
import {quicksand, sora} from "@/app/fonts";
import {FaPoundSign, FaRegHeart} from "react-icons/fa";
import Image from "next/image";
import Categories from "@/components/menu/Categories";
import Products from "@/components/menu/Products";
import FilterBar from "@/components/menu/Filter";
import {useCategory} from "@/app/context/CategoryContext";
import {useRouter} from "next/navigation";

interface Variant {
    id: number;
    variant_name: string;
    price: number;
}

interface Product {
    id: number;
    main_image: string;
    product_name: string;
    loved: number;
    variants?: Variant[];
    price?: number;
}

const Menu = () => {
    const [lovedProducts, setLovedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [sort, setSort] = useState<"all" | "price-low" | "price-high" | "alphabetical">("all");
    const [search, setSearch] = useState("");
    const [selectedType, setSelectedType] = useState<number | null>(null);
    const [availability, setAvailability] = useState<"all" | "in-stock" | "pre-order">("all");
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
    const [maxPrice, setMaxPrice] = useState(100);
    const {selectedCategory, setSelectedCategory} = useCategory();
    const router = useRouter();

    const resetFilters = () => {
        setSort("all");
        setAvailability("all");
        setPriceRange([0, maxPrice]);
        setSelectedType(null);
    };


    useEffect(() => {
        const fetchLovedProducts = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product`, {cache: "no-store"});
                if (!res.ok) throw new Error("Failed to load products");

                const data: Product[] = await res.json();

                const productsWithPrice = data.map(p => ({
                    ...p,
                    price: p.variants?.[0]?.price ?? 0
                }));

                const prices = productsWithPrice.map(p => p.price);
                const max = prices.length > 0 ? Math.max(...prices) : 0;

                setMaxPrice(max);
                setPriceRange([0, max]);
                const loved = productsWithPrice
                    .filter(item => item.loved === 1)
                    .sort((a, b) => b.id - a.id)
                    .slice(0, 3)
                    .map(item => ({
                        ...item,
                        main_image: `${process.env.NEXT_PUBLIC_API_URL}/${item.main_image.replace(/\\/g, "/")}`
                    }));

                setLovedProducts(loved);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchLovedProducts();
    }, []);


    return (
        <div className="my-container mx-auto mt-[64px]">
            <div className="container mx-auto px-4">
                <div
                    className="mt-4 flex flex-col items-center justify-center h-50 lg:h-60"
                    style={{
                        backgroundImage: "url('/images/shopping-cart.svg')",
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "bottom",
                    }}
                >
                    <h6
                        className={`${sora.className} pt-6 lg:pt-0 text-center font-light text-lg mb-3 sm:text-xl lg:text-4xl xl:text-5xl`}
                    >
                        Place an Order
                    </h6>
                    <p
                        className={`${quicksand.className} text-[#6F5E53] text-center text-sm max-w-lg lg:text-md`}
                    >
                        Whether you're planning a birthday, surprising a friend, or simply craving something sweet —
                        we're here to make
                        it special.
                    </p>
                </div>
            </div>

            <div className="relative">
                <div className="absolute inset-x-0 lg:hidden">
                    <Image src="/images/menu_bg_mobile.svg" alt="mobile menu bg" width={100} height={500}
                           className="w-full"/>
                </div>
                <div className="absolute inset-x-0 hidden lg:block">
                    <Image src="/images/menu_bg.webp" alt="menu bg" width={900} height={900}
                           className="w-full h-[800px]"/>
                </div>

                <div className="container mx-auto px-4">
                    <div className="relative pt-10">
                        <div className="flex flex-col items-start space-y-3 lg:space-y-6">
                            <div className="flex flex-col w-30 sm:w-44">
                                <div className="flex flex-col justify-center items-center space-y-2">
                                    <FaRegHeart className="w-5 h-5 sm:w-6 sm:h-6 lg:h-7"/>
                                    <div
                                        className={`${sora.className} text-black font-bold text-md sm:text-xl lg:text-2xl`}
                                    >
                                        Most Loved
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-start space-y-4 lg:space-y-7">
                                {loading && <p>Loading...</p>}
                                {!loading && lovedProducts.length === 0 && (
                                    <p className={`${quicksand.className} text-gray-600`}>No loved products yet.</p>
                                )}
                                {lovedProducts.map((item) => (
                                    <div key={item.id} className="flex justify-start items-center w-fit space-x-6">
                                            <div className="min-w-30" onClick={() => router.push(`/menu/${item.id}`)}>
                                                <Image
                                                    src={item.main_image}
                                                    alt={item.product_name}
                                                    width={300}
                                                    height={300}
                                                    className="rounded-lg  w-30 sm:w-44 object-cover"
                                                />
                                            </div>

                                        <div className="flex flex-col">
                                            <p
                                                className={`${quicksand.className} font-bold text-sm sm:text-lg lg:text-2xl`}>
                                                {item.product_name}
                                            </p>
                                            <p
                                                className={`${quicksand.className} font-bold text-sm sm:text-lg lg:text-2xl flex items-center`}
                                            >
                                                <FaPoundSign size={18}/>{item.price}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="absolute right-0 xl:right-10 -top-2 sm:top-0 lg:bottom-10">
                            <Image
                                src="/images/menu_hero.webp"
                                alt="menu_hero"
                                width={500}
                                height={500}
                                className="opacity-50 w-36 sm:w-56 lg:opacity-100 lg:w-full"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="my-container relative z-20 bg-[#FDFBF8] mt-20">
                <Categories/>
                <FilterBar sort={sort} setSort={setSort} search={search} setSearch={setSearch}
                           selectedType={selectedType}
                           setSelectedType={setSelectedType} availability={availability}
                           setAvailability={setAvailability} priceRange={priceRange}
                           setPriceRange={setPriceRange} maxPrice={maxPrice} resetFilters={resetFilters}/>
                <Products sort={sort} search={search} selectedType={selectedType} availability={availability}
                          priceRange={priceRange} selectedCategory={selectedCategory}/>
            </div>
        </div>
    )
        ;
};

export default Menu;
