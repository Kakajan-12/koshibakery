"use client";

import React, {useEffect, useState} from "react";
import {useParams} from "next/navigation";
import Image from "next/image";
import {manrope, quicksand, raleway, sora} from "@/app/fonts";
import {Button} from "@/components/ui/button";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {FaPoundSign} from "react-icons/fa";
import {GoPlus} from "react-icons/go";
import {useCart} from "@/app/context/CartContext";

interface Allergen {
    id: number;
    name: string;
}

interface Variant {
    id: number;
    variant_name: string;
    price: number;
}

interface Product {
    id: number;
    main_image: string;
    product_name: string;
    product_desc: string;
    product_serves: string;
    product_ingredients: string;
    notice: string;
    delivery: string;
    allergens: Allergen[];
    variants?: Variant[];
}

interface GalleryImage {
    id: number;
    image: string;
    product_id: number;
}

const MenuItem = () => {
    const {id} = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [gallery, setGallery] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [current, setCurrent] = useState(0);
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
    const [isIngredientsOpen, setIsIngredientsOpen] = useState(false);
    const [isDeliveryOpen, setIsDeliveryOpen] = useState(false);
    const { cart, addToCart, removeFromCart } = useCart();

    const isInCart =
        product && selectedVariant
            ? cart.some(
                (item) =>
                    item.id === product.id &&
                    item.variantName === selectedVariant.variant_name
            )
            : false;

    const handleAddToCart = () => {
        if (!product || !selectedVariant) return;

        const cartItem = {
            id: product.id,
            product_name: product.product_name,
            main_image: product.main_image,
            price: selectedVariant.price,
            variantName: selectedVariant.variant_name,
        };

        if (isInCart) {
            removeFromCart(product.id, selectedVariant.variant_name);
        } else {
            addToCart(cartItem);
        }
    };




    useEffect(() => {
        if (!id) return;
        const fetchProduct = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/product/${id}`,
                    {cache: "no-store"}
                );
                if (!res.ok) throw new Error("Failed to load product");
                const data = await res.json();

                const formattedProduct = {
                    ...data,
                    main_image: `${process.env.NEXT_PUBLIC_API_URL}/${data.main_image.replace(/\\/g, "/")}`,
                };

                setProduct(formattedProduct);

                if (formattedProduct.variants && formattedProduct.variants.length > 0) {
                    setSelectedVariant(formattedProduct.variants[0]);
                }

            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    useEffect(() => {
        if (!id) return;
        const fetchGallery = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product-gallery`);
                if (!res.ok) throw new Error("Failed to load gallery");
                const data: GalleryImage[] = await res.json();

                const filtered = data
                    .filter((img) => img.product_id === Number(id))
                    .map((img) => ({
                        ...img,
                        image: `${process.env.NEXT_PUBLIC_API_URL}/${img.image.replace(/\\/g, "/")}`,
                    }));

                setGallery(product ? [{
                    id: 0,
                    image: product.main_image,
                    product_id: product.id
                }, ...filtered] : filtered);
            } catch (err) {
                console.error("Ошибка при загрузке галереи:", err);
            }
        };
        fetchGallery();
    }, [id, product]);

    const next = () => setCurrent((prev) => (prev + 1) % gallery.length);
    const prev = () => setCurrent((prev) => (prev - 1 + gallery.length) % gallery.length);

    if (loading) return <p className="text-center py-10">Loading...</p>;
    if (error) return <p className="text-center text-red-500 py-10">{error}</p>;
    if (!product) return <p className="text-center py-10">No product found</p>;

    return (
        <div className="mt-24 my-container mx-auto">
            <div className="container mx-auto px-4 pt-6">
                <div className="main-block-color p-6 rounded-xl">
                    <div className="flex flex-col lg:flex-row lg:space-x-4">
                        <div className="w-full">
                            {gallery.length > 0 && (
                                <>
                                    <div className="relative overflow-hidden rounded-lg group">
                                        <div className="aspect-[4/3] w-full relative overflow-hidden cursor-zoom-in">
                                            <Image
                                                src={gallery[current].image}
                                                alt={`image-${current}`}
                                                fill
                                                sizes="(max-width: 768px) 100vw, 700px"
                                                className="object-cover transition-transform duration-300 group-hover:scale-110"
                                            />
                                        </div>
                                        <button
                                            onClick={prev}
                                            className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow transition"
                                        >
                                            <ChevronLeft className="w-5 h-5 text-gray-800"/>
                                        </button>
                                        <button
                                            onClick={next}
                                            className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow transition"
                                        >
                                            <ChevronRight className="w-5 h-5 text-gray-800"/>
                                        </button>
                                    </div>

                                    <div className="flex justify-center mt-3 gap-2">
                                        {gallery.map((img, index) => (
                                            <div
                                                key={index}
                                                className={`relative w-16 h-16 rounded-md overflow-hidden cursor-pointer border-2 transition 
                                        ${index === current ? "border-[#A16D89]" : "border-transparent"}`}
                                                onClick={() => setCurrent(index)}
                                            >
                                                <Image
                                                    src={img.image}
                                                    alt={`thumb-${index}`}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="w-full">
                            <div className="space-y-1 pt-4">
                                <h1
                                    className={`${raleway.className} text-2xl sm:text-3xl lg:text-4xl`}
                                    dangerouslySetInnerHTML={{__html: product.product_name}}
                                />
                                <div className={`${manrope.className} text-sm sm:text-md text-[#6F5E53]`}
                                     dangerouslySetInnerHTML={{__html: product.product_desc}}/>
                                <div
                                    className={`${manrope.className} text-sm sm:text-md text-red-800`}>{product.notice}</div>
                                {/*<p className="text-sm text-gray-600">Serves: {product.product_serves}</p>*/}
                            </div>

                            <div className="flex items-center space-x-2 pt-2">
                                <p className={`${raleway.className} text-lg sm:text-2xl font-bold`}>Size:</p>
                                <div className="flex space-x-2">
                                    {product.variants?.map((variant) => (
                                        <Button
                                            key={variant.id}
                                            onClick={() => setSelectedVariant(variant)}
                                            className={`${quicksand.className} rounded-full px-4 py-1 text-sm transition-colors cursor-pointer
    ${
                                                selectedVariant?.id === variant.id
                                                    ? "main-button-color text-white hover:bg-[#A16D89]"
                                                    : "bg-transparent border main-border-color variant-text-color hover:bg-[#B8485B] hover:!text-white"
                                            }`}
                                        >
                                            {variant.variant_name}
                                        </Button>

                                    ))}

                                </div>
                            </div>

                            {selectedVariant && (
                                <div className="pt-2 flex items-center space-x-2">
                                    <p className={`${manrope.className} text-md sm:text-lg`}>Price:</p>
                                    <div
                                        className={`${manrope.className} flex items-center text-md sm:text-lg font-bold`}
                                    ><FaPoundSign size={14} className="font-normal"/>
                                        {selectedVariant.price}
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center py-4">
                                <Button
                                    onClick={handleAddToCart}
                                    className={`${sora.className} border-2 w-full md:w-72 rounded-full font-bold py-3 text-md transition-colors cursor-pointer
      ${
                                        isInCart
                                            ? "bg-red-600 text-white border-red-600 hover:bg-red-700"
                                            : "bg-transparent main-text-color main-border-color hover:bg-transparent"
                                    }`}
                                >
                                    {isInCart ? "Remove from Cart" : "Order Now"}
                                </Button>
                            </div>

                        </div>
                    </div>


                    <div className="lg:flex lg:space-x-8 lg:justify-between pt-6">
                        <div className="w-full">
                            <div>
                                <button
                                    onClick={() => setIsIngredientsOpen(!isIngredientsOpen)}
                                    className="w-full flex justify-between items-center px-4 py-3 border-b border-[#264D30] cursor-pointer"
                                >
                                    <div
                                        className={`${raleway.className} text-left text-md sm:text-lg md:text-xl lg:text-2xl`}>
                                        Ingredients and Allergens
                                    </div>

                                    <GoPlus
                                        className={`transform transition-transform duration-300 text-[#833B45] ${
                                            isIngredientsOpen ? "rotate-45" : ""
                                        }`}
                                        size={24}
                                    />
                                </button>

                                <div
                                    className={`overflow-hidden transition-[max-height] duration-500 ease-in-out`}
                                    style={{
                                        maxHeight: isIngredientsOpen ? "500px" : "0px",
                                    }}
                                >
                                    <div className="px-4 py-3 space-y-3">
                                        <div>
                                            <p className={`${raleway.className} text-sm sm:text-md md:text-lg font-semibold`}>Ingredients:</p>
                                            <p
                                                className={`${raleway.className} text-sm sm:text-md md:text-lg text-grey-600`}
                                                dangerouslySetInnerHTML={{__html: product.product_ingredients}}
                                            />
                                        </div>

                                        {product.allergens && product.allergens.length > 0 && (
                                            <div>
                                                <p className={`${raleway.className} text-sm sm:text-md md:text-lg font-semibold`}>Allergens:</p>
                                                <ul className="list-disc pl-5">
                                                    {product.allergens.map((a) => (
                                                        <li key={a.id}
                                                            className={`${raleway.className} text-sm sm:text-md`}>{a.name}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <button
                                    onClick={() => setIsDeliveryOpen(!isDeliveryOpen)}
                                    className="w-full flex justify-between items-center px-4 py-3 border-b border-[#264D30] cursor-pointer"
                                >
                                    <div
                                        className={`${raleway.className} text-left text-md sm:text-lg md:text-xl lg:text-2xl`}>Delivery
                                    </div>

                                    <GoPlus
                                        className={`transform transition-transform duration-300 text-[#833B45] ${
                                            isDeliveryOpen ? "rotate-45" : ""
                                        }`}
                                        size={24}
                                    />
                                </button>

                                <div
                                    className={`overflow-hidden transition-[max-height] duration-500 ease-in-out`}
                                    style={{
                                        maxHeight: isDeliveryOpen ? "500px" : "0px",
                                    }}
                                >
                                    <div className="px-4 py-3 space-y-3">
                                        <p
                                            className={`${raleway.className} text-sm sm:text-md md:text-lg text-gray-600`}
                                            dangerouslySetInnerHTML={{__html: product.delivery}}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className={`${raleway.className} mt-10 mb-6 text-center font-bold text-md md:text-2xl lg:text-3xl xl:text-5xl max-w-[900px] mx-auto pb-0 md:pb-14`}>Perfect
                        for special occasions or as a luxurious treat for
                        yourself.
                    </div>
                    <div
                        className="h-20 bg-repeat-x bg-bottom md:h-40 mt-6 mb-10 "
                        style={{
                            backgroundImage: "url('/images/cookie1.webp')",
                            backgroundSize: "contain",
                        }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default MenuItem;
