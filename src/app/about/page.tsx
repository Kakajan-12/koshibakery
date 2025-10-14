import {quicksand, sora} from "@/app/fonts";
import Image from "next/image";

const About = ()=>{
    return(
        <div className="flex flex-col space-y-2">
            <div className="my-container mx-auto mt-[64px] relative"
                 style={{
                     backgroundImage: `url('/images/about_bg.webp')`,
                     backgroundRepeat: 'no-repeat',
                     backgroundSize: 'cover',
                     backgroundPosition: 'center',
                 }}>
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-transparent z-10"/>
                <div className="container mx-auto px-4">
                    <div className="pt-9 lg:pt-18 pb-10 lg:pb-38 relative z-20 md:max-w-[500px] mx-auto">
                        <h6 className={`${sora.className} text-white text-xl md:text-4xl text-center md:text-left mb-2`}>About
                            Us</h6>
                        <p className={`${quicksand.className} text-white text-[#6F5E53] md:text-lg`}>We are a patisserie
                            proudly located in the heart of central London, nestled on the vibrant and
                            diverse Edgware Road. Established in 2019, Koşi Bakery was born from a deep passion for
                            baking
                            and a desire to share authentic flavours with our community. What started as a love for
                            traditional sweets soon evolved into a thriving bakery where quality, creativity, and
                            heritage
                            come together.</p>
                        <p className={`${quicksand.className} text-white text-[#6F5E53] md:text-lg`}>The name “Koşi
                            Bakery” carries personal significance. It originates from the small, culturally
                            rich town of Koşi in Turkmenistan — the birthplace of our founder and the source of much of
                            our
                            culinary inspiration. We honour these roots by incorporating time-honoured recipes and
                            techniques into many of our creations.</p>
                    </div>

                </div>
            </div>
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row space-y-2 md:space-x-2 pb-28">
                    <div className="w-full md:w-1/2 flex-1">
                        <Image src="/images/about.jpg" alt="about_us"
                               width={500}
                               height={500}
                        className="rounded-md w-full object-cover transform scale-x-[-1] h-96"/>
                    </div>
                    <div className="rounded-md bg-[#FFEFAA] py-10 px-4 space-y-2 md:space-y-6 md:w-1/2">
                        <div className="space-y-2">
                            <h6 className={`${sora.className} text-xl font-bold md:text-4xl`}>Koşi bakery</h6>
                            <p className={`${quicksand.className} text-md `}>At Koşi Bakery, we serve more than just pastries — we offer a story in every bite. From elegant patisserie items to rustic favourites and modern classics, our menu reflects both our Turkmen heritage and the multicultural spirit of London. Whether you’re visiting for a sweet treat, a custom cake, or something truly unique, Koşi Bakery is your home for heartfelt, handcrafted baking</p>
                        </div>
                        <div className="space-y-2">
                            <p className={`${quicksand.className} text-lg md:text-xl font-bold`}>Opening hours:</p>
                            <div className="flex flex-col">
                                <div className="flex justify-between">
                                    <p className={`${quicksand.className} text-md`}>Monday - Friday</p>
                                    <p className={`${quicksand.className} text-md`}>09/00 - 16/00</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className={`${quicksand.className} text-md`}>Saturday - Sunday</p>
                                    <p className={`${quicksand.className} text-md`}>10/00 - 19/00</p>
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