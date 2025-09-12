import {quicksand, sora} from "@/app/fonts";
import { IoLocationOutline } from "react-icons/io5";
import { FiPhone, FiFacebook, FiLinkedin  } from "react-icons/fi";
import { MdOutlineMail } from "react-icons/md";
import { FaInstagram } from "react-icons/fa6";
import { RiTwitterXLine } from "react-icons/ri";
import Link from "next/link";
import Image from "next/image";
export default function Footer() {
    return (
        <div
            className="footer py-10">
            <div className="container mx-auto px-4">
                <div className="pt-20 pb-10">
                    <div
                        className={`${sora.className} text-white text-lg font-bold mb-1 md:mb-2 lg:mb-3 xl:mb-4 sm:text-xl lg:text-2xl xl:text-5xl`}>Koşi
                        bakery
                    </div>
                    <div className="lg:flex lg:justify-between lg:space-x-4">
                        <div className="mb-4 space-y-4 lg:w-2/3">
                            <p className={`${quicksand.className} text-white text-xs sm:text-sm`}>The name “Koşi Bakery”
                                carries personal significance. It originates from the small, culturally rich town of
                                Koşi in
                                Turkmenistan — the birthplace of our founder and the source of much of our culinary
                                inspiration. We honour these roots by incorporating time-honoured recipes and techniques
                                into many of our creations.
                            </p>
                            <div className="hidden space-y-4 lg:block">
                                <div className="flex items-center space-x-2"><IoLocationOutline color="#ffffff"
                                                                                                size={20}/><p
                                    className={`${quicksand.className} text-white text-md`}>Address</p></div>
                                <div className="flex items-center space-x-2"><FiPhone color="#ffffff" size={20}/><p
                                    className={`${quicksand.className} text-white text-md`}>Phone</p></div>
                                <div className="flex items-center space-x-2"><MdOutlineMail color="#ffffff" size={20}/>
                                    <p className={`${quicksand.className} text-white text-md`}>mail@koshibakery.com</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div className="flex flex-col justify-between">
                                <div className="space-y-4 lg:hidden">
                                    <div className="flex items-center space-x-2"><IoLocationOutline color="#ffffff"
                                                                                                    size={20}/><p
                                        className={`${quicksand.className} text-white text-md`}>Address</p></div>
                                    <div className="flex items-center space-x-2"><FiPhone color="#ffffff" size={20}/><p
                                        className={`${quicksand.className} text-white text-md`}>Phone</p></div>
                                    <div className="flex items-center space-x-2"><MdOutlineMail color="#ffffff"
                                                                                                size={20}/>
                                        <p className={`${quicksand.className} text-white text-md`}>mail@koshibakery.com</p>
                                    </div>
                                </div>
                                <div className="flex space-x-2 lg:hidden">
                                    <Link href="#"><FaInstagram color="#ffffff" size={20}/></Link>
                                    <Link href="#"><FiFacebook color="#ffffff" size={20}/></Link>
                                    <Link href="#"><FiLinkedin color="#ffffff" size={20}/></Link>
                                    <Link href="#"><RiTwitterXLine color="#ffffff" size={20}/></Link>
                                </div>
                            </div>

                            <div className="space-y-4 flex flex-col lg:w-full">
                                <div className={`${sora.className} text-white font-semibold text-md`}>Quick Links</div>
                                <Link href="/about" className={`${quicksand.className} text-white text-md`}>About
                                    Us</Link>
                                <Link href="/contact" className={`${quicksand.className} text-white text-md`}>Contact
                                    Us</Link>
                                <Link href="/menu" className={`${quicksand.className} text-white text-md`}>Menu</Link>
                                <Link href="/" className={`${quicksand.className} text-white text-md`}>Main</Link>
                                <div className="hidden flex space-x-2 lg:flex">
                                    <Link href="#"><FaInstagram color="#ffffff" size={20}/></Link>
                                    <Link href="#"><FiFacebook color="#ffffff" size={20}/></Link>
                                    <Link href="#"><FiLinkedin color="#ffffff" size={20}/></Link>
                                    <Link href="#"><RiTwitterXLine color="#ffffff" size={20}/></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center items-center space-x-1 pb-2">
                    <div className={`${sora.className} text-white text-xs`}>All rights reserved | Powered by</div>
                    <Image src="/hebent_logo.svg" alt="hebent_logo"
                           width={50}
                           height={50}
                           className="w-5"/>
                </div>
            </div>
        </div>
    )
}
