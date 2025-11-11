import Image from "next/image";
import {manrope, raleway} from "@/app/fonts";
import Link from "next/link";
import {ArrowRight} from "lucide-react";

export default function Hero() {
    return (
        <div>
            <div className="my-container mx-auto bg-[#E6BEBD]">
                <div className="pt-24 lg:pt-34 pb-12 lg:pb-22">
                    <div className="container mx-auto px-4">
                        <div className="flex justify-between items-center">
                            <div className="flex flex-col space-y-6 sm:max-w-96 md:max-w-full md:w-2/3">
                                <div className="h-full space-y-6">
                                    <h1 className={`${raleway.className} text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold pt-6 text-center sm:text-left`}>A
                                        Taste of Perfection
                                        in Every Bite</h1>
                                    <p className={`${manrope.className} text-md sm:text-lg lg:text-xl text-[#833B45] font-medium text-center sm:text-left sm:w-[500px] md:w-[600px]`}>A
                                        boutique bakery offering thoughtfully made cakes and pastries — for morning
                                        coffee or meaningful celebrations.</p>
                                </div>
                                <div className="w-full flex justify-center sm:justify-start pt-6">
                                    <Link
                                        href="/menu"
                                        className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full
             bg-[#833B45] text-white text-lg font-medium shadow-md shadow-[#5C262E]/40
             hover:shadow-xl hover:shadow-[#F3CBB6]/60 transition-all duration-300 hover:-translate-y-1"
                                    >
                                        <span className="relative z-10">Order now</span>
                                        <ArrowRight
                                            className="relative z-10 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"/>
                                        <div
                                            className="absolute inset-0 bg-gradient-to-r from-[#C9887B] to-[#F3CBB6]
               opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full mix-blend-overlay"
                                        ></div>
                                    </Link>
                                </div>

                            </div>
                            <div className="hidden sm:block w-full md:w-1/3">
                                <Image
                                    src="/images/main_hero.webp"
                                    alt="cookie"
                                    width={900}
                                    height={600}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-4">
                <div className="py-18">
                    <div className="container mx-auto px-4">
                        <div className={`${raleway.className} text-center font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-5 lg:mb-18`}>More Than
                            Just
                            Cakes
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-40 xl:gap-70 space-y-6">
                            <div className="w-full">
                                <h6 className={`${raleway.className} py-2 text-lg sm:text-xl md:text-2xl lg:text-2xl`}>Reliable
                                    Delivery</h6>
                                <p className={`${manrope.className} text-sm md:text-md text-[#6F5E53]`}>Get your cakes and pastries
                                    delivered
                                    fresh to your door — carefully packed and always on
                                    time.</p>
                            </div>
                            <div className="w-full">
                                <h6 className={`${raleway.className} py-2 text-lg sm:text-xl md:text-2xl lg:text-2xl`}>Honest
                                    Ingredients</h6>
                                <p className={`${manrope.className} text-sm md:text-md text-[#6F5E53]`}>No mixes, no shortcuts. Just real
                                    butter, fresh cream, and simple ingredients that speak for themselves.</p>
                            </div>
                            <div className="w-full">
                                <h6 className={`${raleway.className} py-2 text-lg sm:text-xl md:text-2xl lg:text-2xl`}>Beautiful
                                    in Every Detail</h6>
                                <p className={`${manrope.className} text-sm md:text-md text-[#6F5E53]`}>Each item is carefully finished
                                    by hand — because we believe great taste deserves great presentation.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    )
}