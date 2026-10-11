'use client'
import Image from "next/image";
import {manrope} from "@/app/fonts";
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import {useEffect, useState} from "react";
import {FaStar} from "react-icons/fa";
import {Skeleton} from "@/components/ui/skeleton";
import LoadError from "@/components/LoadError";
import {SECTION, SECTION_CARD, SectionHeading} from "@/app/homeSection";

interface Testimonial {
    id: number;
    image: string;
    text: string;
    name: string;
    // 1–5; null — без оценки
    rating: number | null;
}

// Заголовок в том же стиле, что у блоков Menu и Why Koşi
const TITLE = {id: "testimonials", eyebrow: "Reviews", title: "Testimonials"};

// Бесконечной карусели Swiper нужно не меньше slidesPerView (3) + шаг (1) + 1 для centeredSlides слайдов
const MIN_LOOP_SLIDES = 5;

// Если отзывов меньше, повторяем весь список по кругу — порядок сохраняется, а карусель становится бесконечной
const loopSlides = (cards: Testimonial[]) => {
    if (cards.length < 2) return cards;
    const copies = Math.ceil(MIN_LOOP_SLIDES / cards.length);
    return Array.from({length: copies}, () => cards).flat();
};

// Оформление блока (отступы, карточка, заголовок) — общее с Menu и Why Koşi (homeSection.tsx)
function Block({children, busy}: { children: React.ReactNode; busy?: boolean }) {
    return (
        // Последний блок главной — нижний отступ перед подвалом
        <section className={`${SECTION} pb-16 lg:pb-20`} aria-labelledby={TITLE.id} aria-busy={busy || undefined}>
            <div className="container mx-auto px-4">
                <div className={SECTION_CARD}>{children}</div>
            </div>
        </section>
    );
}

