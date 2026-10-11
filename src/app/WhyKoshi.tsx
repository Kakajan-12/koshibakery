import {HandHeart, Truck, Wheat} from "lucide-react";
import {manrope, raleway} from "@/app/fonts";
import {SECTION, SECTION_CARD, SectionHeading} from "@/app/homeSection";

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
];

// «Почему Koşi» на главной: три преимущества пекарни
export default function WhyKoshi() {
    return (
        <section className={SECTION} aria-labelledby="why-koshi">
            <div className="container mx-auto px-4">
                <div className={SECTION_CARD}>
                    <SectionHeading id="why-koshi" eyebrow="Why Koşi" title="More Than Just Cakes"/>
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
    );
}
