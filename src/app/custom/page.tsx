"use client";

import {useEffect, useRef, useState} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {AlertCircle, CalendarDays, CheckCircle2, Clock, ImagePlus, Loader2, MessageCircle, Send, X} from "lucide-react";
import {manrope, raleway} from "@/app/fonts";

// Сервер принимает те же типы и размер (middleware/upload.js) — проверяем заранее, чтобы не ждать отказа
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_MB = 10;
const SIZE_SUGGESTIONS = ["6 inch", "8 inch", "10 inch", "2 tiers"];

const STEPS = [
    {title: "Tell us your idea", text: "Occasion, flavours, design — and a photo if you have one."},
    {title: "We reply with a quote", text: "We'll get back to you by email or phone to confirm details and price."},
    {title: "We bake it for you", text: "Freshly made by hand and ready for your date."},
];

// yyyy-mm-dd в местном времени. toISOString() переводит в UTC и в Лондоне (UTC+1 летом)
// сдвигал выбранную дату на день назад
const toLocalDate = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const fromLocalDate = (value: string) => {
    const [y, m, d] = value.split("-").map(Number);
    return new Date(y, m - 1, d);
};

const INPUT = `${manrope.className} w-full h-12 px-4 rounded-xl bg-white text-[15px] text-[#12100F] placeholder:text-gray-400
    ring-1 ring-[#B8485B]/20 outline-none transition focus:ring-2 focus:ring-[#B8485B]/50`;

function Field({label, htmlFor, hint, optional, children}: {
    label: string;
    htmlFor: string;
    hint?: string;
    optional?: boolean;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <label htmlFor={htmlFor} className={`${manrope.className} block text-sm font-semibold text-[#12100F]`}>
                {label}
                {optional && <span className="ml-1 font-normal text-[#6F5E53]">(optional)</span>}
            </label>
            {children}
            {hint && <p className={`${manrope.className} text-xs text-[#6F5E53]`}>{hint}</p>}
        </div>
    );
}

function SectionTitle({number, children}: { number: number; children: React.ReactNode }) {
    return (
        <h2 className={`${raleway.className} flex items-center gap-3 text-lg font-bold text-[#12100F]`}>
            <span className="w-7 h-7 rounded-full bg-[#B8485B] text-white text-sm flex items-center justify-center">{number}</span>
            {children}
        </h2>
    );
}

