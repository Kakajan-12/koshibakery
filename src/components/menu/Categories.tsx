"use client";
import {useEffect, useState} from "react";
import Image from "next/image";
import {raleway} from "@/app/fonts";
import {useCategory} from "@/app/context/CategoryContext";
import {Navigation} from "swiper/modules";
import {Swiper, SwiperSlide} from "swiper/react";
import {IoIosArrowBack, IoIosArrowForward} from "react-icons/io";
import {Skeleton} from "@/components/ui/skeleton";
import LoadError from "@/components/LoadError";

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
    // Увеличивается по кнопке «Try again» — запускает загрузку заново
    const [attempt, setAttempt] = useState(0);

    const retry = () => {
        setError(null);
        setLoading(true);
        setAttempt((a) => a + 1);
    };

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
    }, [attempt]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 pt-8 pb-4 sm:pt-14 sm:pb-14 lg:pb-24" aria-busy="true" aria-label="Loading categories">
                <div className="flex justify-center gap-[30px] lg:gap-10 overflow-hidden">
                    {Array.from({length: 6}).map((_, i) => (
                        <div key={i} className={`flex flex-col items-center pt-1 ${i >= 2 ? "hidden" : ""} ${i === 2 ? "min-[420px]:flex" : ""} ${i === 3 ? "min-[567px]:flex" : ""} ${i === 4 ? "lg:flex" : ""} ${i === 5 ? "min-[1540px]:flex" : ""}`}>
                            <Skeleton tone="dark" className="w-24 h-24 sm:w-28 sm:h-28 lg:w-36 lg:h-36 rounded-full"/>
                            <Skeleton tone="dark" className="mt-3 h-5 w-16"/>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Блок стоит на бордовом фоне — тёмный вариант, с теми же отступами, что и у категорий
    if (error) {
        return (
            <div className="container mx-auto px-4 pt-8 pb-4 sm:pt-14 sm:pb-14 lg:pb-24">
                <LoadError what="categories" onRetry={retry} tone="dark"/>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 pt-8 pb-4 sm:pt-14 sm:pb-14 lg:pb-24 relative">
            <Swiper
                modules={[Navigation]}
                // 2.5 на телефоне: третья категория видна наполовину — понятно, что ленту можно листать
                spaceBetween={12}
                slidesPerView={2.5}
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
                            className={`w-24 h-24 sm:w-28 sm:h-28 lg:w-36 lg:h-36 rounded-full overflow-hidden flex items-center justify-center border-10 ${
                                selectedCategory === null ? "active-category" : "border-transparent"
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
                            className={`${raleway.className} mt-2 font-bold text-md sm:text-lg lg:text-xl text-color`}
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
                                className={`w-24 h-24 sm:w-28 sm:h-28 lg:w-36 lg:h-36 rounded-full overflow-hidden border-10 transition-colors ${
                                    selectedCategory === item.id ? "active-category" : "border-transparent"
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
                                className={`${raleway.className} mt-2 font-bold text-md sm:text-lg lg:text-xl text-color`}
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
