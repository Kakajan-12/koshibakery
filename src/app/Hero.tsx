'use client'

import Image from "next/image"
import Link from "next/link"
import {ArrowRight, ChevronLeft, ChevronRight} from "lucide-react"

import {Swiper, SwiperSlide} from "swiper/react"
import {A11y, Autoplay, EffectFade, Navigation, Pagination} from "swiper/modules"

import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/effect-fade"

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

// Высота в svh (см. .hero-height в globals.css): vh на iPhone меняется, когда прячется адресная строка,
// и Swiper пересчитывал размеры посреди перелистывания — карусель застревала между слайдами
const HERO_HEIGHT = "hero-height"

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
                    <h1 className={`${raleway.className} mt-5 text-white text-4xl sm:text-5xl xl:text-6xl font-bold leading-[1.05] drop-shadow-sm`}>
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
                        modules={[Pagination, Autoplay, Navigation, A11y, EffectFade]}
                        // Плавная смена вместо сдвига: даже прерванная анимация не оставит на экране две половинки слайдов
                        effect="fade"
                        fadeEffect={{crossFade: true}}
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
                        // Стрелки внизу справа, по краю колонки контента (как корзина в шапке):
                        // по бокам слайда они наезжали на заголовок, а у края окна терялись на широких экранах
                        <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 hidden lg:block">
                            <div className="container mx-auto px-4 flex justify-end gap-3">
                                <button type="button" aria-label="Previous slide"
                                        className="hero-prev pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/30 backdrop-blur-sm cursor-pointer transition hover:bg-white hover:text-[#B8485B]">
                                    <ChevronLeft className="h-6 w-6"/>
                                </button>
                                <button type="button" aria-label="Next slide"
                                        className="hero-next pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/30 backdrop-blur-sm cursor-pointer transition hover:bg-white hover:text-[#B8485B]">
                                    <ChevronRight className="h-6 w-6"/>
                                </button>
                            </div>
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
        </div>
    )
}
