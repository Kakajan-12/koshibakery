"use client";

import {Fragment, useEffect, useRef, useState} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {ArrowUp, ChevronDown, Mail, Phone} from "lucide-react";
import {manrope, raleway} from "@/app/fonts";

export type LegalBlock = string | { list: string[]; ordered: boolean };

export interface LegalSection {
    id: string;
    number: number;
    title: string;
    blocks: LegalBlock[];
}

const EMAIL = "cakesjandk@gmail.com";
const PHONE = "+44 7342 978654";

// Почта, телефон, «Privacy Policy» и ссылки на разделы («clause 18», «section 8») становятся ссылками
const LINK_RE = /([\w.+-]+@[\w-]+\.[\w.]+[A-Za-z])|(\+44[\d ]{9,14}\d)|(Privacy (?:Policy|Notice))|((?:clause|section) (\d{1,2}))(?![.\d])/g;

function RichText({text}: { text: string }) {
    // На самой странице политики «Privacy Policy» не ссылается на себя
    const onPrivacyPage = usePathname() === "/privacypolicy";
    const parts: React.ReactNode[] = [];
    let last = 0;
    for (const m of text.matchAll(LINK_RE)) {
        const i = m.index ?? 0;
        if (i > last) parts.push(text.slice(last, i));
        const [whole, email, phone, privacy, ref, refNum] = m;
        const cls = "font-semibold text-[#B8485B] link-underline";
        if (email) parts.push(<a key={i} href={`mailto:${email}`} className={cls}>{email}</a>);
        else if (phone) parts.push(<a key={i} href={`tel:${phone.replace(/\s/g, "")}`} className={cls}>{phone}</a>);
        else if (privacy) parts.push(onPrivacyPage ? privacy : <Link key={i} href="/privacypolicy" className={cls}>{privacy}</Link>);
        else if (ref) parts.push(<a key={i} href={`#section-${refNum}`} className={cls}>{ref}</a>);
        else parts.push(whole);
        last = i + whole.length;
    }
    if (last < text.length) parts.push(text.slice(last));
    return <>{parts}</>;
}

// «11.2. Текст» → номер пункта выделяется отдельно
function Clause({text}: { text: string }) {
    const m = text.match(/^(\d+\.\d+\.?)\s+([\s\S]*)$/);
    // Абзац без номера внутри раздела выравниваем по тексту пунктов
    if (!m) return <p className="pl-[3.25rem]"><RichText text={text}/></p>;
    return (
        <p className="flex gap-3">
            <span className="shrink-0 min-w-[2.5rem] font-semibold text-[#12100F] tabular-nums">{m[1].replace(/\.$/, "")}</span>
            <span className="min-w-0"><RichText text={m[2]}/></span>
        </p>
    );
}

// Оглавление: подсвечивает раздел, который сейчас читают — последний, чей заголовок уже ушёл под шапку сайта
const HEADER_OFFSET = 140;

function useActiveSection(ids: string[]) {
    const [active, setActive] = useState(ids[0]);
    useEffect(() => {
        // 30 заголовков — дешёвый пересчёт, считаем прямо на событии прокрутки
        const update = () => {
            let current = ids[0];
            for (const id of ids) {
                const el = document.getElementById(id);
                if (el && el.getBoundingClientRect().top <= HEADER_OFFSET) current = id;
            }
            // Долистали до конца — последний раздел, даже если он короткий
            if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = ids[ids.length - 1];
            setActive(current);
        };
        update();
        window.addEventListener("scroll", update, {passive: true});
        window.addEventListener("resize", update);
        return () => {
            window.removeEventListener("scroll", update);
            window.removeEventListener("resize", update);
        };
    }, [ids]);
    return active;
}

