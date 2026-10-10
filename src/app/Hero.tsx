'use client'

import Image from "next/image"
import Link from "next/link"
import {ArrowRight, ChevronLeft, ChevronRight, HandHeart, Truck, Wheat} from "lucide-react"

import {Swiper, SwiperSlide} from "swiper/react"
import {A11y, Autoplay, Navigation, Pagination} from "swiper/modules"

import "swiper/css"
import "swiper/css/pagination"

import {manrope, raleway} from "@/app/fonts"
import {useEffect, useState} from "react";
import {Skeleton} from "@/components/ui/skeleton";
import {safeHref} from "@/lib/html";

interface Slider {
    id: number
    image: string
    title: string
    text: string
    link: string | null
    link_text: string | null
}

const FALLBACK_SLIDE: Slider = {
    id: 0,
    image: "",
    title: "Welcome to Koşi Bakery",
    text: "A place where art meets patisserie and where love pours into desserts.",
    link: "/menu",
    link_text: "Our Menu",
}

const FEATURES = [
    {
        icon: Truck,
        title: "Reliable Delivery",
        text: "Get your cakes and pastries delivered fresh to your door — carefully packed and always on time.",
    },
    {
        icon: Wheat,
        title: "Honest Ingredients",
        text: "No mixes, no shortcuts. Just real butter, fresh cream, and simple ingredients that speak for themselves.",
    },
    {
        icon: HandHeart,
        title: "Beautiful in Every Detail",
        text: "Each item is carefully finished by hand — because we believe great taste deserves great presentation.",
    },
]

const HERO_HEIGHT = "min-h-[78vh] lg:min-h-[92vh]"

