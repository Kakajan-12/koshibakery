"use client";

import {formatPrice} from "@/lib/price";
import {htmlToText, isEmptyHtml, safeHtml} from "@/lib/html";
import React, {useEffect, useState} from "react";
import {useParams} from "next/navigation";
import Image from "next/image";
import {manrope, raleway} from "@/app/fonts";
import {Check, ChevronDown, ChevronLeft, ChevronRight, Clock, ShoppingBag, Truck, Wheat} from "lucide-react";
import {useCart} from "@/app/context/CartContext";
import {Skeleton} from "@/components/ui/skeleton";
import LoadError from "@/components/LoadError";
import Link from "next/link";

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
    product_availability: number | string;
    category_name?: string | null;
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

// Раскрывающийся блок с подробностями (состав, доставка)
function DetailsSection({title, icon, open, onToggle, children}: {
    title: string;
    icon: React.ReactNode;
    open: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl bg-white ring-1 ring-[#B8485B]/10 overflow-hidden">
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                className="w-full flex items-center gap-3 px-5 py-4 text-left cursor-pointer transition-colors hover:bg-[#FBF7F6]
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#B8485B]/50"
            >
                <span className="w-9 h-9 rounded-full bg-[#B8485B]/10 text-[#B8485B] flex items-center justify-center shrink-0">
                    {icon}
                </span>
                <span className={`${raleway.className} flex-1 text-base xl:text-lg font-bold text-[#12100F]`}>{title}</span>
                <ChevronDown
                    aria-hidden="true"
                    className={`w-5 h-5 text-[#B8485B] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                />
            </button>
            <div
                className="grid transition-[grid-template-rows] duration-300 ease-out"
                style={{gridTemplateRows: open ? "1fr" : "0fr"}}
            >
                <div className="overflow-hidden">
                    <div className={`${manrope.className} px-5 pb-5 pt-1 text-sm sm:text-base text-[#6F5E53] space-y-4`}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

const MenuItem = () => {
    const {id} = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [gallery, setGallery] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // Увеличивается по кнопке «Try again» — запускает загрузку заново
    const [attempt, setAttempt] = useState(0);
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
        if (!product || !selectedVariant || isInCart) return;

        addToCart({
            id: product.id,
            product_name: product.product_name,
            main_image: product.main_image,
            price: selectedVariant.price,
            variantName: selectedVariant.variant_name,
        });
    };

    const handleRemoveFromCart = () => {
        if (product && selectedVariant) removeFromCart(product.id, selectedVariant.variant_name);
    };


    useEffect(() => {
        if (!id) return;
        const fetchProduct = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/product/${id}`,
                    {cache: "no-store"}
                );
                // 404 — товара нет (не ошибка сервера): ниже покажем «не найден», а не «не удалось загрузить»
                if (res.status === 404) {
                    setProduct(null);
                    setError(null);
                    return;
                }
                if (!res.ok) throw new Error("Failed to load product");
                const data = await res.json();

                const formattedProduct = {
                    ...data,
                    main_image: `${process.env.NEXT_PUBLIC_API_URL}/${data.main_image.replace(/\\/g, "/")}`,
                };

                setProduct(formattedProduct);
                setError(null);

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
    }, [id, attempt]);

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

    if (loading) {
        return (
            <div className="mt-24 my-container mx-auto" aria-busy="true" aria-label="Loading product">
                <div className="container mx-auto px-4 pt-6 pb-16">
                    <div className="main-block-color p-5 sm:p-8 rounded-3xl">
                        <Skeleton className="h-4 w-48 mb-6"/>
                        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                            <div>
                                <Skeleton className="aspect-square w-full rounded-2xl"/>
                                <div className="flex gap-3 mt-4">
                                    {Array.from({length: 3}).map((_, i) => <Skeleton key={i} className="w-20 h-20 rounded-xl"/>)}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <Skeleton className="h-4 w-24"/>
                                <Skeleton className="h-10 w-3/4"/>
                                <Skeleton className="h-9 w-28"/>
                                <Skeleton className="h-4 w-full"/>
                                <Skeleton className="h-4 w-5/6"/>
                                <Skeleton className="h-16 w-full rounded-2xl"/>
                                <div className="flex gap-3 pt-2">
                                    <Skeleton className="h-14 w-28 rounded-2xl"/>
                                    <Skeleton className="h-14 w-28 rounded-2xl"/>
                                </div>
                                <Skeleton className="h-14 w-full rounded-full"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    // Ошибка и «не найден» — внутри обычной панели страницы, с отступом под фиксированную шапку
    if (error || !product) {
        return (
            <div className="mt-24 my-container mx-auto">
                <div className="container mx-auto px-4 pt-6 pb-20">
                    <div className="main-block-color p-6 rounded-xl min-h-[400px] flex items-center justify-center">
                        {error ? (
                            <LoadError
                                what="this product"
                                onRetry={() => {
                                    setError(null);
                                    setLoading(true);
                                    setAttempt((a) => a + 1);
                                }}
                            />
                        ) : (
                            <div className="text-center space-y-3 py-10">
                                <p className={`${raleway.className} text-xl font-bold text-[#12100F]`}>Product not found</p>
                                <p className={`${manrope.className} text-sm text-[#6F5E53]`}>
                                    It may have been removed from the menu.
                                </p>
                                <Link href="/menu" className={`${manrope.className} link-underline text-sm font-semibold text-[#B8485B]`}>
                                    Back to the menu
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    const inStock = Number(product.product_availability) === 1;
    const productName = htmlToText(product.product_name);
    const hasIngredients = !isEmptyHtml(product.product_ingredients);
    const hasAllergens = product.allergens && product.allergens.length > 0;
    const hasDelivery = !isEmptyHtml(product.delivery);
    const multipleImages = gallery.length > 1;

    return (
        <div className="mt-24 my-container mx-auto">
            <div className="container mx-auto px-4 pt-6 pb-16">
                <div className="main-block-color p-5 sm:p-8 rounded-3xl">
                    <nav aria-label="Breadcrumb" className={`${manrope.className} mb-6 text-sm text-[#6F5E53]`}>
                        <ol className="flex flex-wrap items-center gap-1.5">
                            <li><Link href="/menu" className="link-underline hover:text-[#B8485B]">Menu</Link></li>
                            {product.category_name && (
                                <>
                                    <li aria-hidden="true"><ChevronRight className="w-3.5 h-3.5"/></li>
                                    <li>{product.category_name}</li>
                                </>
                            )}
                            <li aria-hidden="true"><ChevronRight className="w-3.5 h-3.5"/></li>
                            <li aria-current="page" className="font-semibold text-[#12100F]">{productName}</li>
                        </ol>
                    </nav>

                    <div className="grid lg:grid-cols-2 gap-8 xl:gap-12 items-start">
                        {/* Галерея: стрелки и счётчик — только если фото больше одного */}
                        <div className="lg:sticky lg:top-28">
                            <div className="relative aspect-square overflow-hidden rounded-2xl bg-white shadow-sm">
                                {gallery.length > 0 && (
                                    <Image
                                        src={gallery[current].image}
                                        alt={`${productName} — photo ${current + 1}`}
                                        fill
                                        priority
                                        sizes="(max-width: 1024px) 100vw, 600px"
                                        className="object-cover"
                                    />
                                )}
                                {multipleImages && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={prev}
                                            aria-label="Previous photo"
                                            className="absolute top-1/2 left-3 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 backdrop-blur-sm shadow-md
                                                       flex items-center justify-center cursor-pointer transition hover:bg-white hover:scale-105"
                                        >
                                            <ChevronLeft className="w-5 h-5 text-[#12100F]"/>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={next}
                                            aria-label="Next photo"
                                            className="absolute top-1/2 right-3 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 backdrop-blur-sm shadow-md
                                                       flex items-center justify-center cursor-pointer transition hover:bg-white hover:scale-105"
                                        >
                                            <ChevronRight className="w-5 h-5 text-[#12100F]"/>
                                        </button>
                                        <span className={`${manrope.className} absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/55 text-white text-xs`}>
                                            {current + 1} / {gallery.length}
                                        </span>
                                    </>
                                )}
                            </div>

                            {multipleImages && (
                                <div className="flex gap-3 mt-3 -mx-1.5 p-1.5 overflow-x-auto">
                                    {gallery.map((img, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => setCurrent(index)}
                                            aria-label={`Show photo ${index + 1}`}
                                            aria-current={index === current}
                                            className={`relative w-20 h-20 shrink-0 rounded-xl overflow-hidden cursor-pointer transition
                                                ${index === current
                                                ? "ring-2 ring-[#B8485B] ring-offset-2 ring-offset-[#F6EEEC]"
                                                : "opacity-70 hover:opacity-100"}`}
                                        >
                                            <Image src={img.image} alt="" fill sizes="80px" className="object-cover"/>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <div className="flex flex-wrap items-center gap-3">
                                    {product.category_name && (
                                        <span className={`${manrope.className} text-xs uppercase tracking-[0.16em] text-[#B8485B]`}>
                                            {product.category_name}
                                        </span>
                                    )}
                                    <span
                                        className={`${manrope.className} inline-flex items-center gap-1.5 h-7 px-3 rounded-full bg-white text-xs font-semibold shadow-sm ${
                                            inStock ? "text-[#2F6B3F]" : "text-[#9A5B13]"
                                        }`}
                                    >
                                        <span className={`w-1.5 h-1.5 rounded-full ${inStock ? "bg-[#3C9A57]" : "bg-[#D18A2C]"}`} aria-hidden="true"/>
                                        {inStock ? "In stock" : "Pre-order"}
                                    </span>
                                </div>

                                <h1
                                    className={`${raleway.className} text-3xl sm:text-4xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-[#12100F] leading-tight`}
                                    dangerouslySetInnerHTML={{__html: safeHtml(product.product_name)}}
                                />

                                {selectedVariant && (
                                    <p className={`${manrope.className} text-2xl sm:text-3xl lg:text-2xl xl:text-3xl font-bold text-[#B8485B]`}>
                                        £{formatPrice(selectedVariant.price)}
                                    </p>
                                )}

                                {!isEmptyHtml(product.product_desc) && (
                                    <div
                                        className={`${manrope.className} text-base sm:text-lg lg:text-base xl:text-lg text-[#6F5E53] leading-relaxed`}
                                        dangerouslySetInnerHTML={{__html: safeHtml(product.product_desc)}}
                                    />
                                )}
                            </div>

                            {!isEmptyHtml(product.notice) && (
                                <div className="flex items-start gap-3 rounded-2xl bg-[#FFF6E8] ring-1 ring-[#D18A2C]/25 p-4">
                                    <Clock className="w-5 h-5 shrink-0 text-[#9A5B13] mt-0.5" aria-hidden="true"/>
                                    <div
                                        className={`${manrope.className} text-sm text-[#7A4A12]`}
                                        dangerouslySetInnerHTML={{__html: safeHtml(product.notice)}}
                                    />
                                </div>
                            )}

                            {product.variants && product.variants.length > 0 && (
                                <div className="space-y-3">
                                    <p className={`${raleway.className} text-base font-bold text-[#12100F]`} id="size-label">
                                        Size
                                    </p>
                                    <div role="radiogroup" aria-labelledby="size-label" className="flex flex-wrap gap-3">
                                        {product.variants.map((variant) => {
                                            const active = selectedVariant?.id === variant.id;
                                            return (
                                                <button
                                                    key={variant.id}
                                                    type="button"
                                                    role="radio"
                                                    aria-checked={active}
                                                    onClick={() => setSelectedVariant(variant)}
                                                    className={`${manrope.className} min-w-28 px-4 py-2.5 rounded-2xl text-left cursor-pointer transition
                                                                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8485B]/50 ${
                                                        active
                                                            ? "bg-[#B8485B] text-white shadow-md"
                                                            : "bg-white text-[#12100F] ring-1 ring-[#B8485B]/20 hover:ring-[#B8485B]/50"
                                                    }`}
                                                >
                                                    <span className="block text-sm font-semibold">{variant.variant_name}</span>
                                                    <span className={`block text-xs ${active ? "text-white/80" : "text-[#6F5E53]"}`}>
                                                        £{formatPrice(variant.price)}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Кнопка добавляет в корзину; когда товар уже там — показываем это и даём перейти в корзину */}
                            {isInCart ? (
                                <div className="space-y-3">
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <div
                                            role="status"
                                            className={`${manrope.className} flex-1 inline-flex items-center justify-center gap-2 h-12 xl:h-14 rounded-full
                                                        bg-[#EAF5EC] text-[#2F6B3F] font-semibold`}
                                        >
                                            <Check className="w-5 h-5" aria-hidden="true"/>
                                            Added to cart
                                        </div>
                                        <Link
                                            href="/cart"
                                            className={`${manrope.className} flex-1 inline-flex items-center justify-center gap-2 h-12 xl:h-14 rounded-full
                                                        main-button-color text-white font-semibold shadow-md transition hover:brightness-110
                                                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8485B]/50 focus-visible:ring-offset-2`}
                                        >
                                            <ShoppingBag className="w-5 h-5" aria-hidden="true"/>
                                            View cart
                                        </Link>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleRemoveFromCart}
                                        className={`${manrope.className} link-underline text-sm text-[#6F5E53] cursor-pointer hover:text-[#B8485B]`}
                                    >
                                        Remove from cart
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleAddToCart}
                                    disabled={!selectedVariant}
                                    className={`${manrope.className} w-full inline-flex items-center justify-center gap-2 h-12 xl:h-14 rounded-full
                                                main-button-color text-white text-base font-semibold shadow-md cursor-pointer transition
                                                hover:brightness-110 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed
                                                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8485B]/50 focus-visible:ring-offset-2`}
                                >
                                    <ShoppingBag className="w-5 h-5" aria-hidden="true"/>
                                    Add to cart
                                    {selectedVariant && <span className="opacity-80">· £{formatPrice(selectedVariant.price)}</span>}
                                </button>
                            )}

                            {(hasIngredients || hasAllergens || hasDelivery) && (
                                <div className="space-y-3 pt-2">
                                    {(hasIngredients || hasAllergens) && (
                                        <DetailsSection
                                            title="Ingredients & allergens"
                                            icon={<Wheat className="w-4 h-4"/>}
                                            open={isIngredientsOpen}
                                            onToggle={() => setIsIngredientsOpen(!isIngredientsOpen)}
                                        >
                                            {hasIngredients && (
                                                <div dangerouslySetInnerHTML={{__html: safeHtml(product.product_ingredients)}}/>
                                            )}
                                            {hasAllergens && (
                                                <div className="space-y-2">
                                                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#12100F]">Contains</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {product.allergens.map((a) => (
                                                            <span key={a.id} className="px-3 py-1 rounded-full bg-[#F6EEEC] text-sm text-[#12100F]">
                                                                {a.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </DetailsSection>
                                    )}

                                    {hasDelivery && (
                                        <DetailsSection
                                            title="Delivery"
                                            icon={<Truck className="w-4 h-4"/>}
                                            open={isDeliveryOpen}
                                            onToggle={() => setIsDeliveryOpen(!isDeliveryOpen)}
                                        >
                                            <div dangerouslySetInnerHTML={{__html: safeHtml(product.delivery)}}/>
                                        </DetailsSection>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div
                        className={`${raleway.className} mt-16 mb-6 text-center font-bold text-xl md:text-2xl lg:text-3xl xl:text-4xl max-w-[900px] mx-auto text-[#12100F]`}>
                        Perfect for special occasions or as a luxurious treat for yourself.
                    </div>
                    <div
                        className="h-20 bg-repeat-x bg-bottom md:h-40 mt-6"
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
