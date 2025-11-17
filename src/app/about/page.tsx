import {manrope, quicksand, raleway, sora} from "@/app/fonts";
import Image from "next/image";

const About = () => {
    return (
        <div className="flex flex-col space-y-2">
            <div className="my-container mx-auto mt-[70px] md:mt-[90px] main-background-color">
                <div className="container mx-auto px-4">
                    <div className="flex items-center lg:max-h-screen">
                        <div className="hidden sm:block w-1/3">
                            <Image src="/images/about_main.png" alt="about us" width={400} height={800}
                            className="w-fit h-full"/>
                        </div>
                        <div className="sm:w-2/3 space-y-4">
                            <h6 className={`${raleway.className} text-3xl font-bold md:text-6xl lg:text-7xl xl:text-8xl text-center sm:text-left mb-2`}>About
                                Us</h6>
                            <p className={`${manrope.className} text-sm md:text-lg main-text-color`}>We are a patisserie
                                proudly located in the heart of central London, nestled on the vibrant and
                                diverse Edgware Road. Established in 2019, Koşi Bakery was born from a deep passion for
                                baking
                                and a desire to share authentic flavours with our community. What started as a love for
                                traditional sweets soon evolved into a thriving bakery where quality, creativity, and
                                heritage
                                come together.</p>
                            <p className={`${manrope.className} text-sm md:text-lg main-text-color`}>The name “Koşi
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
            <div className="my-container mx-auto">
                <div className="flex flex-col md:flex-row space-y-2 md:space-x-2 pb-28">
                    <div className="w-full flex-1 mb-0">
                        <div className="relative w-full h-96 md:h-full">
                            <Image
                                src="/images/about.jpg"
                                alt="about_us"
                                fill
                                className="rounded-md object-cover transform scale-x-[-1]"
                            />
                        </div>
                    </div>

                    <div
                        className="rounded-md main-background-color py-10 px-4 lg:px-10 space-y-2 md:space-y-6 md:w-1/2 flex flex-col justify-center h-[500px]">
                        <div className="space-y-2">
                            <h6 className={`${raleway.className} text-xl font-bold md:text-4xl`}>Koşi bakery</h6>
                            <p className={`${manrope.className} text-md`}>
                                At Koşi Bakery, we serve more than just pastries — we offer a story in every bite. From
                                elegant patisserie
                                items to rustic favourites and modern classics, our menu reflects both our Turkmen
                                heritage and the multicultural
                                spirit of London. Whether you’re visiting for a sweet treat, a custom cake, or something
                                truly unique, Koşi Bakery
                                is your home for heartfelt, handcrafted baking.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <p className={`${manrope.className} text-lg md:text-xl font-bold`}>Opening hours:</p>
                            <div className="flex flex-col">
                                <div className="flex justify-between">
                                    <p className={`${manrope.className} text-md`}>Monday - Sunday</p>
                                    <p className={`${manrope.className} text-md`}>09:00 - 18:00</p>
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