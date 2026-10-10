'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import {AlertCircle, CheckCircle2, Clock, Loader2, Mail, MapPin, Navigation, Phone, RefreshCw, Send} from 'lucide-react';
import {manrope, raleway} from '@/app/fonts';
import {Skeleton} from "@/components/ui/skeleton";
import MapEmbed from "@/components/MapEmbed";

interface ContactData {
    id: number;
    address?: string;
    phone?: string;
    mail?: string;
    map?: string;
}

interface OpenTime {
    id: number;
    days: string;
    times: string;
}

const INPUT = `${manrope.className} w-full h-12 px-4 rounded-xl bg-white text-[15px] text-[#12100F] placeholder:text-gray-400
    ring-1 ring-[#B8485B]/20 outline-none transition focus:ring-2 focus:ring-[#B8485B]/50`;
const LABEL = `${manrope.className} block text-sm font-semibold text-[#12100F] mb-1.5`;
const EYEBROW = `${manrope.className} text-xs uppercase tracking-[0.18em] text-[#B8485B]`;

// Плитка контакта: иконка, подпись и значение-ссылка
function ContactTile({icon: Icon, label, value, href, external, loading}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value?: string;
    href?: string;
    external?: boolean;
    loading: boolean;
}) {
    const body = (
        <>
            <span className="w-11 h-11 shrink-0 rounded-full bg-[#B8485B]/10 text-[#B8485B] flex items-center justify-center">
                <Icon className="w-5 h-5"/>
            </span>
            <span className="min-w-0">
                <span className={`${manrope.className} block text-xs uppercase tracking-[0.12em] text-[#6F5E53]`}>{label}</span>
                {loading ? (
                    <Skeleton className="h-5 w-44 mt-1"/>
                ) : (
                    <span className={`${manrope.className} block text-base font-semibold text-[#12100F] [overflow-wrap:anywhere]`}>{value || "—"}</span>
                )}
            </span>
        </>
    );

    // min-w-0: длинный email не должен распирать ячейку сетки на узком экране
    const className = "min-w-0 flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#B8485B]/10";
    return href && value ? (
        <a
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className={`${className} transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8485B]/50`}
        >
            {body}
        </a>
    ) : (
        <div className={className}>{body}</div>
    );
}