export default function CustomOrderPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [size, setSize] = useState("");
    const [details, setDetails] = useState("");
    const [referenceFile, setReferenceFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [fileError, setFileError] = useState("");
    const [dragOver, setDragOver] = useState(false);

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [sent, setSent] = useState(false);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Превью выбранной картинки; ссылку освобождаем, когда файл меняется
    useEffect(() => {
        if (!referenceFile) {
            setPreview(null);
            return;
        }
        const url = URL.createObjectURL(referenceFile);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [referenceFile]);

    const pickFile = (file: File | undefined | null) => {
        setFileError("");
        if (!file) return;
        if (!ALLOWED_TYPES.includes(file.type)) {
            setFileError("Please choose a JPEG, PNG, WebP or GIF image.");
            return;
        }
        if (file.size > MAX_FILE_MB * 1024 * 1024) {
            setFileError(`The image is too large — maximum ${MAX_FILE_MB} MB.`);
            return;
        }
        setReferenceFile(file);
    };

    const removeFile = () => {
        setReferenceFile(null);
        setFileError("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const resetForm = () => {
        setName("");
        setEmail("");
        setPhone("");
        setDate("");
        setTime("");
        setSize("");
        setDetails("");
        removeFile();
        setError("");
        setSent(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (submitting) return;
        setError("");
        setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("name", name.trim());
            formData.append("email", email.trim());
            formData.append("phone", phone.trim());
            formData.append("date", date);
            formData.append("time", time);
            formData.append("size", size.trim());
            formData.append("details", details.trim());
            if (referenceFile) formData.append("referenceFile", referenceFile);

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/custom-order`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json().catch(() => ({}));
            // Ошибки загрузки файла сервер отдаёт в поле error, остальные — в message
            if (!res.ok) throw new Error(data.error || data.message || "We couldn't send your request. Please try again.");

            setSent(true);
            window.scrollTo({top: 0, behavior: "smooth"});
        } catch (err: any) {
            setError(err.message === "Failed to fetch"
                ? "We couldn't reach the server. Please check your connection and try again."
                : err.message || "Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mt-24 my-container mx-auto">
            <div className="container mx-auto px-4 pt-6 pb-16">
                <div className="grid lg:grid-cols-[2fr_3fr] gap-6 lg:gap-8 items-start">
                    {/* Вводный блок: что это и как это работает */}
                    <aside className="main-block-color rounded-3xl p-6 sm:p-8 lg:sticky lg:top-28">
                        <p className={`${manrope.className} text-xs uppercase tracking-[0.18em] text-[#B8485B]`}>Custom order</p>
                        <h1 className={`${raleway.className} mt-2 text-3xl sm:text-4xl font-bold text-[#12100F] leading-tight`}>
                            Design your dream cake
                        </h1>
                        <p className={`${manrope.className} mt-3 text-base text-[#6F5E53] leading-relaxed`}>
                            Birthday, wedding or just because — tell us what you have in mind and we&apos;ll make it
                            happen.
                        </p>

                        <ol className="mt-8 space-y-5">
                            {STEPS.map((step, i) => (
                                <li key={step.title} className="flex gap-4">
                                    <span
                                        className={`${manrope.className} shrink-0 w-9 h-9 rounded-full bg-white text-[#B8485B] font-bold
                                                    flex items-center justify-center shadow-sm`}
                                    >
                                        {i + 1}
                                    </span>
                                    <div>
                                        <p className={`${raleway.className} font-bold text-[#12100F]`}>{step.title}</p>
                                        <p className={`${manrope.className} text-sm text-[#6F5E53]`}>{step.text}</p>
                                    </div>
                                </li>
                            ))}
                        </ol>

                        <div className="mt-8 flex items-start gap-3 rounded-2xl bg-[#FFF6E8] ring-1 ring-[#D18A2C]/25 p-4">
                            <Clock className="w-5 h-5 shrink-0 text-[#9A5B13] mt-0.5" aria-hidden="true"/>
                            <p className={`${manrope.className} text-sm text-[#7A4A12]`}>
                                Please order at least 48–72 hours in advance. For urgent orders, get in touch via the
                                contact page.
                            </p>
                        </div>
                    </aside>

                    <div className="rounded-3xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-6 sm:p-8">
                        {sent ? (
                            <div role="status" className="flex flex-col items-center text-center py-12 gap-4">
                                <span className="w-16 h-16 rounded-full bg-[#EAF5EC] text-[#2F6B3F] flex items-center justify-center">
                                    <CheckCircle2 className="w-8 h-8" aria-hidden="true"/>
                                </span>
                                <h2 className={`${raleway.className} text-2xl font-bold text-[#12100F]`}>Thank you!</h2>
                                <p className={`${manrope.className} max-w-sm text-[#6F5E53]`}>
                                    Your request has been sent. We&apos;ll contact you soon to confirm the details and
                                    price.
                                </p>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className={`${manrope.className} mt-2 h-12 px-6 rounded-full ring-1 ring-[#B8485B]/40 text-[#B8485B]
                                                font-semibold cursor-pointer transition-colors hover:bg-[#B8485B] hover:text-white`}
                                >
                                    Send another request
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <section className="space-y-4">
                                    <SectionTitle number={1}>Your details</SectionTitle>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <Field label="Name" htmlFor="co-name">
                                            <input id="co-name" type="text" autoComplete="name" required maxLength={100}
                                                   value={name} onChange={(e) => setName(e.target.value)}
                                                   placeholder="Jane Smith" className={INPUT}/>
                                        </Field>
                                        <Field label="Phone" htmlFor="co-phone" optional>
                                            <input id="co-phone" type="tel" autoComplete="tel" maxLength={30}
                                                   value={phone} onChange={(e) => setPhone(e.target.value)}
                                                   placeholder="+44 7…" className={INPUT}/>
                                        </Field>
                                    </div>
                                    <Field label="Email" htmlFor="co-email" hint="We'll send the quote to this address.">
                                        <input id="co-email" type="email" autoComplete="email" required maxLength={255}
                                               value={email} onChange={(e) => setEmail(e.target.value)}
                                               placeholder="you@example.com" className={INPUT}/>
                                    </Field>
                                </section>

                                <section className="space-y-4">
                                    <SectionTitle number={2}>Your cake</SectionTitle>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <Field label="Date needed" htmlFor="co-date">
                                            <div className="relative">
                                                <DatePicker
                                                    id="co-date"
                                                    selected={date ? fromLocalDate(date) : null}
                                                    onChange={(d: Date | null) => setDate(d ? toLocalDate(d) : "")}
                                                    dateFormat="d MMMM yyyy"
                                                    minDate={new Date()}
                                                    calendarStartDay={1}
                                                    placeholderText="Choose a date"
                                                    wrapperClassName="w-full"
                                                    calendarClassName="koshi-datepicker"
                                                    popperClassName={`koshi-datepicker-popper ${manrope.className}`}
                                                    popperPlacement="bottom-start"
                                                    className={`${INPUT} pr-11 cursor-pointer`}
                                                    autoComplete="off"
                                                    required
                                                />
                                                <CalendarDays aria-hidden="true"
                                                              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B8485B]/70"/>
                                            </div>
                                        </Field>
                                        <Field label="Preferred time" htmlFor="co-time">
                                            <div className="relative">
                                                <DatePicker
                                                    id="co-time"
                                                    selected={time ? new Date(`1970-01-01T${time}`) : null}
                                                    onChange={(d: Date | null) => setTime(d ? d.toTimeString().slice(0, 5) : "")}
                                                    showTimeSelect
                                                    showTimeSelectOnly
                                                    timeIntervals={30}
                                                    timeCaption="Time"
                                                    dateFormat="HH:mm"
                                                    timeFormat="HH:mm"
                                                    placeholderText="Choose a time"
                                                    wrapperClassName="w-full"
                                                    calendarClassName="koshi-datepicker"
                                                    popperClassName={`koshi-datepicker-popper ${manrope.className}`}
                                                    popperPlacement="bottom-start"
                                                    className={`${INPUT} pr-11 cursor-pointer`}
                                                    autoComplete="off"
                                                    required
                                                />
                                                <Clock aria-hidden="true"
                                                       className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B8485B]/70"/>
                                            </div>
                                        </Field>
                                    </div>

                                    <Field label="Size" htmlFor="co-size" hint="Pick one or type your own, e.g. 1 kg or 20 cupcakes.">
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {SIZE_SUGGESTIONS.map((s) => (
                                                <button
                                                    key={s}
                                                    type="button"
                                                    aria-pressed={size === s}
                                                    onClick={() => setSize(s)}
                                                    className={`${manrope.className} h-9 px-4 rounded-full text-sm cursor-pointer transition-colors ${
                                                        size === s
                                                            ? "bg-[#B8485B] text-white"
                                                            : "bg-[#F6EEEC] text-[#12100F] hover:bg-[#B8485B]/15"
                                                    }`}
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                        <input id="co-size" type="text" required maxLength={100}
                                               value={size} onChange={(e) => setSize(e.target.value)}
                                               placeholder="e.g. 8 inch" className={INPUT}/>
                                    </Field>

                                    <Field label="Tell us about your cake" htmlFor="co-details"
                                           hint="Flavour, colours, decorations, message on the cake, allergies…">
                                        <textarea id="co-details" required rows={5} maxLength={3000}
                                                  value={details} onChange={(e) => setDetails(e.target.value)}
                                                  placeholder="A two-tier vanilla cake with fresh berries and 'Happy 30th, Anna' on top…"
                                                  className={`${INPUT} h-auto py-3 resize-y min-h-32`}/>
                                    </Field>
                                </section>

                                <section className="space-y-4">
                                    <SectionTitle number={3}>Reference image <span className={`${manrope.className} text-sm font-normal text-[#6F5E53]`}>(optional)</span></SectionTitle>

                                    {referenceFile && preview ? (
                                        <div className="flex items-center gap-4 rounded-2xl ring-1 ring-[#B8485B]/20 p-3">
                                            {/* eslint-disable-next-line @next/next/no-img-element -- локальный blob: превью, next/image не нужен */}
                                            <img src={preview} alt="Selected reference" className="w-20 h-20 rounded-xl object-cover"/>
                                            <div className="flex-1 min-w-0">
                                                <p className={`${manrope.className} text-sm font-semibold text-[#12100F] truncate`}>{referenceFile.name}</p>
                                                <p className={`${manrope.className} text-xs text-[#6F5E53]`}>
                                                    {(referenceFile.size / 1024 / 1024).toFixed(1)} MB
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={removeFile}
                                                aria-label="Remove image"
                                                className="w-9 h-9 rounded-full flex items-center justify-center text-[#6F5E53] cursor-pointer
                                                           transition-colors hover:bg-[#B8485B]/10 hover:text-[#B8485B]"
                                            >
                                                <X className="w-5 h-5"/>
                                            </button>
                                        </div>
                                    ) : (
                                        <label
                                            htmlFor="co-file"
                                            onDragOver={(e) => {
                                                e.preventDefault();
                                                setDragOver(true);
                                            }}
                                            onDragLeave={() => setDragOver(false)}
                                            onDrop={(e) => {
                                                e.preventDefault();
                                                setDragOver(false);
                                                pickFile(e.dataTransfer.files?.[0]);
                                            }}
                                            className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-8
                                                        text-center cursor-pointer transition-colors ${
                                                dragOver
                                                    ? "border-[#B8485B] bg-[#B8485B]/5"
                                                    : "border-[#B8485B]/25 hover:border-[#B8485B]/60 hover:bg-[#FBF7F6]"
                                            }`}
                                        >
                                            <ImagePlus className="w-8 h-8 text-[#B8485B]" aria-hidden="true"/>
                                            <span className={`${manrope.className} text-sm font-semibold text-[#12100F]`}>
                                                Drop an image here or <span className="text-[#B8485B] underline underline-offset-2">browse</span>
                                            </span>
                                            <span className={`${manrope.className} text-xs text-[#6F5E53]`}>
                                                JPEG, PNG, WebP or GIF, up to {MAX_FILE_MB} MB
                                            </span>
                                        </label>
                                    )}
                                    <input
                                        id="co-file"
                                        ref={fileInputRef}
                                        type="file"
                                        accept={ALLOWED_TYPES.join(",")}
                                        onChange={(e) => pickFile(e.target.files?.[0])}
                                        className="sr-only"
                                    />
                                    {fileError && (
                                        <p role="alert" className={`${manrope.className} text-sm text-[#B42318]`}>{fileError}</p>
                                    )}
                                </section>

                                {error && (
                                    <div role="alert" className="flex items-start gap-3 rounded-2xl bg-[#FEF3F2] ring-1 ring-[#B42318]/20 p-4">
                                        <AlertCircle className="w-5 h-5 shrink-0 text-[#B42318] mt-0.5" aria-hidden="true"/>
                                        <p className={`${manrope.className} text-sm text-[#912018]`}>{error}</p>
                                    </div>
                                )}

                                <div className="space-y-3">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className={`${manrope.className} w-full inline-flex items-center justify-center gap-2 h-14 rounded-full
                                                    main-button-color text-white text-base font-semibold shadow-md cursor-pointer transition
                                                    hover:brightness-110 hover:shadow-lg disabled:opacity-70 disabled:cursor-wait
                                                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8485B]/50 focus-visible:ring-offset-2`}
                                    >
                                        {submitting ? (
                                            <><Loader2 className="w-5 h-5 animate-spin" aria-hidden="true"/> Sending…</>
                                        ) : (
                                            <><Send className="w-5 h-5" aria-hidden="true"/> Send request</>
                                        )}
                                    </button>
                                    <p className={`${manrope.className} flex items-center justify-center gap-1.5 text-xs text-[#6F5E53]`}>
                                        <MessageCircle className="w-3.5 h-3.5" aria-hidden="true"/>
                                        No payment now — we&apos;ll confirm the price with you first.
                                    </p>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
