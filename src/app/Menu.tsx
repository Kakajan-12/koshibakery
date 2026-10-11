"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation} from "swiper/modules";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {raleway} from "@/app/fonts";
import {useCategory} from "@/app/context/CategoryContext";
import {Skeleton} from "@/components/ui/skeleton";
import LoadError from "@/components/LoadError";
import {SECTION, SECTION_CARD, SectionHeading} from "@/app/homeSection";

type Category = { id: number; name: string; image: string };

const TITLE = {
    id: "home-menu",
    eyebrow: "Our menu",
    title: "Menu",
    text: "From soft layered cakes to delicate tarts — each treat is made to brighten your day.",
};

const ARROW = "flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#B8485B] shadow-sm ring-1 ring-[#B8485B]/20 cursor-pointer transition hover:bg-[#B8485B] hover:text-white [&.swiper-button-disabled]:opacity-40 [&.swiper-button-disabled]:cursor-default";

// Блок «Menu» на главной: категории в порядке из админки, клик ведёт в меню с выбранной категорией
export default function MainMenu() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // Увеличивается по кнопке «Try again» — запускает загрузку заново
    const [attempt, setAttempt] = useState(0);

    const retry = () => {
        setError(null);
        setLoading(true);
        setAttempt((a) => a + 1);
    };

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product-category`, {cache: "no-store"});
                if (!res.ok) throw new Error("Could not load the menu");
                const data: Category[] = await res.json();
                setCategories(data.map((item) => ({
                    ...item,
                    image: `${process.env.NEXT_PUBLIC_API_URL}/${String(item.image ?? "").replace(/\\/g, "/").replace(/^\/+/, "")}`,
                })));
            } catch (err) {
                setError(err instanceof Error ? err.message : "Could not load the menu");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [attempt]);

    return (
        <section className={SECTION} aria-labelledby={TITLE.id} aria-busy={loading || undefined}>
            <div className="container mx-auto px-4">
                <div className={SECTION_CARD}>
                    <SectionHeading {...TITLE}/>

                    <div className="mt-10">
                        {loading ? (
                            <div className="grid gap-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">
                                {Array.from({length: 4}).map((_, i) => (
                                    <Skeleton key={i} className={`h-44 rounded-2xl ${i >= 1 ? "hidden md:block" : ""} ${i === 3 ? "md:hidden lg:block" : ""}`}/>
                                ))}
                            </div>
                        ) : error ? (
                            // Карточка и заголовок остаются — без них главная «проваливалась» до голого бордового фона
                            <LoadError what="the menu" onRetry={retry}/>
                        ) : (
                            <>
                                {/* Телефон: категории списком */}
                                <ul className="flex flex-col gap-4 md:hidden">
                                    {categories.map((item) => (
                                        <li key={item.id}><MenuCard {...item}/></li>
                                    ))}
                                </ul>

                                {/* Планшет и компьютер: карусель */}
                                <div className="hidden md:block">
                                    <Swiper
                                        modules={[Navigation]}
                                        navigation={{nextEl: ".home-menu-next", prevEl: ".home-menu-prev"}}
                                        centerInsufficientSlides
                                        spaceBetween={20}
                                        slidesPerView={3}
                                        breakpoints={{
                                            1024: {slidesPerView: 4, spaceBetween: 32},
                                            1280: {slidesPerView: 5, spaceBetween: 32},
                                        }}
                                    >
                                        {categories.map((item) => (
                                            <SwiperSlide key={item.id}>
                                                <MenuCard {...item}/>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                    <div className="mt-6 flex justify-end gap-3">
                                        <button type="button" aria-label="Previous categories" className={`home-menu-prev ${ARROW}`}>
                                            <ChevronLeft className="h-5 w-5" aria-hidden="true"/>
                                        </button>
                                        <button type="button" aria-label="Next categories" className={`home-menu-next ${ARROW}`}>
                                            <ChevronRight className="h-5 w-5" aria-hidden="true"/>
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

function MenuCard({id, name, image}: Category) {
    const {setSelectedCategory} = useCategory();
    const router = useRouter();

    return (
        <button
            type="button"
            onClick={() => {
                setSelectedCategory(id);
                router.push("/menu");
            }}
            className="group relative block h-44 w-full overflow-hidden rounded-2xl px-4 py-5 text-left cursor-pointer shadow-sm
                       transition-shadow duration-500 hover:shadow-[0_12px_30px_rgba(184,72,91,0.2)]
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8485B]/60 focus-visible:ring-offset-2"
        >
            {/* Картинка — отдельным слоем: при наведении приближается внутри карточки, а сама карточка
                остаётся на месте и не наползает на соседние (края обрезает overflow-hidden) */}
            <span
                aria-hidden="true"
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out motion-safe:group-hover:scale-105"
                style={{backgroundImage: `url(${image})`}}
            />
            <span className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-transparent" aria-hidden="true"/>
            <span className={`${raleway.className} relative z-10 inline-block border-b-2 border-white text-xl md:text-2xl font-bold text-white`}>
                {name}
            </span>
        </button>
    );
}
