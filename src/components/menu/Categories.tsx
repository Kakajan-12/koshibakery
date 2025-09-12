"use client";
import Image from "next/image";
import {quicksand} from "@/app/fonts";

type Categories = {
    title: string;
    image: string;
};

const categories: Categories[] = [
    { title: "Cakes", image: "/images/cakes.webp" },
    { title: "Tarts", image: "/images/tarts.webp" },
    { title: "Mini Bakes", image: "/images/mini_bakes.webp" },
    { title: "Cookies", image: "/images/cookies.webp" },
    { title: "Custom", image: "/images/custom.webp" },
    { title: "Drinks", image: "/images/drinks.webp" },
    { title: "Sweet Pastries", image: "/images/mini_bakes.webp" },
    { title: "Tarts", image: "/images/mini_bakes.webp" },
    { title: "Tarts", image: "/images/mini_bakes.webp" },
    { title: "Tarts", image: "/images/mini_bakes.webp" },
    { title: "Tarts", image: "/images/mini_bakes.webp" },
];

export default function Categories() {
    return (
        <div className="container mx-auto px-4 py-14">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-8 justify-items-center">
                {categories.map((item, i) => (
                    <div key={i} className="flex flex-col items-center text-center cursor-pointer">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-36 lg:h-36 rounded-full overflow-hidden">
                            <Image
                                src={item.image}
                                alt={item.title}
                                width={128}
                                height={128}
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <p className={`${quicksand.className} mt-2 font-bold text-md sm:text-lg lg:text-xl text-[#6F5E53]`}>
                            {item.title}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
