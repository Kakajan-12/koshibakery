import Image from "next/image";
import {quicksand, sora} from "@/app/fonts";
import Link from "next/link";
import {ArrowRight} from "lucide-react";

export default function Hero() {
    return (
        <div className="my-container mx-auto">
            <div className="relative pt-[64px] mb-20 lg:mb-40">
                <div className="hidden sm:block absolute top-0 right-6 lg:-top-10 lg:right-30">
                    <Image
                        src="/images/main_hero.webp"
                        alt="cake"
                        className="w-56 md:w-72 lg:w-[450px]"
                        width={900}
                        height={600}
                    />
                </div>

                <div className="container mx-auto px-4">
                    <div className="flex flex-col sm:h-[250px] lg:h-[450px]">
                        <div className="h-full space-y-2 lg:max-w-[500px] lg:space-y-4 xl:max-w-[900px]">
                            <h1 className={`${sora.className} text-2xl font-thin pt-6 sm:text-4xl lg:pt-16 xl:text-6xl`}>A
                                Little
                                Slice of Joy</h1>
                            <p className={`${quicksand.className} text-sm text-[#6F5E53] font-medium sm:text-md xl:text-lg sm:w-96`}>A
                                boutique bakery
                                offering thoughtfully made cakes and pastries — for morning coffee or meaningful
                                celebrations.</p>
                        </div>
                        <div className="-mt-12 flex justify-center sm:hidden">
                            <Image
                                src="/images/main_hero.webp"
                                alt="cake"
                                className="w-full"
                                width={900}
                                height={600}
                            />
                        </div>
                        <div className="w-full flex justify-center sm:justify-start">
                            <Link
                                href="/menu"
                                className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#f1c90d] text-white text-lg font-medium shadow-lg hover:shadow-yellow-400/60 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                            >
                                <span className="relative z-10">Order now</span>
                                <ArrowRight
                                    className="relative z-10 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"/>
                                <div
                                    className="absolute inset-0 bg-gradient-to-r from-[#ffe55b] to-[#f1c90d] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                            </Link>

                        </div>

                    </div>

                </div>
            </div>
            <div className="">
                <div className="container mx-auto px-4">
                    <div className={`${sora.className} text-center text-xl lg:text-4xl mb-5 lg:mb-18`}>More Than Just
                        Cakes
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-40 xl:gap-70 space-y-6">
                        <div className="w-full">
                            <h6 className={`${sora.className} py-2 text-md font-extralight lg:text-2xl`}>Reliable Delivery</h6>
                            <p className={`${quicksand.className} text-[#6F5E53]`}>Get your cakes and pastries delivered
                                fresh to your door — carefully packed and always on
                                time.</p>
                        </div>
                        <div className="w-full">
                            <h6 className={`${sora.className} py-2 text-md font-extralight lg:text-2xl`}>Honest
                                Ingredients</h6>
                            <p className={`${quicksand.className} text-[#6F5E53]`}>No mixes, no shortcuts. Just real butter, fresh cream, and simple ingredients that speak for themselves.</p>
                        </div>
                        <div className="w-full">
                            <h6 className={`${sora.className} py-2 text-md font-extralight lg:text-2xl`}>Beautiful in Every Detail</h6>
                            <p className={`${quicksand.className} text-[#6F5E53]`}>Each item is carefully finished by hand — because we believe great taste deserves great presentation.</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    )
}