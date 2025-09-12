'use client'
import Image from "next/image";
import {quicksand, sora} from "@/app/fonts";
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation} from "swiper/modules";

export default function Testimonials() {
    return (
        <div className="container mx-auto px-4">
            <div className="w-full relative py-10">
                <div className="absolute left-0">
                    <Image
                        src="/images/quote_left.svg"
                        alt="Quote Left"
                        width={500}
                        height={500}
                        className="w-20 md:w-40 lg:w-64 lg:w-72"
                    />
                </div>

                <div className="absolute right-0">
                    <Image
                        src="/images/quote_left.svg"
                        alt="Quote Mobile"
                        width={500}
                        height={500}
                        className="w-20 block md:hidden transform scale-x-[-1]"
                    />

                    <Image
                        src="/images/quote_right.svg"
                        alt="Quote Desktop"
                        width={500}
                        height={500}
                        className="w-20 hidden md:block md:w-40 lg:w-64 lg:w-72"
                    />
                </div>

                <div className="w-full">
                    <h6 className={`${sora.className} text-center pt-8 text-lg mb-10 md:text-3xl lg:text-4xl`}>Testimonials</h6>
                </div>
                <div className="pb-24 relative md:mt-16 px-4 overflow-visible">
                    <Swiper
                        modules={[Navigation]}
                        spaceBetween={10}
                        slidesPerView={1}
                        centeredSlides={true}
                        loop={true}
                        navigation={{
                            nextEl: ".testimonials-next",
                            prevEl: ".testimonials-prev",
                        }}
                        breakpoints={{
                            768: {
                                slidesPerView: 3,
                                spaceBetween: 30,
                            },
                            1024: {
                                slidesPerView: 3,
                                spaceBetween: 40,
                            },
                            1280: {
                                slidesPerView: 3,
                                spaceBetween: 50,
                            },
                        }}
                    >
                        {cardItems.map((item, i) => (
                            <SwiperSlide key={i}>
                                <div className="flex justify-center">
                                    <TestomonialCard {...item} />
                                </div>
                            </SwiperSlide>
                        ))}

                        <div
                            className="absolute md:relative inset-0 flex items-center justify-between md:justify-center md:space-x-32 md:pt-8 md:pb-1 pointer-events-none z-20">
                            <div
                                className="testimonials-prev relative w-12 h-12 xl:w-15 xl:h-14 flex items-center justify-center bg-white rounded-full cursor-pointer pointer-events-auto group">
                                <Image
                                    src="/images/arrow-right.svg"
                                    alt="about-arrow"
                                    width={190}
                                    height={28}
                                    className="absolute z-20 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 -translate-x-2 xl:-translate-x-3 group-hover:-translate-x-6 transition-transform duration-300 max-w-[75px] xl:max-w-[100px] transform scale-x-[-1]"
                                />

                                <div
                                    className="w-13 h-13 xl:w-16 xl:h-16 rounded-full relative overflow-hidden absolute">
                                    <div
                                        className="absolute inset-0 bg-gradient-to-r from-[#7DDF9A] to-transparent rounded-full flex justify-center items-center">
                                        <div
                                            className="w-11 h-11 xl:w-13 xl:h-13 absolute bg-[#FDFBF8] rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="testimonials-next relative w-12 h-12 xl:w-15 xl:h-14 flex items-center justify-center bg-white rounded-full cursor-pointer pointer-events-auto group">
                                <Image
                                    src="/images/arrow-right.svg"
                                    alt="about-arrow"
                                    width={190}
                                    height={28}
                                    className="absolute z-20 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 -translate-x-17 xl:-translate-x-22 group-hover:-translate-x-18 transition-transform duration-300 max-w-[75px] xl:max-w-[100px]"
                                />

                                <div
                                    className="w-13 h-13 xl:w-16 xl:h-16 rounded-full relative overflow-hidden absolute">
                                    <div
                                        className="absolute inset-0 bg-gradient-to-l from-[#7DDF9A] to-transparent rounded-full flex justify-center items-center">
                                        <div
                                            className="w-11 h-11 xl:w-13 xl:h-13 absolute bg-[#FDFBF8] rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Swiper>
                </div>
            </div>
        </div>
    );
}

const cardItems = [
    {
        title: "“Every bite feels like it was made with love. The pistachio tart is my absolute favorite!”",
        name: " — Emily R.",
        image: "/images/cakes.webp"
    },
    {title: "Tarts", name: "dsad", image: "/images/tarts.webp"},
    {title: "Mini bakes", name: "dasd", image: "/images/mini_bakes.webp"},
    {
        title: "“Every bite feels like it was made with love. The pistachio tart is my absolute favorite!”",
        name: " — Emily R.",
        image: "/images/cakes.webp"
    },
    {title: "Tarts", name: "dsad", image: "/images/tarts.webp"},
    {title: "Mini bakes", name: "dasd", image: "/images/mini_bakes.webp"},
];

function TestomonialCard({title, name, image}: { title: string; name: string; image: string }) {
    return (
        <div className="testimonials-active transition-all duration-300 my-4 ">
            <div
                className="py-5 px-7 w-56 h-64 sm:h-72 xl:w-72 xl:h-96 border-[#3B3B3B] border rounded-xl bg-[#FDFBF8] space-y-6">
                <div className="w-full flex justify-center items-center">
                    <Image src={image} alt={image}
                           width={75}
                           height={75}
                           className="rounded-full bg-gray-100 w-19 h-19"/>
                </div>
                <p className={`${quicksand.className} text-sm md:text-md text-black`}>
                    {title}
                </p>
                <p className={`${quicksand.className} text-sm md:text-md text-black`}>
                    {name}
                </p>
            </div>
        </div>

    );
}