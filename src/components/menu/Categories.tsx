"use client";
import {useEffect, useState} from "react";
import Image from "next/image";
import {quicksand, raleway} from "@/app/fonts";
import {useCategory} from "@/app/context/CategoryContext";
import {Navigation} from "swiper/modules";
import {Swiper, SwiperSlide} from "swiper/react";
import {IoIosArrowBack, IoIosArrowForward} from "react-icons/io";

type Category = {
    id: number;
    name: string;
    image: string;
};

export default function Categories() {
    const {selectedCategory, setSelectedCategory} = useCategory()
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product-category`, {
                    cache: "no-store",
                });
                if (!res.ok) throw new Error("Failed to load categories");

                const data: Category[] = await res.json();

                const formatted = data.map((item) => ({
                    ...item,
                    image: `${process.env.NEXT_PUBLIC_API_URL}/${item.image.replace(/\\/g, "/")}`,
                }));

                setCategories(formatted);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) {
        return <p className="text-center py-10">Loading...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500 py-10">{error}</p>;
    }

    return (
        <div className="container mx-auto px-4 pt-14 pb-14 lg:pb-24 relative">
            <Swiper
                modules={[Navigation]}
                spaceBetween={20}
                slidesPerView={2}
                navigation={{
                    nextEl: ".category-next",
                    prevEl: ".category-prev",
                }}
                centerInsufficientSlides={true}
                breakpoints={{
                    420: { slidesPerView: 3, spaceBetween: 30 },
                    567: { slidesPerView: 4, spaceBetween: 30 },
                    1024: { slidesPerView: 5, spaceBetween: 40 },
                    1540: { slidesPerView: 6, spaceBetween: 50 },
                }}
                className="!overflow-hidden"
            >
                <SwiperSlide>
                    <div
                        onClick={() => setSelectedCategory(null)}
                        className={`flex flex-col items-center text-center cursor-pointer transition-transform pt-1 ${
                            selectedCategory === null ? "scale-105" : ""
                        }`}
                    >
                        <div
                            className={`w-24 h-24 sm:w-28 sm:h-28 lg:w-36 lg:h-36 rounded-full overflow-hidden flex items-center justify-center border-4 ${
                                selectedCategory === null ? "border-[#833B45]" : "border-transparent"
                            }`}
                        >
                            <Image
                                src="/images/all.webp"
                                alt="All"
                                width={128}
                                height={128}
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <p
                            className={`${raleway.className} mt-2 font-bold text-md sm:text-lg lg:text-xl text-[#6F5E53]`}
                        >
                            All
                        </p>
                    </div>
                </SwiperSlide>

                {categories.map((item) => (
                    <SwiperSlide key={item.id}>
                        <div
                            onClick={() =>
                                setSelectedCategory(selectedCategory === item.id ? null : item.id)
                            }
                            className={`flex flex-col items-center text-center cursor-pointer transition-transform pt-1 ${
                                selectedCategory === item.id ? "scale-105" : ""
                            }`}
                        >
                            <div
                                className={`w-24 h-24 sm:w-28 sm:h-28 lg:w-36 lg:h-36 rounded-full overflow-hidden border-4 transition-colors ${
                                    selectedCategory === item.id ? "border-[#833B45]" : "border-transparent"
                                }`}
                            >
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={128}
                                    height={128}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                            <p
                                className={`${raleway.className} mt-2 font-bold text-md sm:text-lg lg:text-xl text-[#6F5E53]`}
                            >
                                {item.name}
                            </p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <div className="category-prev hidden xl:flex absolute bottom-0 right-20 z-30 w-12 h-12 bg-[#833B45] text-white rounded-full items-center justify-center cursor-pointer transition">
                <IoIosArrowBack />
            </div>
            <div className="category-next hidden xl:flex absolute bottom-0 right-0 z-30 w-12 h-12 bg-[#833B45] text-white rounded-full items-center justify-center cursor-pointer transition">
                <IoIosArrowForward />
            </div>
        </div>
    );
}
