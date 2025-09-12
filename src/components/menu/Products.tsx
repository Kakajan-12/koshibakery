"use client";
import Image from "next/image";
import {quicksand, sora} from "@/app/fonts";
import { FaShoppingCart } from "react-icons/fa";

type Product = {
    image: string;
    title: string;
    text: string;
    price: string;
};

const categories: Product[] = [
    { title: "Chocolate Ganache", image: "/images/cakes.webp", text:"Rich chocolate cake with smooth dark ganache and a hint of espresso.", price:"15"},
    { title: "Chocolate Ganache", image: "/images/tarts.webp", text:"Rich chocolate cake with smooth dark ganache and a hint of espresso.", price:"15"},
    { title: "Chocolate Ganache", image: "/images/mini_bakes.webp", text:"Rich chocolate cake with smooth dark ganache and a hint of espresso.", price:"15"},
    { title: "Chocolate Ganache", image: "/images/cookies.webp", text:"Rich chocolate cake with smooth dark ganache and a hint of espresso.", price:"15"},
    { title: "Chocolate Ganache", image: "/images/custom.webp", text:"Rich chocolate cake with smooth dark ganache and a hint of espresso.", price:"15"},
    { title: "Chocolate Ganache", image: "/images/drinks.webp", text:"Rich chocolate cake with smooth dark ganache and a hint of espresso.", price:"15"},
    { title: "Chocolate Ganache", image: "/images/mini_bakes.webp", text:"Rich chocolate cake with smooth dark ganache and a hint of espresso.", price:"15"},
    { title: "Chocolate Ganache", image: "/images/mini_bakes.webp", text:"Rich chocolate cake with smooth dark ganache and a hint of espresso.", price:"15"},
    { title: "Chocolate Ganache", image: "/images/mini_bakes.webp", text:"Rich chocolate cake with smooth dark ganache and a hint of espresso.", price:"15"},
    { title: "Chocolate Ganache", image: "/images/mini_bakes.webp", text:"Rich chocolate cake with smooth dark ganache and a hint of espresso.", price:"15"},
    { title: "Chocolate Ganache", image: "/images/mini_bakes.webp", text:"Rich chocolate cake with smooth dark ganache and a hint of espresso.", price:"15"},
];

export default function Products() {
    return (
        <div className="container mx-auto px-4 py-14">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
                {categories.map((item, i) => (
                    <div key={i} className="flex flex-col items-center text-center cursor-pointer border border-2 rounded-lg p-2 space-x-1">
                        <div className="w-full h-40 sm:h-60 rounded-lg overflow-hidden">
                            <Image
                                src={item.image}
                                alt={item.title}
                                width={128}
                                height={128}
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <div className="space-y-1">
                            <div className={`${quicksand.className} mt-2 font-bold text-md sm:text-lg lg:text-2xl text-[#3B3B3B] text-start`}>
                                {item.title}
                            </div>
                            <p className={`${quicksand.className} mt-2 font-bold text-sm sm:text-md lg:text-lg text-[#6F5E53] text-start`}>
                                {item.text}
                            </p>
                            <div className="w-full">
                                <button className={`${sora.className} w-full flex items-center justify-center border-2 border-[#264D30] text-[#0E2D16] font-bold rounded-lg px-8 py-1 space-x-2`}><FaShoppingCart /><div>{item.price}$</div></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
