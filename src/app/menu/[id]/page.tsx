import {quicksand, sora} from "@/app/fonts";
import {FaRegHeart} from "react-icons/fa";
import {FaShoppingBag} from "react-icons/fa";
import Image from "next/image";
import Categories from "@/components/menu/Categories";
import Products from "@/components/menu/Products";
import FilterBar from "@/components/menu/Filter";

const Menu = () => {
    return (
        <div className="my-container mx-auto mt-[64px]">
            <div className="container mx-auto px-4">
                <div className="mt-4 flex flex-col items-center justify-center h-50 lg:h-60" style={{
                    backgroundImage: "url('/images/shopping-cart.svg')",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "bottom"
                }}>
                    <h6 className={`${sora.className} pt-6 lg:pt-0 text-center font-light text-lg mb-3 sm:text-xl lg:text-4xl xl:text-5xl`}>Place
                        an Order</h6>
                    <p className={`${quicksand.className} text-[#6F5E53] text-center text-sm max-w-lg lg:text-md`}>Whether you're
                        planning a birthday, surprising a friend, or simply craving something sweet — we're here to make
                        it special.</p>
                </div>
            </div>
            <div className="relative">
                <div className="absolute inset-x-0 lg:hidden">
                    <Image src="/images/menu_bg_mobile.svg" alt="mobile menu bg"
                           width={100}
                           height={500}
                           className="w-full"/>
                </div>
                <div className="absolute inset-x-0 hidden lg:block">
                    <Image src="/images/menu_bg.webp" alt="menu bg"
                           width={900}
                           height={900}
                           className="w-full h-[800px]"/>
                </div>
                <div className="container mx-auto px-4">
                    <div className="relative pt-10">
                        <div className="flex flex-col items-start space-y-3 lg:space-y-6">
                            <div className="flex flex-col w-30 sm:w-44">
                                <div className="flex flex-col justify-center items-center space-y-2">
                                    <FaRegHeart className="w-5 h-5 sm:w-6 sm:h-6 lg:h-7" />
                                    <div className={`${sora.className} text-black font-bold text-md sm:text-xl lg:text-2xl`}>Most Loved</div>
                                </div>
                            </div>
                            <div className="flex flex-col items-center space-y-4 lg:space-y-7">
                                <div className="flex items-center space-x-6">
                                    <div className="relative">
                                        <Image src="/images/menu_card.webp" alt="menu"
                                               width={300}
                                               height={300}
                                               className="rounded-lg w-30 sm:w-44"/>
                                        <div
                                            className="absolute right-0 bottom-0 bg-[#7B3F3F80] opacity-50 rounded-lg p-2">
                                            <FaShoppingBag color="#ffffff"/>
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <p className={`${quicksand.className} font-bold text-sm sm:text-lg lg:text-2xl`}>Peanut Brownie</p>
                                        <p className={`${quicksand.className} font-bold text-sm sm:text:lg lg:text-2xl`}>$6.90</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-6">
                                    <div className="relative">
                                        <Image src="/images/menu_card.webp" alt="menu"
                                               width={300}
                                               height={300}
                                               className="rounded-lg w-30 sm:w-44"/>
                                        <div
                                            className="absolute right-0 bottom-0 bg-[#7B3F3F80] opacity-50 rounded-lg p-2">
                                            <FaShoppingBag color="#ffffff"/>
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <p className={`${quicksand.className} font-bold text-sm sm:text-lg lg:text-2xl`}>Peanut Brownie</p>
                                        <p className={`${quicksand.className} font-bold text-sm sm:text-lg lg:text-2xl`}>$6.90</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-6">
                                    <div className="relative">
                                        <Image src="/images/menu_card.webp" alt="menu"
                                               width={300}
                                               height={300}
                                               className="rounded-lg w-30 sm:w-44"/>
                                        <div
                                            className="absolute right-0 bottom-0 bg-[#7B3F3F80] opacity-50 rounded-lg p-2">
                                            <FaShoppingBag color="#ffffff"/>
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <p className={`${quicksand.className} font-bold text-sm sm:text-lg lg:text-2xl`}>Peanut Brownie</p>
                                        <p className={`${quicksand.className} font-bold text-sm sm:text-lg lg:text-2xl`}>$6.90</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -right-4 sm:right-10 -top-2 sm:top-0 lg:-right-10 lg:bottom-10">
                            <Image src="/images/menu_hero.webp" alt="menu_hero"
                                   width={500}
                                   height={500}
                                   className="opacity-50 w-36 sm:w-56 lg:opacity-100 lg:w-full"/>
                        </div>
                    </div>

                </div>
            </div>
            <div className="my-container relative z-20 bg-[#FDFBF8] mt-20">
                <Categories/>
                <FilterBar/>
                <Products/>
            </div>

        </div>
    )
}
export default Menu