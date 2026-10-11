import {manrope, raleway} from "@/app/fonts";

// Общий вид блоков главной (Menu, Why Koşi): одинаковые отступы, карточка и заголовок

// Отступ сверху; снизу его даёт следующий блок, поэтому расстояния между блоками одинаковые
export const SECTION = "pt-16 lg:pt-20";
export const SECTION_CARD = "main-block-color rounded-3xl px-6 py-10 sm:px-10 lg:py-14";

export function SectionHeading({id, eyebrow, title, text}: { id: string; eyebrow: string; title: string; text?: string }) {
    return (
        <div className="text-center">
            <p className={`${manrope.className} text-xs uppercase tracking-[0.18em] text-[#B8485B]`}>{eyebrow}</p>
            <h2 id={id} className={`${raleway.className} mt-2 text-3xl sm:text-4xl font-bold text-[#12100F]`}>{title}</h2>
            {text && <p className={`${manrope.className} mx-auto mt-3 max-w-2xl text-[15px] sm:text-base text-[#6F5E53]`}>{text}</p>}
        </div>
    );
}
