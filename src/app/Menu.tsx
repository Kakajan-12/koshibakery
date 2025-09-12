"use client";

import { quicksand, sora } from "@/app/fonts";
import Link from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { IoIosArrowBack, IoIosArrowForward  } from "react-icons/io";

export default function MainMenu() {
    return (
        <div className="container mx-auto px-4">
            <div className="py-10">
                <h6 className={`${sora.className} text-center text-xl lg:text-4xl`}>Menu</h6>
                <p className={`${quicksand.className} text-center text-md lg:text-lg pt-2`}>
                    From soft layered cakes to delicate tarts — each treat is made to brighten your day.
                </p>
            </div>

            <div className="flex flex-col space-y-4 md:hidden">
                {menuItems.map((item, i) => (
                    <MenuCard key={i} {...item} />
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
                    loop={true}
                    pagination={{clickable: true}}
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
                            className="category-prev absolute bottom-0 z-30 w-12 h-12 bg-[#165225] text-white rounded-full flex items-center justify-center cursor-pointer transition right-20">
                            <IoIosArrowBack />
                        </div>
                        <div
                            className="category-next absolute bottom-0 z-30 w-12 h-12 bg-[#165225] text-white rounded-full flex items-center justify-center cursor-pointer transition right-0">
                            <IoIosArrowForward />
                        </div>
                    </div>

                </Swiper>
            </div>
        </div>
    );
}

const menuItems = [
    {title: "Cakes", image: "/images/cakes.webp"},
    {title: "Tarts", image: "/images/tarts.webp"},
    {title: "Mini bakes", image: "/images/mini_bakes.webp"},
    {title: "Cookies", image: "/images/cookies.webp"},
    {title: "Custom", image: "/images/custom.webp"},
    {title: "Drinks", image: "/images/drinks.webp"},
];

function MenuCard({title, image}: { title: string; image: string }) {
    return (
        <Link href="#">
            <div
                className="relative py-5 px-3 h-40 md:h-64 md:w-full"
                style={{
                    backgroundImage: `url(${image})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center center",
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-transparent" />
                <div
                    className={`${sora.className} border-b-2 border-white w-fit z-20 relative text-white text-md md:text-2xl`}
                >
                    {title}
                </div>
            </div>
        </Link>
    );
}
