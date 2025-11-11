"use client";

import {manrope, raleway} from "@/app/fonts";

import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation} from "swiper/modules";
import {IoIosArrowBack, IoIosArrowForward} from "react-icons/io";
import {useEffect, useState} from "react";
import {useCategory} from "@/app/context/CategoryContext";
import {useRouter} from "next/navigation";

export default function MainMenu() {
    const [menuItems, setMenuItems] = useState<{ name: string; image: string; id: number; }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product-category`, {
                    cache: "no-store",
                });
                if (!res.ok) throw new Error("Ошибка загрузки меню");
                const data = await res.json();

                const formatted = data.map((item: any) => ({
                    ...item,
                    image: `${process.env.NEXT_PUBLIC_API_URL}/${item.image
                        .replace(/\\/g, "/")
                        .replace(/^\/+/, "")
                    }`,
                }));

                setMenuItems(formatted); // <-- Используем уже исправленные ссылки
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchMenu();
    }, []);


    if (loading) {
        return (
            <div className="container mx-auto px-4 py-10 text-center">
                <p className={`${raleway.className} text-lg`}>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-10 text-center">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4">
            <div className="py-10">
                <h6 className={`${raleway.className} font-bold text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl`}>Menu</h6>
                <p className={`${manrope.className} text-center text-sm sm:text-md lg:text-lg pt-2`}>
                    From soft layered cakes to delicate tarts — each treat is made to brighten your day.
                </p>
            </div>

            <div className="flex flex-col space-y-4 md:hidden">
                {menuItems.map((item, i) => (
                    <MenuCard key={i} {...item}/>
                ))}
            </div>

            <div className="hidden md:block pb-24">
                <Swiper
                    modules={[Navigation]}
                    spaceBetween={20}
                    slidesPerView={1}
                    navigation={{
                        nextEl: ".category-next",
                        prevEl: ".category-prev",
                    }}
                    pagination={{clickable: true}}
                    centerInsufficientSlides={true}
                    breakpoints={{
                        768: {
                            slidesPerView: 3,
                            spaceBetween: 30,
                        },
                        1024: {
                            slidesPerView: 4,
                            spaceBetween: 40,
                        },
                        1280: {
                            slidesPerView: 5,
                            spaceBetween: 50,
                        },
                    }}
                >
                    {menuItems.map((item, i) => (
                        <SwiperSlide key={i}>
                            <MenuCard {...item} />
                        </SwiperSlide>
                    ))}
                    <div className="relative bottom-0 w-full h-20 z-20">
                        <div
                            className="category-prev absolute bottom-0 z-30 w-12 h-12 bg-[#833B45] text-white rounded-full flex items-center justify-center cursor-pointer transition right-20">
                            <IoIosArrowBack/>
                        </div>
                        <div
                            className="category-next absolute bottom-0 z-30 w-12 h-12 bg-[#833B45] text-white rounded-full flex items-center justify-center cursor-pointer transition right-0">
                            <IoIosArrowForward/>
                        </div>
                    </div>

                </Swiper>
            </div>
        </div>
    );
}

function MenuCard({name, image, id}: { name: string; image: string; id: number; }) {
    const {setSelectedCategory} = useCategory();
    const router = useRouter();

    const handleClick = () => {
        setSelectedCategory(id);
        router.push("/menu");
    };
    return (

        <div
            onClick={handleClick}
            className="relative py-5 px-3 h-40 md:h-64 md:w-full"
            style={{
                backgroundImage: `url(${image})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center center",
            }}
        >
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-transparent"/>
            <div
                className={`${raleway.className} border-b-2 border-white w-fit z-20 relative text-white text-md md:text-2xl`}
            >
                {name}
            </div>
        </div>
    );
}