export default function Testimonials() {
    const [cards, setCards] = useState<Testimonial[]>([]);
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
        const fetchTestimonials = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/testimonials`, {
                    cache: "no-store",
                });
                if (!res.ok) throw new Error("Ошибка загрузки отзывов");

                const data: Testimonial[] = await res.json();

                const formatted = data.map((item) => ({
                    ...item,
                    image: `${process.env.NEXT_PUBLIC_API_URL}/${String(item.image ?? "")
                        .replace(/\\/g, "/")
                        .replace(/^\/+/, "")
                    }`,
                }));

                setCards(formatted);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Could not load reviews");
            } finally {
                setLoading(false);
            }
        };
        fetchTestimonials();
    }, [attempt]);

    if (loading) {
        return (
            <Block busy>
                <SectionHeading {...TITLE}/>
                <div className="flex justify-center items-center gap-[30px] pt-10 md:mt-16">
                    {Array.from({length: 3}).map((_, i) => (
                        <div key={i} className={`py-5 px-7 w-56 xl:w-72 rounded-xl bg-white shadow-md space-y-6 ${i !== 1 ? "hidden md:block" : "md:scale-110"}`}>
                            <Skeleton className="mx-auto w-19 h-19 rounded-full"/>
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-full"/>
                                <Skeleton className="h-3 w-full"/>
                                <Skeleton className="h-3 w-2/3"/>
                            </div>
                            <div className="space-y-1">
                                <Skeleton className="h-4 w-24"/>
                                <Skeleton className="h-3.5 w-20"/>
                            </div>
                        </div>
                    ))}
                </div>
            </Block>
        );
    }

    // Рамка и заголовок блока остаются — вместо отзывов сообщение с повтором загрузки
    if (error) {
        return (
            <Block>
                <SectionHeading {...TITLE}/>
                <div className="pt-6">
                    <LoadError what="reviews" onRetry={retry}/>
                </div>
            </Block>
        );
    }

    return (
        <Block>
            <div className="w-full relative">
                <div className="absolute left-0">
                    <Image
                        src="/images/quote_left.svg"
                        alt="Quote Left"
                        width={500}
                        height={500}
                        className="w-20 md:w-40 lg:w-64 lg:w-72"
                    />
                </div>

                <div className="absolute right-0">
                    <Image
                        src="/images/quote_left.svg"
                        alt="Quote Mobile"
                        width={500}
                        height={500}
                        className="w-20 block md:hidden transform scale-x-[-1]"
                    />

                    <Image
                        src="/images/quote_right.svg"
                        alt="Quote Desktop"
                        width={500}
                        height={500}
                        className="w-20 hidden md:block md:w-40 lg:w-64 lg:w-72"
                    />
                </div>

                <div className="relative w-full pt-8 pb-10">
                    <SectionHeading {...TITLE}/>
                </div>
                <div className="pb-10 relative md:mt-16 px-4 overflow-visible">
                    <Swiper
                        key={cards.length}
                        className="testimonials-swiper"
                        // Длительность — как --testimonials-speed в globals.css, чтобы лента и карточки шли вместе
                        speed={500}
                        modules={[Navigation]}
                        spaceBetween={10}
                        slidesPerView={1}
                        centeredSlides={true}
                        loop={cards.length > 1}
                        navigation={{
                            nextEl: ".testimonials-next",
                            prevEl: ".testimonials-prev",
                        }}
                        breakpoints={{
                            768: {
                                slidesPerView: Math.min(cards.length, 3),
                                spaceBetween: 30,
                            }
                        }}
                    >
                        {loopSlides(cards).map((item, i) => (
                            <SwiperSlide key={`${item.id}-${i}`}>
                                <div className="flex justify-center">
                                    <TestomonialCard {...item} />
                                </div>
                            </SwiperSlide>
                        ))}

                        <div
                            className="inset-0 flex items-center justify-between md:justify-center md:space-x-44 md:pt-8 md:pb-1 pointer-events-none z-20">
                            <div
                                className="testimonials-prev relative w-12 h-12 xl:w-15 xl:h-14 flex items-center justify-center bg-white rounded-full cursor-pointer pointer-events-auto group">
                                <Image
                                    src="/images/arrow-right.svg"
                                    alt="about-arrow"
                                    width={190}
                                    height={28}
                                    className="absolute z-20 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 -translate-x-2 xl:-translate-x-3 group-hover:-translate-x-6 transition-transform duration-300 max-w-[75px] xl:max-w-[100px] transform scale-x-[-1]"
                                />

                                <div
                                    className="w-13 h-13 xl:w-16 xl:h-16 rounded-full relative overflow-hidden absolute">
                                    <div
                                        className="absolute inset-0 bg-gradient-to-r from-[#B8485B] to-transparent rounded-full flex justify-center items-center">
                                        <div
                                            className="w-11 h-11 xl:w-13 xl:h-13 absolute main-block-color rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="testimonials-next relative w-12 h-12 xl:w-15 xl:h-14 flex items-center justify-center bg-white rounded-full cursor-pointer pointer-events-auto group">
                                <Image
                                    src="/images/arrow-right.svg"
                                    alt="about-arrow"
                                    width={190}
                                    height={28}
                                    className="absolute z-20 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 -translate-x-17 xl:-translate-x-22 group-hover:-translate-x-18 transition-transform duration-300 max-w-[75px] xl:max-w-[100px]"
                                />

                                <div
                                    className="w-13 h-13 xl:w-16 xl:h-16 rounded-full relative overflow-hidden absolute">
                                    <div
                                        className="absolute inset-0 bg-gradient-to-l from-[#B8485B] to-transparent rounded-full flex justify-center items-center">
                                        <div
                                            className="w-11 h-11 xl:w-13 xl:h-13 absolute main-block-color rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Swiper>
                </div>
            </div>
        </Block>
    );
}

function stripHtmlTags(html: string) {
    if (!html) return "";
    return html.replace(/<[^>]*>?/gm, "");
}

function Stars({rating}: { rating: number }) {
    return (
        <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
            {[1, 2, 3, 4, 5].map((n) => (
                <FaStar key={n} className={`w-3.5 h-3.5 ${n <= rating ? "text-amber-400" : "text-gray-200"}`} aria-hidden/>
            ))}
        </div>
    );
}

function TestomonialCard({text, name, image, rating}: { text: string; name: string; image: string; rating: number | null }) {
    return (
        // Анимация карточки задаётся в globals.css (.testimonials-active) — синхронно с прокруткой ленты
        <div className="testimonials-active my-4">
            <div
                className="py-5 px-7 w-56 xl:w-72 rounded-xl bg-white shadow-md space-y-6">
                <div className="w-full flex justify-center items-center">
                    <Image src={image} alt={image}
                           width={75}
                           height={75}
                           className="rounded-full bg-gray-100 w-19 h-19"/>
                </div>
                <p className={`${manrope.className} text-xs md:text-md text-black`}>
                    {stripHtmlTags(text)}
                </p>
                <div className="space-y-1">
                    <p className={`${manrope.className} text-sm md:text-md text-black`}>
                        {name}
                    </p>
                    {rating ? <Stars rating={rating}/> : null}
                </div>
            </div>
        </div>

    );
}