function HeroSlide({slide, imageSrc, priority}: { slide: Slider; imageSrc: string; priority?: boolean }) {
    const href = safeHref(slide.link)
    return (
        <div className={`relative ${HERO_HEIGHT} flex items-end lg:items-center overflow-hidden`}>
            {/* Лёгкое приближение активного слайда — см. .hero-swiper в globals.css */}
            <Image
                src={imageSrc}
                alt=""
                fill
                sizes="100vw"
                className="hero-image object-cover"
                priority={priority}
            />

            {/* Затемнение слева и снизу: текст читается на любой фотографии, а правая часть остаётся яркой */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10 lg:bg-gradient-to-r lg:from-black/70 lg:via-black/35 lg:to-transparent" aria-hidden="true"/>

            <div className="relative z-20 container mx-auto px-4 pb-20 pt-32 lg:py-0">
                <div className="max-w-2xl">
                    <p className={`${manrope.className} inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm ring-1 ring-white/20`}>
                        Koşi Bakery · London
                    </p>
                    <h1 className={`${raleway.className} mt-5 text-white text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] drop-shadow-sm`}>
                        {slide.title}
                    </h1>
                    {slide.text && (
                        <p className={`${manrope.className} mt-5 text-white/90 text-base sm:text-lg lg:text-xl leading-relaxed max-w-xl`}>
                            {slide.text}
                        </p>
                    )}

                    <div className="mt-8 flex flex-wrap gap-3">
                        {/* Ссылка у слайда необязательна — без неё (или с небезопасной, вроде javascript:) ведём в меню */}
                        <Link
                            href={href ?? "/menu"}
                            className={`${manrope.className} group inline-flex items-center gap-2 h-12 px-6 rounded-full main-button-color text-white text-base font-semibold shadow-lg transition hover:brightness-110 hover:-translate-y-0.5`}
                        >
                            {href ? slide.link_text || "Learn more" : "Our Menu"}
                            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true"/>
                        </Link>
                        <Link
                            href="/custom"
                            className={`${manrope.className} inline-flex items-center h-12 px-6 rounded-full bg-white/10 text-white text-base font-semibold ring-1 ring-white/40 backdrop-blur-sm transition hover:bg-white hover:text-[#B8485B]`}
                        >
                            Order a custom cake
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function Hero() {
    const [slides, setSlides] = useState<Slider[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sliders`)
            .then(res => res.json())
            .then(data => setSlides(Array.isArray(data) ? data : []))
            .catch(err => console.error("Slider fetch error:", err))
            .finally(() => setLoading(false))
    }, [])

    const several = slides.length > 1

    // Блок «More Than Just Cakes» ниже показываем всегда — и пока грузятся слайды, и если их нет
    return (
        <div>
            {loading ? (
                <div className="my-container mx-auto" aria-busy="true" aria-label="Loading slides">
                    <div className={`relative ${HERO_HEIGHT} main-background-color flex items-end lg:items-center`}>
                        <div className="container mx-auto px-4 pb-20 pt-32 lg:py-0">
                            <div className="flex flex-col space-y-6 w-full max-w-2xl">
                                <Skeleton tone="dark" className="h-7 w-48 rounded-full"/>
                                <Skeleton tone="dark" className="h-12 sm:h-16 lg:h-20 w-3/4"/>
                                <Skeleton tone="dark" className="h-5 sm:h-6 w-full max-w-[560px]"/>
                                <div className="flex gap-3">
                                    <Skeleton tone="dark" className="h-12 w-40 rounded-full"/>
                                    <Skeleton tone="dark" className="h-12 w-52 rounded-full"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : slides.length > 0 ? (
                <div className="my-container mx-auto relative">
                    <Swiper
                        modules={[Pagination, Autoplay, Navigation, A11y]}
                        pagination={{clickable: true}}
                        navigation={several ? {prevEl: ".hero-prev", nextEl: ".hero-next"} : false}
                        // 6 секунд — успеть прочитать текст; при наведении слайды не листаются
                        autoplay={several ? {delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true} : false}
                        loop={several}
                        speed={800}
                        className="hero-swiper main-background-color"
                    >
                        {slides.map((slide, i) => (
                            <SwiperSlide key={slide.id}>
                                <HeroSlide
                                    slide={slide}
                                    priority={i === 0}
                                    imageSrc={`${process.env.NEXT_PUBLIC_API_URL}/${slide.image.replace(/\\/g, "/")}`}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    {several && (
                        <div className="pointer-events-none absolute inset-y-0 inset-x-0 z-10 hidden lg:flex items-center justify-between px-6">
                            <button type="button" aria-label="Previous slide"
                                    className="hero-prev pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/30 backdrop-blur-sm cursor-pointer transition hover:bg-white hover:text-[#B8485B]">
                                <ChevronLeft className="h-6 w-6"/>
                            </button>
                            <button type="button" aria-label="Next slide"
                                    className="hero-next pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/30 backdrop-blur-sm cursor-pointer transition hover:bg-white hover:text-[#B8485B]">
                                <ChevronRight className="h-6 w-6"/>
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                // Слайды не загрузились (сервер недоступен) или их не добавили — статичный слайд,
                // чтобы главная не начиналась с пустого места под шапкой
                <div className="my-container mx-auto main-background-color">
                    <HeroSlide slide={FALLBACK_SLIDE} imageSrc="/images/main_hero.webp" priority/>
                </div>
            )}

            {/* Почему Koşi */}
            <section className="py-16 lg:py-20" aria-labelledby="why-koshi">
                <div className="container mx-auto px-4">
                    <div className="main-block-color rounded-3xl px-6 py-10 sm:px-10 lg:py-14">
                        <div className="text-center">
                            <p className={`${manrope.className} text-xs uppercase tracking-[0.18em] text-[#B8485B]`}>Why Koşi</p>
                            <h2 id="why-koshi" className={`${raleway.className} mt-2 text-3xl sm:text-4xl font-bold text-[#12100F]`}>
                                More Than Just Cakes
                            </h2>
                        </div>
                        <ul className="mt-10 grid gap-5 md:grid-cols-3 lg:gap-8">
                            {FEATURES.map(({icon: Icon, title, text}) => (
                                <li key={title}
                                    className="group rounded-2xl bg-white p-6 lg:p-8 shadow-sm ring-1 ring-[#B8485B]/10 transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(184,72,91,0.15)]">
                                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B8485B]/10 text-[#B8485B] transition-colors group-hover:bg-[#B8485B] group-hover:text-white">
                                        <Icon className="h-6 w-6" aria-hidden="true"/>
                                    </span>
                                    <h3 className={`${raleway.className} mt-5 text-xl font-bold text-[#12100F]`}>{title}</h3>
                                    <p className={`${manrope.className} mt-2 text-[15px] leading-relaxed text-[#6F5E53]`}>{text}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    )
}
