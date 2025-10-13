import Image from "next/image";
import {quicksand, sora} from "@/app/fonts";
import Link from "next/link";

export default function Hero() {
    return (
        <div className="my-container mx-auto">
            <div className="relative pt-[64px] mb-20 lg:mb-40">
                <div className="absolute top-10 -left-6 lg:left-0">
                    <Image src="/images/kakao.webp" alt="kakao" className="w-24 h-72 md:w-36 md:h-96"
                           width={500}
                           height={500}/>
                </div>
                <div className="absolute top-28 right-6 opacity-25 lg:top-16 lg:right-0 lg:opacity-100">
                    <Image
                        src="/images/main_hero.webp"
                        alt="cake"
                        className="w-56 md:w-72 lg:w-[590px]"
                        width={900}
                        height={600}
                    />
                </div>

                <div className="container mx-auto px-4">
                    <div className="flex flex-col h-[280px] lg:h-[380px]">
                        <div className="h-full space-y-2 px-8 lg:max-w-[580px] lg:space-y-4 lg:pl-20 xl:max-w-[900px]">
                            <h1 className={`${sora.className} text-2xl font-thin pt-6 sm:text-4xl lg:pt-16 xl:text-6xl`}>A Little
                                Slice of Joy</h1>
                            <p className={`${quicksand.className} text-sm text-[#6F5E53] font-medium sm:text-md xl:text-lg`}>A
                                boutique bakery
                                offering thoughtfully made cakes and pastries — for morning coffee or meaningful
                                celebrations.</p>
                        </div>
                        <div className="w-full">
                            <div
                                className="flex justify-center items-center space-x-10 xl:space-x-14 group lg:justify-start lg:pl-20 w-fit">
                                <Link href="/about" className={`${sora.className} text-lg font-thin md:text-2xl`}>
                                    About Us
                                </Link>
                                <div className="relative w-max">
                                    <Image
                                        src="/images/arrow-right.svg"
                                        alt="about-arrow"
                                        width={190}
                                        height={28}
                                        className="absolute z-20 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 -translate-x-14 xl:-translate-x-20 group-hover:-translate-x-16 transition-transform duration-300 max-w-[75px] xl:max-w-[100px]"
                                    />

                                    <div className="w-13 h-13 xl:w-16 xl:h-16 rounded-full relative overflow-hidden">
                                        <div
                                            className="absolute inset-0 bg-gradient-to-l from-[#7DDF9A] to-transparent rounded-full flex justify-center items-center">
                                            <div
                                                className="w-11 h-11 xl:w-13 xl:h-13 absolute bg-[#FDFBF8] rounded-full"></div>
                                        </div>
                                    </div>
                                </div>

                            </div>
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
                            <h6 className={`${sora.className} py-2 text-md font-extralight lg:text-2xl`}>Reliable,
                                Same-Day
                                Delivery</h6>
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