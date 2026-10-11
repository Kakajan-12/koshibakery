"use client";

import {useEffect, useMemo, useState} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {CalendarDays, Clock, Info, Loader2} from "lucide-react";
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

// «14:30» ⇄ Date (для выбора времени в react-datepicker важны только часы и минуты)
const toTimeDate = (hhmm: string) => {
    const [h, m] = hhmm.split(":").map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
};
const toHHMM = (d: Date) => `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;

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

            {/* Дата и время рядом, как на странице индивидуального заказа */}
            <div className="grid sm:grid-cols-2 gap-4">
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
                            dateFormat="EEE, d MMMM"
                            calendarStartDay={1}
                            placeholderText="Choose a date"
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

                <div>
                    <label htmlFor="ready-time" className={LABEL}>Time</label>
                    <div className="relative">
                        <DatePicker
                            id="ready-time"
                            selected={time ? toTimeDate(time) : null}
                            onChange={(d: Date | null) => date && onChange(date, d ? toHHMM(d) : "")}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={30}
                            // Только свободное время выбранного дня (часы работы, срок выпечки)
                            includeTimes={daySlots.map(toTimeDate)}
                            timeCaption="Time"
                            dateFormat="HH:mm"
                            timeFormat="HH:mm"
                            disabled={!date}
                            placeholderText={date ? "Choose a time" : "Choose a date first"}
                            wrapperClassName="w-full"
                            calendarClassName="koshi-datepicker"
                            popperClassName={`koshi-datepicker-popper ${manrope.className}`}
                            popperPlacement="bottom-start"
                            className={`${INPUT} disabled:cursor-not-allowed disabled:opacity-60`}
                            autoComplete="off"
                            required
                        />
                        <Clock aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B8485B]/70"/>
                    </div>
                </div>
            </div>
        </div>
    );
}
