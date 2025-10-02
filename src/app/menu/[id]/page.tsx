"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { sora } from "@/app/fonts";
import {Button} from "@/components/ui/button";

interface Allergen {
    id: number;
    name: string;
}

interface Product {
    id: number;
    main_image: string;
    slice_image: string;
    loved: number;
    product_name: string;
    product_desc: string;
    price: number;
    product_serves: string;
    product_ingredient_desc: string;
    product_ingredients: string;
    product_category: number;
    product_types: number;
    product_availability: number;
    allergens: Allergen[];
}

const MenuItem = () => {
    const { id } = useParams(); // достаем id из URL
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchProduct = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/product/${id}`,
                    { cache: "no-store" }
                );
                if (!res.ok) throw new Error("Failed to load product");
                const data = await res.json();

                setProduct({
                    ...data,
                    main_image: `${process.env.NEXT_PUBLIC_API_URL}/${data.main_image.replace(/\\/g, "/")}`,
                    slice_image: `${process.env.NEXT_PUBLIC_API_URL}/${data.slice_image.replace(/\\/g, "/")}`,
                });
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) return <p className="text-center py-10">Loading...</p>;
    if (error) return <p className="text-center text-red-500 py-10">{error}</p>;
    if (!product) return <p className="text-center py-10">No product found</p>;

    return (
        <div className="my-container mx-auto mt-[64px]">
            <div className="container mx-auto px-4">
                <div className="lg:flex lg:space-x-4 lg:justify-between">
                    <div>
                        <div className="space-y-2 pt-4">
                            <h1
                                className={`${sora.className} text-2xl sm:text-3xl lg:text-4xl`}
                                dangerouslySetInnerHTML={{__html: product.product_name}}
                            />
                            <div className="text-sm text" dangerouslySetInnerHTML={{__html: product.product_name}}/>
                        </div>
                        <div className="flex items-center space-x-2">
                            <p className="text-lg font-bold">£{product.price}</p>
                            <p className="text-sm text-gray-600">
                                Serves: {product.product_serves}
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <div className="w-fit">
                            <Image
                                src={product.main_image}
                                alt={product.product_name}
                                width={600}
                                height={400}
                                className="rounded-lg w-full"
                            />
                        </div>
                    </div>

                </div>
                <div className="lg:flex lg:space-x-8 lg:justify-between">
                    <div className="flex justify-center">
                        <div className="relative h-44 w-44 sm:h-56 sm:w-56 md:h-72 md:w-72 overflow-x-none">
                            <div
                                className="absolute bg-yellow-200 w-44 h-44 sm:h-56 sm:w-56 md:h-72 md:w-72 rounded-full"></div>
                            <Image
                                src={product.slice_image}
                                alt={product.product_name}
                                width={600}
                                height={400}
                                className="rounded-lg w-56 h-18 absolute -bottom-5 left-5"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="space-y-2 pt-8">
                            <p className={`${sora.className} text-md`}>Ingredients <span className="text-green-500">& Flavors</span>
                            </p>
                            <div className="text-sm text"
                                 dangerouslySetInnerHTML={{__html: product.product_ingredient_desc}}/>
                        </div>
                        <div className="flex items-center space-x-2">
                            <p className="text-lg font-bold">Ingredients:</p>
                            <p className="text-sm text-gray-600"
                               dangerouslySetInnerHTML={{__html: product.product_ingredients}}
                            />
                        </div>
                        <div>
                            <h3 className="font-semibold">Allergens:</h3>
                            <ul className="list-disc pl-5">
                                {product.allergens?.map((a) => (
                                    <li key={a.id}>{a.name}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="h-20 bg-repeat-x bg-bottom md:h-35"
                     style={{
                         backgroundImage: "url('/images/cookie1.webp')",
                         backgroundSize: "contain"
                     }}>
                </div>
                <div className="flex items-center py-4 md:justify-center">
                    <Button className="border-2 border-green-800 bg-transparent text-black w-full rounded-2xl font-bold py-3 text-md md:w-72 hover:bg-transparent cursor-pointer">
                        Order Now
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default MenuItem;
