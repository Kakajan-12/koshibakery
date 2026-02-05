'use client'

import Image from "next/image"
import Link from "next/link"
import {ArrowRight} from "lucide-react"

import {Swiper, SwiperSlide} from "swiper/react"
import {Pagination, Autoplay} from "swiper/modules"

import "swiper/css"
import "swiper/css/pagination"

import {manrope, raleway} from "@/app/fonts"

export default function Hero() {
    return (
        <div>
            <div className="my-container mx-auto">
                <Swiper
                    modules={[Pagination, Autoplay]}
                    pagination={{clickable: true}}
                    autoplay={{delay: 5000}}
                    loop
                    className="hero-swiper main-background-color"
                >
                    <SwiperSlide>
                        <div className="relative min-h-[70vh] lg:min-h-[85vh] flex items-center">

                            <Image
                                src="/teast.png"
                                alt="test"
                                fill
                                className="object-cover"
                                priority
                            />

                            <div className="absolute inset-0 bg-black/40"/>

                            <div className="relative z-20 container mx-auto px-4">
                                <div className="flex items-center">
                                    <div className="flex flex-col space-y-6 w-full md:w-2/3">
                                        <h1 className={`${raleway.className} text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold`}>
                                            A Taste of Perfection in Every Bite
                                        </h1>

                                        <p className={`${manrope.className} text-white text-sm sm:text-lg lg:text-xl max-w-[600px]`}>
                                            A boutique bakery offering thoughtfully made cakes and pastries — for
                                            morning coffee or meaningful celebrations.
                                        </p>

                                        <Link
                                            href="/menu"
                                            className="group inline-flex w-fit items-center gap-3 px-6 py-3 rounded-full
                                main-button-color text-white text-lg font-medium shadow-md
                                hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                                        >
                                            Order now
                                            <ArrowRight
                                                className="w-5 h-5 transition-transform group-hover:translate-x-1"/>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="relative min-h-[70vh] lg:min-h-[85vh] flex items-center">

                            <Image
                                src="/teast.png"
                                alt="test"
                                fill
                                className="object-cover"
                                priority
                            />

                            <div className="absolute inset-0 bg-black/40"/>

                            <div className="relative z-20 container mx-auto px-4">
                                <div className="flex items-center">
                                    <div className="flex flex-col space-y-6 w-full md:w-2/3">
                                        <h1 className={`${raleway.className} text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold`}>
                                            A Taste of Perfection in Every Bite
                                        </h1>

                                        <p className={`${manrope.className} text-white text-sm sm:text-lg lg:text-xl max-w-[600px]`}>
                                            A boutique bakery offering thoughtfully made cakes and pastries — for
                                            morning coffee or meaningful celebrations.
                                        </p>

                                        <Link
                                            href="/menu"
                                            className="group inline-flex w-fit items-center gap-3 px-6 py-3 rounded-full
                                main-button-color text-white text-lg font-medium shadow-md
                                hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                                        >
                                            Order now
                                            <ArrowRight
                                                className="w-5 h-5 transition-transform group-hover:translate-x-1"/>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </SwiperSlide>
                </Swiper>
            </div>

            <div className="py-18">
                <div className="container mx-auto px-6">
                    <div className="main-block-color rounded-lg p-2">
                        <div className="border-line rounded-lg p-8">
                            <div
                                className={`${raleway.className} main-text-color text-center font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-5 lg:mb-18`}>More
                                Than
                                Just
                                Cakes
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-20 gap-6 items-stretch">
                                <div className="w-full shadow p-3 bg-white rounded-lg flex flex-col">
                                    <h6 className={`${raleway.className} main-text-color py-2 text-lg sm:text-xl md:text-2xl lg:text-2xl`}>Reliable
                                        Delivery</h6>
                                    <p className={`${manrope.className} main-text-color text-sm md:text-md`}>Get your
                                        cakes
                                        and pastries
                                        delivered
                                        fresh to your door — carefully packed and always on
                                        time.</p>
                                </div>
                                <div className="w-full shadow p-3 bg-white rounded-lg flex flex-col">
                                    <h6 className={`${raleway.className} main-text-color py-2 text-lg sm:text-xl md:text-2xl lg:text-2xl`}>Honest
                                        Ingredients</h6>
                                    <p className={`${manrope.className} main-text-color text-sm md:text-md`}>No
                                        mixes, no
                                        shortcuts. Just real
                                        butter, fresh cream, and simple ingredients that speak for themselves.</p>
                                </div>
                                <div className="w-full shadow p-3 bg-white rounded-lg flex flex-col">
                                    <h6 className={`${raleway.className} main-text-color py-2 text-lg sm:text-xl md:text-2xl lg:text-2xl`}>Beautiful
                                        in Every Detail</h6>
                                    <p className={`${manrope.className} main-text-color text-sm md:text-md`}>Each
                                        item is
                                        carefully finished
                                        by hand — because we believe great taste deserves great presentation.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>


    )
}