function Toc({sections, active, onPick}: { sections: LegalSection[]; active?: string; onPick?: () => void }) {
    return (
        <ol className={`${manrope.className} space-y-0.5 text-sm`}>
            {sections.map((s) => {
                const current = s.id === active;
                return (
                    <li key={s.id}>
                        <a href={`#${s.id}`} onClick={onPick} aria-current={current ? "true" : undefined}
                           className={`flex gap-2 rounded-lg px-3 py-1.5 transition-colors ${
                               current ? "bg-[#B8485B]/10 text-[#B8485B] font-semibold" : "text-[#6F5E53] hover:text-[#12100F] hover:bg-[#F6EEEC]"
                           }`}>
                            <span className="w-5 shrink-0 text-right tabular-nums">{s.number}.</span>
                            <span className="min-w-0">{s.title}</span>
                        </a>
                    </li>
                );
            })}
        </ol>
    );
}

export default function LegalDocument({
    eyebrow = "Legal", title, intro, sections, updated,
    contactTitle = "Questions about these terms?",
    related = {href: "/privacypolicy", label: "Privacy Policy"},
}: {
    eyebrow?: string;
    // «22 February 2026» — дата последнего изменения документа
    updated?: string;
    contactTitle?: string;
    // Ссылка на соседний документ в блоке «Вопросы»
    related?: { href: string; label: string };
    title: string;
    intro: string[];
    sections: LegalSection[];
}) {
    const [ids] = useState(() => sections.map((s) => s.id));
    const active = useActiveSection(ids);
    const [tocOpen, setTocOpen] = useState(false);
    const tocRef = useRef<HTMLDivElement | null>(null);

    // Активный пункт всегда виден в оглавлении (прокручиваем только саму колонку, не страницу)
    useEffect(() => {
        const box = tocRef.current;
        const link = box?.querySelector<HTMLElement>(`a[href="#${active}"]`);
        if (!box || !link) return;
        // Колонка — relative, поэтому offsetTop ссылки считается от её верха
        const top = link.offsetTop;
        if (top < box.scrollTop + 40 || top > box.scrollTop + box.clientHeight - 60) {
            const target = top - box.clientHeight / 2;
            // Большой прыжок (переход по ссылке, End) — сразу; плавная анимация в нём прерывается
            box.scrollTo({top: target, behavior: Math.abs(target - box.scrollTop) > box.clientHeight ? "auto" : "smooth"});
        }
    }, [active]);

    return (
        <div className="mt-24 my-container mx-auto">
            <div className="container mx-auto px-4 pt-6 pb-16">
                <div className="main-block-color rounded-3xl p-4 sm:p-8 lg:p-10">
                    {/* Заголовок */}
                    <header className="max-w-3xl">
                        <p className={`${manrope.className} text-xs uppercase tracking-[0.18em] text-[#B8485B]`}>{eyebrow}</p>
                        <h1 className={`${raleway.className} mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold text-[#12100F]`}>{title}</h1>
                        {updated && (
                            <p className={`${manrope.className} mt-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#6F5E53] ring-1 ring-[#B8485B]/10`}>
                                Last updated: {updated}
                            </p>
                        )}
                        <div className={`${manrope.className} mt-5 space-y-3 text-[15px] sm:text-base leading-relaxed text-[#3B302B]`}>
                            {intro.map((p, i) => <p key={i}><RichText text={p}/></p>)}
                        </div>
                    </header>

                    <div className="mt-10 grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] items-start">
                        {/* Оглавление: на телефоне — раскрывающийся список, на десктопе — закреплённая колонка */}
                        <nav aria-label="Contents" className="lg:sticky lg:top-28">
                            <div className="lg:hidden rounded-2xl bg-white ring-1 ring-[#B8485B]/10">
                                <button type="button" onClick={() => setTocOpen((v) => !v)} aria-expanded={tocOpen}
                                        className={`${manrope.className} w-full flex items-center justify-between gap-3 px-4 py-3 font-semibold text-[#12100F] cursor-pointer`}>
                                    Contents
                                    <ChevronDown className={`w-4 h-4 transition-transform ${tocOpen ? "rotate-180" : ""}`} aria-hidden="true"/>
                                </button>
                                {tocOpen && <div className="px-2 pb-3"><Toc sections={sections} onPick={() => setTocOpen(false)}/></div>}
                            </div>
                            <div ref={tocRef} className="relative hidden lg:block rounded-2xl bg-white p-3 ring-1 ring-[#B8485B]/10 max-h-[calc(100vh-9rem)] overflow-y-auto koshi-scroll">
                                <p className={`${manrope.className} px-3 pt-1 pb-2 text-xs uppercase tracking-[0.14em] text-[#6F5E53]`}>Contents</p>
                                <Toc sections={sections} active={active}/>
                            </div>
                        </nav>

                        {/* Разделы */}
                        <div className="min-w-0 rounded-2xl bg-white px-5 py-2 sm:px-8 ring-1 ring-[#B8485B]/10">
                            {sections.map((s) => (
                                <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`}
                                         className="scroll-mt-28 border-b border-[#F0E6E3] py-7 last:border-0">
                                    <h2 id={`${s.id}-title`} className={`${raleway.className} group flex items-baseline gap-3 text-xl sm:text-2xl font-bold text-[#12100F]`}>
                                        <span className="text-[#B8485B] tabular-nums">{s.number}.</span>
                                        <span>{s.title}</span>
                                        <a href={`#${s.id}`} aria-label={`Link to section ${s.number}`}
                                           className="text-base text-[#B8485B]/0 transition-colors group-hover:text-[#B8485B]/60 focus:text-[#B8485B]/60">#</a>
                                    </h2>
                                    <div className={`${manrope.className} mt-4 space-y-3 text-[15px] leading-relaxed text-[#3B302B]`}>
                                        {s.blocks.map((b, i) => typeof b === "string" ? (
                                            <Clause key={i} text={b}/>
                                        ) : (
                                            <Fragment key={i}>
                                                {b.ordered ? (
                                                    <ol className="ml-[3.25rem] list-[lower-alpha] space-y-1.5 pl-5 marker:text-[#B8485B]">
                                                        {b.list.map((item, j) => <li key={j}><RichText text={item}/></li>)}
                                                    </ol>
                                                ) : (
                                                    <ul className="ml-[3.25rem] list-disc space-y-1.5 pl-5 marker:text-[#B8485B]">
                                                        {b.list.map((item, j) => <li key={j}><RichText text={item}/></li>)}
                                                    </ul>
                                                )}
                                            </Fragment>
                                        ))}
                                    </div>
                                </section>
                            ))}
                        </div>
                    </div>

                    {/* Вопросы */}
                    <div className="mt-8 flex flex-col gap-5 rounded-2xl bg-white p-6 sm:p-8 ring-1 ring-[#B8485B]/10 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h2 className={`${raleway.className} text-xl font-bold text-[#12100F]`}>{contactTitle}</h2>
                            <p className={`${manrope.className} mt-1 text-sm text-[#6F5E53]`}>
                                Get in touch — we&apos;re happy to help. See also our{" "}
                                <Link href={related.href} className="font-semibold text-[#B8485B] link-underline">{related.label}</Link>.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <a href={`mailto:${EMAIL}`} className={`${manrope.className} inline-flex items-center gap-2 h-11 px-5 rounded-full main-button-color text-white text-sm font-semibold shadow-sm transition hover:brightness-110`}>
                                <Mail className="w-4 h-4" aria-hidden="true"/> {EMAIL}
                            </a>
                            <a href={`tel:${PHONE.replace(/\s/g, "")}`} className={`${manrope.className} inline-flex items-center gap-2 h-11 px-5 rounded-full bg-white text-[#B8485B] text-sm font-semibold ring-1 ring-[#B8485B]/30 transition hover:ring-[#B8485B]`}>
                                <Phone className="w-4 h-4" aria-hidden="true"/> {PHONE}
                            </a>
                            <a href="#top" onClick={(e) => {
                                e.preventDefault();
                                window.scrollTo({top: 0, behavior: "smooth"});
                            }} className={`${manrope.className} group inline-flex items-center gap-2 h-11 px-5 rounded-full bg-[#F6EEEC] text-sm font-semibold text-[#3B302B] ring-1 ring-[#6F5E53]/15 transition hover:bg-[#B8485B]/10 hover:text-[#B8485B] hover:ring-[#B8485B]/40`}>
                                <ArrowUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" aria-hidden="true"/> Back to top
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