const Contact: React.FC = () => {
    const [contact, setContact] = useState<ContactData | null>(null);
    const [hours, setHours] = useState<OpenTime[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [captchaText, setCaptchaText] = useState('');
    // Меняем параметр, чтобы браузер загрузил новую картинку капчи.
    // null до монтирования: Date.now() на сервере и в браузере разный — иначе ошибка гидратации
    const [captchaKey, setCaptchaKey] = useState<number | null>(null);
    const [sending, setSending] = useState(false);
    const [errorText, setErrorText] = useState('');
    const [sent, setSent] = useState(false);

    const refreshCaptcha = () => {
        setCaptchaText('');
        setCaptchaKey(Date.now());
    };

    useEffect(() => {
        setCaptchaKey(Date.now());
    }, []);

    useEffect(() => {
        const load = async <T, >(path: string): Promise<T | null> => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`);
                if (!res.ok) throw new Error(`${path} responded ${res.status}`);
                return await res.json();
            } catch (err) {
                console.error(`Failed to load ${path}:`, err);
                return null;
            }
        };
        Promise.all([load<ContactData[]>('/api/contact'), load<OpenTime[]>('/api/open-time')]).then(([c, h]) => {
            setContact(c?.[0] ?? null);
            setHours(Array.isArray(h) ? h : null);
            setLoading(false);
        });
    }, []);

    const address = contact?.address?.trim();
    const phone = contact?.phone?.trim();
    const mail = contact?.mail?.trim();
    // Маршрут — по адресу из админки (раньше адрес был зашит в код)
    const directionsUrl = address ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}` : undefined;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (sending) return;
        setSending(true);
        setErrorText('');

        try {
            // credentials: капча хранится в серверной сессии (cookie)
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/send`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({name: name.trim(), email: email.trim(), message: message.trim(), captchaText}),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || "We couldn't send your message. Please try again.");
            }

            setSent(true);
            setName('');
            setEmail('');
            setMessage('');
        } catch (err) {
            const text = err instanceof Error ? err.message : '';
            setErrorText(text === 'Failed to fetch'
                ? "We couldn't reach the server. Please check your connection and try again."
                : text || "We couldn't send your message. Please try again.");
        } finally {
            // Капча одноразовая — после любой попытки нужна новая
            refreshCaptcha();
            setSending(false);
        }
    };

    return (
        <div className="mt-24 my-container mx-auto">
            <div className="container mx-auto px-4 pt-6 pb-16">
                <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-start">
                    {/* Контакты, часы и карта */}
                    <section className="min-w-0 main-block-color rounded-3xl p-5 sm:p-8 space-y-6">
                        <div>
                            <p className={EYEBROW}>Contact us</p>
                            <h1 className={`${raleway.className} mt-2 text-3xl sm:text-4xl font-bold text-[#12100F] leading-tight`}>
                                We&apos;d love to hear from you
                            </h1>
                            <p className={`${manrope.className} mt-3 text-base text-[#6F5E53] leading-relaxed`}>
                                Whether you have a question about our menu, want to place a custom order, or just want to
                                say hello — feel free to reach out.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-3">
                            <ContactTile icon={Phone} label="Phone" value={phone}
                                         href={phone ? `tel:${phone.replace(/\s+/g, '')}` : undefined} loading={loading}/>
                            <ContactTile icon={Mail} label="Email" value={mail}
                                         href={mail ? `mailto:${mail}` : undefined} loading={loading}/>
                            <div className="sm:col-span-2">
                                <ContactTile icon={MapPin} label="Address" value={address} href={directionsUrl} external loading={loading}/>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#B8485B]/10">
                            <h2 className={`${raleway.className} flex items-center gap-2 text-base font-bold text-[#12100F]`}>
                                <Clock className="w-4 h-4 text-[#B8485B]" aria-hidden="true"/>
                                Opening hours
                            </h2>
                            {loading ? (
                                <div className="mt-3 space-y-2"><Skeleton className="h-4 w-full"/><Skeleton className="h-4 w-4/5"/></div>
                            ) : hours && hours.length > 0 ? (
                                <dl className={`${manrope.className} mt-2 divide-y divide-[#F0E6E3]`}>
                                    {hours.map((h) => (
                                        <div key={h.id} className="flex justify-between gap-4 py-2 text-sm">
                                            <dt className="text-[#3B302B]">{h.days}</dt>
                                            <dd className="font-semibold text-[#12100F] tabular-nums lining-nums">{h.times}</dd>
                                        </div>
                                    ))}
                                </dl>
                            ) : (
                                <p className={`${manrope.className} mt-2 text-sm text-[#6F5E53]`}>Please call us for opening hours.</p>
                            )}
                        </div>

                        <div className="space-y-3">
                            {/* Карта живая: её можно двигать и приближать; маршрут — отдельной кнопкой */}
                            <div className="h-[260px] w-full overflow-hidden rounded-2xl bg-white shadow-sm">
                                {loading ? <Skeleton className="w-full h-full rounded-2xl"/> : <MapEmbed html={contact?.map}/>}
                            </div>
                            {directionsUrl && (
                                <a
                                    href={directionsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`${manrope.className} inline-flex items-center gap-2 h-11 px-5 rounded-full bg-white text-[#B8485B] text-sm font-semibold
                                                ring-1 ring-[#B8485B]/30 transition hover:ring-[#B8485B]`}
                                >
                                    <Navigation className="w-4 h-4" aria-hidden="true"/>
                                    Get directions
                                </a>
                            )}
                        </div>
                    </section>

                    {/* Форма */}
                    <section className="rounded-3xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-6 sm:p-8 lg:sticky lg:top-28">
                        {sent ? (
                            <div role="status" className="flex flex-col items-center text-center py-12 gap-4">
                                <span className="w-16 h-16 rounded-full bg-[#EAF5EC] text-[#2F6B3F] flex items-center justify-center">
                                    <CheckCircle2 className="w-8 h-8" aria-hidden="true"/>
                                </span>
                                <h2 className={`${raleway.className} text-2xl font-bold text-[#12100F]`}>Message sent!</h2>
                                <p className={`${manrope.className} max-w-sm text-[#6F5E53]`}>
                                    Thank you for getting in touch. We&apos;ll try to get back to you within a couple of hours.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setSent(false)}
                                    className={`${manrope.className} mt-2 h-12 px-6 rounded-full ring-1 ring-[#B8485B]/40 text-[#B8485B]
                                                font-semibold cursor-pointer transition-colors hover:bg-[#B8485B] hover:text-white`}
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <>
                                <h2 className={`${raleway.className} text-2xl font-bold text-[#12100F]`}>Send us a message</h2>
                                <p className={`${manrope.className} mt-2 text-sm text-[#6F5E53]`}>
                                    Tell us how we can help and we will try to get back to you within a couple of hours.
                                    Planning a special cake? Use the <Link href="/custom" className="link-underline font-semibold text-[#B8485B]">custom order form</Link>.
                                </p>

                                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="ct-name" className={LABEL}>Name</label>
                                            <input id="ct-name" type="text" autoComplete="name" required maxLength={100}
                                                   value={name} onChange={(e) => setName(e.target.value)}
                                                   placeholder="Jane Smith" className={INPUT}/>
                                        </div>
                                        <div>
                                            <label htmlFor="ct-email" className={LABEL}>Email</label>
                                            <input id="ct-email" type="email" autoComplete="email" required maxLength={255}
                                                   value={email} onChange={(e) => setEmail(e.target.value)}
                                                   placeholder="you@example.com" className={INPUT}/>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="ct-message" className={LABEL}>Message</label>
                                        <textarea id="ct-message" required rows={6} maxLength={3000}
                                                  value={message} onChange={(e) => setMessage(e.target.value)}
                                                  placeholder="How can we help?"
                                                  className={`${INPUT} h-auto py-3 resize-y min-h-36`}/>
                                    </div>

                                    <div>
                                        <label htmlFor="ct-captcha" className={LABEL}>Type the code from the picture</label>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <div className="h-[50px] w-[150px] shrink-0 overflow-hidden rounded-xl ring-1 ring-[#B8485B]/20 bg-[#F0F0F0]">
                                                {captchaKey === null ? (
                                                    <Skeleton className="w-full h-full"/>
                                                ) : (
                                                    // eslint-disable-next-line @next/next/no-img-element -- SVG-капча с API, next/image не нужен
                                                    <img
                                                        src={`${process.env.NEXT_PUBLIC_API_URL}/captcha?t=${captchaKey}`}
                                                        alt="Security code"
                                                        width={150}
                                                        height={50}
                                                    />
                                                )}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={refreshCaptcha}
                                                aria-label="Show a new code"
                                                title="New code"
                                                className="w-11 h-11 rounded-full flex items-center justify-center text-[#B8485B] cursor-pointer
                                                           ring-1 ring-[#B8485B]/20 transition hover:bg-[#B8485B]/10"
                                            >
                                                <RefreshCw className="w-4 h-4"/>
                                            </button>
                                            <input
                                                id="ct-captcha"
                                                type="text"
                                                required
                                                autoComplete="off"
                                                value={captchaText}
                                                onChange={(e) => setCaptchaText(e.target.value)}
                                                placeholder="Code"
                                                className={`${INPUT} flex-1 min-w-32`}
                                            />
                                        </div>
                                    </div>

                                    {errorText && (
                                        <div role="alert" className="flex items-start gap-3 rounded-2xl bg-[#FEF3F2] ring-1 ring-[#B42318]/20 p-4">
                                            <AlertCircle className="w-5 h-5 shrink-0 text-[#B42318] mt-0.5" aria-hidden="true"/>
                                            <p className={`${manrope.className} text-sm text-[#912018]`}>{errorText}</p>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={sending}
                                        className={`${manrope.className} w-full inline-flex items-center justify-center gap-2 h-14 rounded-full
                                                    main-button-color text-white text-base font-semibold shadow-md cursor-pointer transition
                                                    hover:brightness-110 hover:shadow-lg disabled:opacity-70 disabled:cursor-wait
                                                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8485B]/50 focus-visible:ring-offset-2`}
                                    >
                                        {sending
                                            ? <><Loader2 className="w-5 h-5 animate-spin" aria-hidden="true"/> Sending…</>
                                            : <><Send className="w-5 h-5" aria-hidden="true"/> Send message</>}
                                    </button>
                                </form>
                            </>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Contact;
