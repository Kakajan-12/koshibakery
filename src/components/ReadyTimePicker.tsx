"use client";

import {useEffect, useMemo, useState} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {CalendarDays, Info, Loader2} from "lucide-react";
import {manrope} from "@/app/fonts";
import {shortDate} from "@/lib/readyDate";

const INPUT = `${manrope.className} w-full h-12 px-4 pr-11 rounded-xl bg-white text-[15px] text-[#12100F] placeholder:text-gray-400
    ring-1 ring-[#B8485B]/20 outline-none transition focus:ring-2 focus:ring-[#B8485B]/50 cursor-pointer`;
const LABEL = `${manrope.className} block text-sm font-semibold text-[#12100F] mb-1.5`;

const toLocalDate = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const fromLocalDate = (value: string) => {
    const [y, m, d] = value.split("-").map(Number);
    return new Date(y, m - 1, d);
};

export {shortDate} from "@/lib/readyDate";

/**
 * Выбор даты и времени, когда заказ должен быть готов. Доступные дни и слоты считает сервер
 * (GET /api/order/schedule — часы работы, срок выпечки для товаров «под заказ»).
 */
export default function ReadyTimePicker({productIds, orderType, date, time, onChange}: {
    productIds: number[];
    orderType: "delivery" | "collect";
    date: string;
    time: string;
    onChange: (date: string, time: string) => void;
}) {
    const [slots, setSlots] = useState<Record<string, string[]> | null>(null);
    const [preorder, setPreorder] = useState(false);
    const [failed, setFailed] = useState(false);
    const idsKey = [...new Set(productIds)].sort((a, b) => a - b).join(",");

    useEffect(() => {
        let cancelled = false;
        setFailed(false);
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/order/schedule?ids=${idsKey}`)
            .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
            .then((data) => {
                if (cancelled) return;
                setSlots(data.slots ?? {});
                setPreorder(!!data.preorder);
            })
            .catch(() => !cancelled && setFailed(true));
        return () => {
            cancelled = true;
        };
    }, [idsKey]);

    const days = useMemo(() => Object.keys(slots ?? {}), [slots]);
    const daySlots = date && slots ? slots[date] ?? [] : [];

    // Выбор перестал подходить (в корзину добавили торт «под заказ», прошло время) — сбрасываем
    useEffect(() => {
        if (!slots) return;
        if (date && !slots[date]) onChange("", "");
        else if (date && time && !slots[date].includes(time)) onChange(date, "");
    }, [slots, date, time, onChange]);

    const verb = orderType === "delivery" ? "delivered" : "ready for collection";

    if (failed) {
        return (
            <p className={`${manrope.className} rounded-xl bg-[#FEF3F2] p-3 text-sm text-[#912018]`}>
                We couldn&apos;t load available times. Please refresh the page or try again in a moment.
            </p>
        );
    }

    if (!slots) {
        return (
            <p className={`${manrope.className} flex items-center gap-2 text-sm text-[#6F5E53]`}>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true"/> Loading available times…
            </p>
        );
    }

    return (
        <div className="space-y-4">
            {preorder && days[0] && (
                <p className={`${manrope.className} flex items-start gap-2 rounded-xl bg-[#FFF6E8] p-3 text-sm text-[#7A4A12]`}>
                    <Info className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true"/>
                    <span>
                        Some items in your cart are baked to order, so the earliest date is <strong>{shortDate(days[0])}</strong>.
                        Need it sooner? Get in touch and we&apos;ll see what we can do.
                    </span>
                </p>
            )}

            <div>
                <label htmlFor="ready-date" className={LABEL}>Date</label>
                <div className="relative">
                    <DatePicker
                        id="ready-date"
                        selected={date ? fromLocalDate(date) : null}
                        onChange={(d: Date | null) => onChange(d ? toLocalDate(d) : "", "")}
                        filterDate={(d: Date) => !!slots[toLocalDate(d)]}
                        minDate={days[0] ? fromLocalDate(days[0]) : undefined}
                        maxDate={days.length ? fromLocalDate(days[days.length - 1]) : undefined}
                        dateFormat="EEEE, d MMMM"
                        calendarStartDay={1}
                        placeholderText={`When should it be ${verb}?`}
                        wrapperClassName="w-full"
                        calendarClassName="koshi-datepicker"
                        popperClassName={`koshi-datepicker-popper ${manrope.className}`}
                        popperPlacement="bottom-start"
                        className={INPUT}
                        autoComplete="off"
                        required
                    />
                    <CalendarDays aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B8485B]/70"/>
                </div>
            </div>

            {date && (
                <fieldset>
                    <legend className={LABEL}>Time</legend>
                    <div role="radiogroup" aria-label="Time" className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {daySlots.map((t) => {
                            const active = t === time;
                            return (
                                <button
                                    key={t}
                                    type="button"
                                    role="radio"
                                    aria-checked={active}
                                    onClick={() => onChange(date, t)}
                                    className={`${manrope.className} h-10 rounded-xl text-sm font-semibold tabular-nums cursor-pointer transition ${
                                        active ? "main-button-color text-white shadow-sm" : "bg-white text-[#3B302B] ring-1 ring-[#B8485B]/20 hover:ring-[#B8485B]/60"
                                    }`}
                                >
                                    {t}
                                </button>
                            );
                        })}
                    </div>
                </fieldset>
            )}
        </div>
    );
}
