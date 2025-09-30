"use client";
import {useEffect, useState} from "react";
import Image from "next/image";
import {quicksand} from "@/app/fonts";
import { useCategory } from "@/app/context/CategoryContext";

type Category = {
    id: number;
    name: string;
    image: string;
};

export default function Categories() {
    const { selectedCategory, setSelectedCategory } = useCategory()
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product-category`, {
                    cache: "no-store",
                });
                if (!res.ok) throw new Error("Failed to load categories");

                const data: Category[] = await res.json();

                const formatted = data.map((item) => ({
                    ...item,
                    image: `${process.env.NEXT_PUBLIC_API_URL}/${item.image.replace(/\\/g, "/")}`,
                }));

                setCategories(formatted);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) {
        return <p className="text-center py-10">Loading...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500 py-10">{error}</p>;
    }

    return (
        <div className="container mx-auto px-4 py-14">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-8 justify-items-center">
                <div
                    onClick={() => setSelectedCategory(null)} // при клике сбрасываем фильтр
                    className={`flex flex-col items-center text-center cursor-pointer ${
                        selectedCategory === null ? "scale-105" : ""
                    }`}
                >
                    <div
                        className={`w-24 h-24 sm:w-28 sm:h-28 lg:w-36 lg:h-36 rounded-full overflow-hidden flex items-center justify-center border-4 bg-gray-200
                        ${selectedCategory === null ? "border-green-700" : "border-transparent"}`}>
                        <span className="text-gray-600 font-bold">All</span>
                    </div>
                    <p
                        className={`${quicksand.className} mt-2 font-bold text-md sm:text-lg lg:text-xl text-[#6F5E53]`}
                    >
                        All
                    </p>
                </div>
                {categories.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => setSelectedCategory(selectedCategory === item.id ? null : item.id)}
                        className={`flex flex-col items-center text-center cursor-pointer transition-transform 
              ${selectedCategory === item.id ? "scale-105" : ""}`}
                    >
                        <div
                            className={`w-24 h-24 sm:w-28 sm:h-28 lg:w-36 lg:h-36 rounded-full overflow-hidden border-4 transition-colors 
                ${selectedCategory === item.id ? "border-green-700" : "border-transparent"}`}
                        >
                            <Image
                                src={item.image}
                                alt={item.name}
                                width={128}
                                height={128}
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <p
                            className={`${quicksand.className} mt-2 font-bold text-md sm:text-lg lg:text-xl text-[#6F5E53]`}
                        >
                            {item.name}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
