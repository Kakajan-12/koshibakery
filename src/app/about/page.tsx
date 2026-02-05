import {manrope, quicksand, raleway, sora} from "@/app/fonts";
import Image from "next/image";

const About = () => {
    return (
        <div className="flex flex-col space-y-6">
            <div className="my-container mx-auto mt-[60px] main-block-color py-10 sm:py-0">
                <div className="container mx-auto px-4">
                    <div className="flex items-center lg:max-h-screen">
                        <div className="hidden sm:block w-1/3">
                            <Image src="/images/about_main.png" alt="about us" width={400} height={800}
                                   className="w-fit h-full"/>
                        </div>
                        <div className="sm:w-2/3 space-y-4">
                            <h6 className={`${raleway.className} text-3xl font-bold md:text-6xl lg:text-7xl xl:text-8xl text-center sm:text-left mb-2`}>About
                                Us</h6>
                            <p className={`${manrope.className} text-sm md:text-lg text-[#12100F]`}>We are a patisserie
                                proudly located in the heart of central London, nestled on the vibrant and
                                diverse Edgware Road. Established in 2019, Koşi Bakery was born from a deep passion for
                                baking
                                and a desire to share authentic flavours with our community. What started as a love for
                                traditional sweets soon evolved into a thriving bakery where quality, creativity, and
                                heritage
                                come together.</p>
                            <p className={`${manrope.className} text-sm md:text-lg text-[#12100F]`}>The name “Koşi
                                Bakery” carries personal significance. It originates from the small, culturally
                                rich town of Koşi in Turkmenistan — the birthplace of our founder and the source of much
                                of
                                our
                                culinary inspiration. We honour these roots by incorporating time-honoured recipes and
                                techniques into many of our creations.</p>
                        </div>

                    </div>

                </div>
            </div>
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 pb-14 items-stretch">
                    <div className=" h-[400px] lg:h-full">
                        <div className="relative w-full h-full rounded-lg overflow-hidden shadow-xl">
                            <Image
                                src="/images/about.jpg"
                                alt="Koşi Bakery interior with delicious pastries"
                                fill
                                className="object-cover"
                                priority
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                            <div
                                className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent lg:bg-gradient-to-l"></div>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center">
                        <div
                            className="rounded-md main-block-color py-12 px-8 lg:px-12 space-y-6 lg:space-y-8 h-full flex flex-col justify-center">
                            <div className="space-y-4">
                                <h1 className={`${raleway.className} text-3xl lg:text-5xl font-bold text-gray-900`}>
                                    Koşi bakery
                                </h1>
                                <div className="space-y-4">
                                    <p className={`${manrope.className} text-base lg:text-lg text-gray-700 leading-relaxed`}>
                                        At Koşi Bakery, we serve more than just pastries — we offer a story in every
                                        bite. From elegant patisserie
                                        items to rustic favourites and modern classics, our menu reflects both our
                                        Turkmen heritage and the multicultural
                                        spirit of London.
                                    </p>
                                    <p className={`${manrope.className} text-base lg:text-lg text-gray-700 leading-relaxed`}>
                                        Whether you're visiting for a sweet treat, a custom cake, or something truly
                                        unique, Koşi Bakery
                                        is your home for heartfelt, handcrafted baking.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4">
                                <h2 className={`${manrope.className} text-xl lg:text-2xl font-bold text-gray-900`}>
                                    Opening hours:
                                </h2>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className={`${manrope.className} text-base lg:text-lg font-medium text-gray-800`}>
                Monday - Sunday
              </span>
                                        <span
                                            className={`${manrope.className} text-base lg:text-lg font-semibold text-gray-900`}>
                09:00 - 18:00
              </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    )
}
export default About