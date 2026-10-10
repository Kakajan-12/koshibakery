"use client";

import React, {useCallback, useEffect, useState} from "react";
import Image from "next/image";
import Link from "next/link";
import {
    AlertCircle, ArrowLeft, Check, Clock, Loader2, Lock, LogIn, MapPin, MessageSquareText, Minus, Navigation, Phone, Plus,
    ShoppingBag, Store, Trash2, Truck,
} from "lucide-react";
import {formatPrice} from "@/lib/price";
import {manrope, raleway} from "@/app/fonts";
import {CartItem, MAX_QUANTITY, useCart} from "@/app/context/CartContext";
import {useAuth} from "@/app/context/AuthContext";
import {Skeleton} from "@/components/ui/skeleton";
import MapEmbed from "@/components/MapEmbed";
import AddressPicker from "@/components/AddressPicker";
import ConfirmDialog from "@/components/ConfirmDialog";
import ReadyTimePicker, {shortDate} from "@/components/ReadyTimePicker";
import {formatAddress, PickedPlace} from "@/lib/places";

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

type OrderType = "delivery" | "collect";
type Quote = { state: "idle" | "loading" | "ok" | "error"; fee: number; error?: string };

// Те же значения, что на сервере (controllers/order/pricing.js)
const CUSTOM_MESSAGE_FEE = 10;
const MAX_MESSAGE_LENGTH = 60;
const MESSAGES_KEY = "cart-messages";

const INPUT = `${manrope.className} w-full h-12 px-4 rounded-xl bg-white text-[15px] text-[#12100F] placeholder:text-gray-400
    ring-1 ring-[#B8485B]/20 outline-none transition focus:ring-2 focus:ring-[#B8485B]/50`;
const LABEL = `${manrope.className} block text-sm font-semibold text-[#12100F] mb-1.5`;
const CARD = "rounded-2xl bg-white p-4 sm:p-6 shadow-sm ring-1 ring-[#B8485B]/10";
const H2 = `${raleway.className} text-lg sm:text-xl font-bold text-[#12100F]`;
const PRIMARY_BTN = `${manrope.className} inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full main-button-color text-white text-[15px] font-semibold shadow-sm cursor-pointer transition hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed`;
const SECONDARY_BTN = `${manrope.className} inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full bg-white text-[#B8485B] text-sm font-semibold ring-1 ring-[#B8485B]/30 cursor-pointer transition hover:ring-[#B8485B] disabled:opacity-60`;

const api = (path: string) => `${process.env.NEXT_PUBLIC_API_URL}${path}`;
const itemKey = (item: Pick<CartItem, "id" | "variantName">) => `${item.id}-${item.variantName}`;

function ErrorNote({children}: { children: React.ReactNode }) {
    return (
        <div role="alert" className="flex items-start gap-3 rounded-xl bg-[#FEF3F2] ring-1 ring-[#B42318]/20 p-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-[#B42318]" aria-hidden="true"/>
            <p className={`${manrope.className} text-sm text-[#912018]`}>{children}</p>
        </div>
    );
}

// Переключатель «Доставка / Самовывоз»
function OrderTypeSwitch({value, onChange}: { value: OrderType; onChange: (v: OrderType) => void }) {
    const options: { value: OrderType; label: string; hint: string; icon: typeof Truck }[] = [
        {value: "delivery", label: "Delivery", hint: "Within London", icon: Truck},
        {value: "collect", label: "Collection", hint: "Free, from our bakery", icon: Store},
    ];
    return (
        <div role="radiogroup" aria-label="Delivery or collection" className="grid grid-cols-2 gap-3">
            {options.map(({value: v, label, hint, icon: Icon}) => {
                const active = value === v;
                return (
                    <button
                        key={v}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => onChange(v)}
                        className={`flex items-center gap-3 rounded-xl p-4 text-left cursor-pointer transition ${
                            active ? "bg-[#B8485B]/[0.06] ring-2 ring-[#B8485B]" : "ring-1 ring-[#B8485B]/20 hover:ring-[#B8485B]/50"
                        }`}
                    >
                        <span className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${active ? "main-button-color text-white" : "bg-[#F6EEEC] text-[#B8485B]"}`}>
                            <Icon className="w-5 h-5" aria-hidden="true"/>
                        </span>
                        <span className="min-w-0">
                            <span className={`${manrope.className} block font-semibold text-[#12100F]`}>{label}</span>
                            <span className={`${manrope.className} block text-xs text-[#6F5E53]`}>{hint}</span>
                        </span>
                    </button>
                );
            })}
        </div>
    );
}

// Строка товара: количество, удаление и надпись на торте
function CartRow({item, message, onMessage, onQuantity, onRemove}: {
    item: CartItem;
    message: { on: boolean; text: string };
    onMessage: (m: { on: boolean; text: string }) => void;
    onQuantity: (q: number) => void;
    onRemove: () => void;
}) {
    const key = itemKey(item);
    return (
        <li className="py-5 first:pt-0 last:pb-0">
            <div className="flex gap-3 sm:gap-4">
                <Link href={`/menu/${item.id}`} className="relative h-20 w-20 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-xl bg-[#F6EEEC]">
                    {item.main_image && (
                        <Image src={item.main_image} alt={item.product_name} fill sizes="112px" className="object-cover transition-transform duration-300 hover:scale-105"/>
                    )}
                </Link>
                <div className="min-w-0 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <Link href={`/menu/${item.id}`} className={`${raleway.className} block font-bold text-[#12100F] text-base sm:text-lg leading-snug hover:text-[#B8485B] transition-colors`}>
                                {item.product_name}
                            </Link>
                            <p className={`${manrope.className} mt-1 text-sm text-[#6F5E53]`}>
                                {item.variantName && <>Size: {item.variantName} · </>}£{formatPrice(item.price)} each
                            </p>
                        </div>
                        <button type="button" onClick={onRemove} aria-label={`Remove ${item.product_name} from cart`}
                                className="h-9 w-9 shrink-0 -mr-2 -mt-1 rounded-full flex items-center justify-center text-[#6F5E53] cursor-pointer transition hover:bg-[#FEF3F2] hover:text-[#B42318]">
                            <Trash2 className="w-4 h-4"/>
                        </button>
                    </div>

                    <div className="mt-auto pt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                        <div className="inline-flex items-center rounded-full ring-1 ring-[#B8485B]/25 bg-white">
                            <button type="button" onClick={() => onQuantity(item.quantity - 1)} disabled={item.quantity <= 1}
                                    aria-label="Decrease quantity"
                                    className="h-9 w-9 rounded-full flex items-center justify-center text-[#B8485B] cursor-pointer transition hover:bg-[#F6EEEC] disabled:text-[#B8485B]/30 disabled:cursor-not-allowed disabled:hover:bg-transparent">
                                <Minus className="w-4 h-4"/>
                            </button>
                            <span className={`${manrope.className} w-8 text-center font-semibold tabular-nums`} aria-live="polite">{item.quantity}</span>
                            <button type="button" onClick={() => onQuantity(item.quantity + 1)} disabled={item.quantity >= MAX_QUANTITY}
                                    aria-label="Increase quantity"
                                    className="h-9 w-9 rounded-full flex items-center justify-center text-[#B8485B] cursor-pointer transition hover:bg-[#F6EEEC] disabled:text-[#B8485B]/30 disabled:cursor-not-allowed disabled:hover:bg-transparent">
                                <Plus className="w-4 h-4"/>
                            </button>
                        </div>
                        <p className={`${manrope.className} font-bold text-[#12100F] tabular-nums`}>£{formatPrice(item.price * item.quantity)}</p>
                    </div>
                </div>
            </div>

            {/* Надпись на торте */}
            <div className="mt-4">
                <label className="inline-flex items-center gap-3 cursor-pointer select-none">
                    <input
                        type="checkbox"
                        checked={message.on}
                        onChange={(e) => onMessage({...message, on: e.target.checked})}
                        className="peer sr-only"
                    />
                    <span aria-hidden="true"
                          className="relative h-6 w-11 shrink-0 rounded-full bg-[#E7DAD6] transition-colors peer-checked:bg-[#B8485B] peer-focus-visible:ring-2 peer-focus-visible:ring-[#B8485B]/50 peer-focus-visible:ring-offset-2 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-5"/>
                    <span className={`${manrope.className} text-sm text-[#3B302B]`}>
                        <MessageSquareText className="inline w-4 h-4 mr-1 -mt-0.5 text-[#B8485B]" aria-hidden="true"/>
                        Add a message on the cake <span className="text-[#6F5E53]">(+£{CUSTOM_MESSAGE_FEE})</span>
                    </span>
                </label>
                {message.on && (
                    <div className="mt-3">
                        <label htmlFor={`msg-${key}`} className="sr-only">Message for {item.product_name}</label>
                        <input
                            id={`msg-${key}`}
                            type="text"
                            maxLength={MAX_MESSAGE_LENGTH}
                            placeholder="e.g. Happy Birthday, Emma!"
                            value={message.text}
                            onChange={(e) => onMessage({...message, text: e.target.value})}
                            className={INPUT}
                        />
                        <p className={`${manrope.className} mt-1.5 flex justify-between gap-3 text-xs text-[#6F5E53]`}>
                            <span>{message.text.trim() ? "We'll pipe this on your cake." : "Leave empty if you don't need a message — it won't be charged."}</span>
                            <span className="tabular-nums shrink-0">{message.text.length}/{MAX_MESSAGE_LENGTH}</span>
                        </p>
                    </div>
                )}
            </div>
        </li>
    );
}

const Cart = () => {
    const {cart, ready, removeFromCart, clearCart, updateQuantity} = useCart();
    const {setStatus} = useAuth();

    // Надписи на тортах переживают переход на вход и обратно
    const [messages, setMessages] = useState<Record<string, { on: boolean; text: string }>>({});
    const [messagesLoaded, setMessagesLoaded] = useState(false);

    const [orderType, setOrderType] = useState<OrderType>("delivery");
    const [auth, setAuth] = useState<"loading" | "user" | "guest">("loading");
    const [addresses, setAddresses] = useState<{ address: string; main: boolean }[]>([]);
    const [selectedAddress, setSelectedAddress] = useState("");
    const [addingAddress, setAddingAddress] = useState(false);
    const [newPlace, setNewPlace] = useState<PickedPlace | null>(null);
    const [newHouse, setNewHouse] = useState("");
    const [savingAddress, setSavingAddress] = useState(false);
    const [addressError, setAddressError] = useState("");

    const [guest, setGuest] = useState({name: "", email: "", phone: ""});
    const [guestPlace, setGuestPlace] = useState<PickedPlace | null>(null);
    const [guestHouse, setGuestHouse] = useState("");

    const [quote, setQuote] = useState<Quote>({state: "idle", fee: 0});
    // Когда заказ должен быть готов (components/ReadyTimePicker.tsx)
    const [neededDate, setNeededDate] = useState("");
    const [neededTime, setNeededTime] = useState("");
    const onReadyChange = useCallback((date: string, time: string) => {
        setNeededDate(date);
        setNeededTime(time);
    }, []);
    const [submitting, setSubmitting] = useState(false);
    const [checkoutError, setCheckoutError] = useState("");
    const [sessionExpired, setSessionExpired] = useState(false);
    const [clearOpen, setClearOpen] = useState(false);
    // Товар, удаление которого ждёт подтверждения. Данные не сбрасываются при закрытии — иначе текст окна сменился бы во время анимации
    const [removing, setRemoving] = useState<CartItem | null>(null);
    const [removeOpen, setRemoveOpen] = useState(false);

    const [contact, setContact] = useState<ContactData | null>(null);
    const [hours, setHours] = useState<OpenTime[]>([]);

    useEffect(() => {
        try {
            const stored = JSON.parse(sessionStorage.getItem(MESSAGES_KEY) || "{}");
            if (stored && typeof stored === "object") setMessages(stored);
        } catch {
            // нет доступа к хранилищу — начинаем без надписей
        }
        setMessagesLoaded(true);
    }, []);

    useEffect(() => {
        if (!messagesLoaded) return;
        try {
            sessionStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
        } catch {
            // не критично
        }
    }, [messages, messagesLoaded]);

    // Контакты и часы работы — для самовывоза
    useEffect(() => {
        fetch(api("/api/contact")).then((r) => (r.ok ? r.json() : [])).then((d: ContactData[]) => setContact(d?.[0] ?? null)).catch(() => {});
        fetch(api("/api/open-time")).then((r) => (r.ok ? r.json() : [])).then((d: OpenTime[]) => setHours(Array.isArray(d) ? d : [])).catch(() => {});
    }, []);

    // Вошёл ли покупатель и какие у него адреса
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const meRes = await fetch(api("/api/auth/check/me"), {credentials: "include"});
                if (!meRes.ok) {
                    if (!cancelled) setAuth("guest");
                    if (meRes.status === 401) setStatus("guest");
                    return;
                }
                const me = await meRes.json();
                let extra: string[] = [];
                try {
                    const r = await fetch(api("/api/user-addresses"), {credentials: "include"});
                    if (r.ok) extra = (await r.json()).map((a: { address: string }) => a.address);
                } catch {
                    // дополнительные адреса не загрузились — остаётся основной
                }
                if (cancelled) return;
                const list = [
                    ...(me.address ? [{address: me.address as string, main: true}] : []),
                    ...extra.map((address) => ({address, main: false})),
                ];
                setAddresses(list);
                setSelectedAddress(list[0]?.address ?? "");
                setAddingAddress(list.length === 0);
                setStatus("user");
                setAuth("user");
            } catch {
                if (!cancelled) setAuth("guest");
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [setStatus]);

    const isUser = auth === "user";
    const guestAddress = guestPlace ? formatAddress(guestPlace, guestHouse) : "";
    // Пока открыта форма нового адреса, доставку не считаем — адрес ещё не выбран
    const deliveryAddress = isUser ? (addingAddress ? "" : selectedAddress) : guestAddress;

    // Стоимость доставки считает сервер — той же функцией, что и при оплате
    useEffect(() => {
        if (orderType !== "delivery" || !deliveryAddress) {
            setQuote({state: "idle", fee: 0});
            return;
        }
        const controller = new AbortController();
        setQuote({state: "loading", fee: 0});
        const timer = setTimeout(async () => {
            try {
                const res = await fetch(api("/api/delivery-quote"), {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({address: deliveryAddress}),
                    signal: controller.signal,
                });
                const data = await res.json().catch(() => ({}));
                if (res.ok) setQuote({state: "ok", fee: Number(data.deliveryFee) || 0});
                else setQuote({state: "error", fee: 0, error: data.error || "We couldn't calculate delivery for this address."});
            } catch (err) {
                if ((err as Error).name !== "AbortError") {
                    setQuote({state: "error", fee: 0, error: "We couldn't calculate delivery right now. Please try again or choose collection."});
                }
            }
        }, 400);
        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [orderType, deliveryAddress]);

    // Надпись платная, только если переключатель включён и текст не пустой — так же считает сервер
    const messageFor = (item: CartItem) => {
        const m = messages[itemKey(item)];
        return m?.on ? m.text.trim() || null : null;
    };

    const itemCount = cart.reduce((n, i) => n + i.quantity, 0);
    const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const messageCount = cart.filter((i) => messageFor(i)).length;
    const messageFee = messageCount * CUSTOM_MESSAGE_FEE;
    const deliveryFee = orderType === "delivery" && quote.state === "ok" ? quote.fee : 0;
    const total = subtotal + messageFee + deliveryFee;

    const deliveryReady = orderType === "collect" || quote.state === "ok";
    const timeReady = !!neededDate && !!neededTime;
    const canPay = cart.length > 0 && auth !== "loading" && deliveryReady && timeReady && !submitting;

    const saveNewAddress = async () => {
        if (!newPlace) {
            setAddressError("Please choose an address from the suggestions.");
            return;
        }
        setSavingAddress(true);
        setAddressError("");
        const address = formatAddress(newPlace, newHouse);
        try {
            const res = await fetch(api("/api/user-addresses"), {
                method: "POST",
                credentials: "include",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({address, latitude: newPlace.latitude, longitude: newPlace.longitude}),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.message || "Could not save the address.");
            const saved = (data.address as string) || address;
            setAddresses((prev) => [...prev, {address: saved, main: !!data.main}]);
            setSelectedAddress(saved);
            setAddingAddress(false);
            setNewPlace(null);
            setNewHouse("");
        } catch (err) {
            setAddressError(err instanceof Error ? err.message : "Could not save the address.");
        } finally {
            setSavingAddress(false);
        }
    };

    const checkout = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canPay) return;
        setCheckoutError("");

        const items = cart.map((item) => ({...item, custom_message: messageFor(item)}));
        const common = {cart: items, orderType, deliveryFee, customMessageFee: messageFee, total, neededDate, neededTime};

        setSubmitting(true);
        try {
            const res = isUser
                ? await fetch(api("/api/create-checkout-session"), {
                    method: "POST",
                    credentials: "include",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({...common, selectedAddress: orderType === "delivery" ? selectedAddress : ""}),
                })
                : await fetch(api("/api/create-checkout-session/guest"), {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({...common, guest: {...guest, address: orderType === "delivery" ? guestAddress : ""}}),
                });

            if (isUser && res.status === 401) {
                // Сессия закончилась — предлагаем войти снова или оформить как гость
                setStatus("guest");
                setAuth("guest");
                setSessionExpired(true);
                setSubmitting(false);
                return;
            }

            const data = await res.json().catch(() => ({}));
            if (data.url) {
                // Остаёмся в состоянии «submitting», пока браузер уходит на Stripe
                window.location.href = data.url;
                return;
            }
            setCheckoutError(data.error || data.message || "Checkout failed. Please try again.");
        } catch {
            setCheckoutError("We couldn't reach the server. Please check your connection and try again.");
        }
        setSubmitting(false);
    };

    const shell = (children: React.ReactNode) => (
        <div className="mt-24 my-container mx-auto">
            <div className="container mx-auto px-4 pt-6 pb-16">{children}</div>
        </div>
    );

    if (!ready) {
        return shell(
            <div className="main-block-color rounded-3xl p-4 sm:p-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]" aria-busy="true" aria-label="Loading cart">
                <div className="space-y-4">
                    <Skeleton className="h-10 w-48"/>
                    <Skeleton className="h-64 w-full rounded-2xl"/>
                </div>
                <Skeleton className="h-80 w-full rounded-2xl"/>
            </div>
        );
    }

    if (cart.length === 0) {
        return shell(
            <div className="main-block-color rounded-3xl px-6 py-16 sm:py-20 flex flex-col items-center text-center">
                <span className="w-20 h-20 rounded-full bg-white text-[#B8485B] flex items-center justify-center shadow-sm">
                    <ShoppingBag className="w-9 h-9" aria-hidden="true"/>
                </span>
                <h1 className={`${raleway.className} mt-6 text-3xl sm:text-4xl font-bold text-[#12100F]`}>Your cart is empty</h1>
                <p className={`${manrope.className} mt-3 max-w-md text-[#6F5E53]`}>
                    Our cakes and biscuits are baked fresh to order. Find something sweet to start with.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <Link href="/menu" className={PRIMARY_BTN}>Browse the menu</Link>
                    <Link href="/custom" className={SECONDARY_BTN + " h-12"}>Order a custom cake</Link>
                </div>
            </div>
        );
    }

    const directions = contact?.address
        ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(contact.address)}`
        : null;

    return shell(
        <div className="main-block-color rounded-3xl p-4 sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
                <div>
                    <p className={`${manrope.className} text-xs uppercase tracking-[0.18em] text-[#B8485B]`}>Your order</p>
                    <h1 className={`${raleway.className} mt-1 text-3xl sm:text-4xl font-bold text-[#12100F]`}>Your cart</h1>
                    <p className={`${manrope.className} mt-1 text-[#6F5E53]`}>{itemCount} {itemCount === 1 ? "item" : "items"}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Link href="/menu"
                          className={`${manrope.className} group h-10 px-4 inline-flex items-center gap-2 rounded-full bg-white text-sm font-semibold text-[#B8485B] shadow-sm ring-1 ring-[#B8485B]/30 transition hover:ring-[#B8485B] hover:bg-[#B8485B] hover:text-white`}>
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" aria-hidden="true"/>
                        Continue shopping
                    </Link>
                    <button type="button" onClick={() => setClearOpen(true)}
                            className={`${manrope.className} h-10 px-4 inline-flex items-center gap-2 rounded-full bg-white text-sm font-semibold text-[#6F5E53] shadow-sm ring-1 ring-[#6F5E53]/20 cursor-pointer transition hover:ring-[#B42318]/40 hover:bg-[#FEF3F2] hover:text-[#B42318]`}>
                        <Trash2 className="w-4 h-4" aria-hidden="true"/> Clear cart
                    </button>
                </div>
            </div>

            <form onSubmit={checkout} className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] items-start">
                <div className="space-y-6 min-w-0">
                    {/* Товары */}
                    <section className={CARD} aria-label="Items in your cart">
                        <ul className="divide-y divide-[#F0E6E3]">
                            {cart.map((item) => {
                                const key = itemKey(item);
                                return (
                                    <CartRow
                                        key={key}
                                        item={item}
                                        message={messages[key] ?? {on: false, text: ""}}
                                        onMessage={(m) => setMessages((prev) => ({...prev, [key]: m}))}
                                        onQuantity={(q) => updateQuantity(item.id, item.variantName, q)}
                                        onRemove={() => {
                                            setRemoving(item);
                                            setRemoveOpen(true);
                                        }}
                                    />
                                );
                            })}
                        </ul>
                    </section>

                    {/* Контактные данные гостя */}
                    {auth === "guest" && (
                        <section className={CARD} aria-labelledby="guest-title">
                            {sessionExpired && (
                                <div className="mb-5"><ErrorNote>Your session has expired. Log in again or continue as a guest.</ErrorNote></div>
                            )}
                            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#FBF7F6] p-4 mb-6">
                                <p className={`${manrope.className} text-sm text-[#3B302B]`}>
                                    Have an account? Log in to use your saved addresses and see your orders.
                                </p>
                                <Link href="/login?next=/cart" className={SECONDARY_BTN}>
                                    <LogIn className="w-4 h-4" aria-hidden="true"/> Log in
                                </Link>
                            </div>
                            <h2 id="guest-title" className={H2}>Your details</h2>
                            <p className={`${manrope.className} mt-1 text-sm text-[#6F5E53]`}>We&apos;ll send your receipt and order updates here.</p>
                            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <label htmlFor="g-name" className={LABEL}>Full name</label>
                                    <input id="g-name" required maxLength={100} autoComplete="name" className={INPUT}
                                           value={guest.name} onChange={(e) => setGuest({...guest, name: e.target.value})}/>
                                </div>
                                <div>
                                    <label htmlFor="g-email" className={LABEL}>Email</label>
                                    <input id="g-email" type="email" required maxLength={255} autoComplete="email" className={INPUT}
                                           value={guest.email} onChange={(e) => setGuest({...guest, email: e.target.value})}/>
                                </div>
                                <div>
                                    <label htmlFor="g-phone" className={LABEL}>Phone</label>
                                    <input id="g-phone" type="tel" required maxLength={30} autoComplete="tel" placeholder="+44 7…"
                                           className={INPUT} value={guest.phone} onChange={(e) => setGuest({...guest, phone: e.target.value})}/>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Доставка или самовывоз */}
                    <section className={CARD} aria-labelledby="fulfil-title">
                        <h2 id="fulfil-title" className={`${H2} mb-4`}>How would you like to get it?</h2>
                        <OrderTypeSwitch value={orderType} onChange={(v) => {
                            setOrderType(v);
                            setCheckoutError("");
                        }}/>

                        {orderType === "delivery" && auth === "loading" && <Skeleton className="mt-6 h-24 w-full rounded-xl"/>}

                        {/* Доставка: сохранённые адреса */}
                        {orderType === "delivery" && isUser && (
                            <div className="mt-6">
                                <div className="flex items-center justify-between gap-3 mb-3">
                                    <h3 className={`${manrope.className} font-semibold text-[#12100F]`}>Delivery address</h3>
                                    <Link href="/profile?tab=addresses" className={`${manrope.className} text-sm font-semibold text-[#B8485B] link-underline`}>
                                        Manage addresses
                                    </Link>
                                </div>
                                {addresses.length > 0 && (
                                    <div role="radiogroup" aria-label="Saved addresses" className="space-y-2">
                                        {addresses.map((a) => {
                                            const active = !addingAddress && selectedAddress === a.address;
                                            return (
                                                <label key={a.address}
                                                       className={`flex items-start gap-3 rounded-xl p-4 cursor-pointer transition ${
                                                           active ? "bg-[#B8485B]/[0.06] ring-2 ring-[#B8485B]" : "ring-1 ring-[#B8485B]/20 hover:ring-[#B8485B]/50"
                                                       }`}>
                                                    <input type="radio" name="address" className="mt-1 accent-[#B8485B] w-4 h-4 cursor-pointer"
                                                           checked={active} onChange={() => {
                                                        setSelectedAddress(a.address);
                                                        setAddingAddress(false);
                                                    }}/>
                                                    <span className={`${manrope.className} min-w-0 flex-1 text-[15px] text-[#12100F] break-words`}>
                                                        {a.address}
                                                        {a.main && <span className="ml-2 inline-block rounded-full bg-[#B8485B]/10 px-2 py-0.5 text-xs font-semibold text-[#B8485B] align-middle">Main</span>}
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                )}

                                {addingAddress ? (
                                    <div className="mt-3 space-y-4 rounded-xl bg-[#FBF7F6] p-4 sm:p-5">
                                        <AddressPicker
                                            id="cart-new-address"
                                            label={addresses.length ? "New address" : "Add a delivery address"}
                                            hint="It will be saved to your account. We deliver within London."
                                            onChange={(place, house) => {
                                                setNewPlace(place);
                                                setNewHouse(house);
                                                setAddressError("");
                                            }}
                                        />
                                        {addressError && <ErrorNote>{addressError}</ErrorNote>}
                                        <div className="flex flex-wrap gap-3">
                                            <button type="button" onClick={saveNewAddress} disabled={savingAddress} className={`${PRIMARY_BTN} h-11 text-sm`}>
                                                {savingAddress ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true"/> : <Check className="w-4 h-4" aria-hidden="true"/>}
                                                {savingAddress ? "Saving…" : "Use this address"}
                                            </button>
                                            {addresses.length > 0 && (
                                                <button type="button" onClick={() => setAddingAddress(false)} disabled={savingAddress} className={SECONDARY_BTN}>Cancel</button>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <button type="button" onClick={() => setAddingAddress(true)}
                                            className={`${manrope.className} mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#B8485B] cursor-pointer link-underline`}>
                                        <Plus className="w-4 h-4" aria-hidden="true"/> Deliver to a new address
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Доставка: адрес гостя */}
                        {orderType === "delivery" && auth === "guest" && (
                            <div className="mt-6">
                                <AddressPicker
                                    id="cart-guest-address"
                                    label="Delivery address"
                                    hint="We deliver within London. Choose your address from the list."
                                    required
                                    onChange={(place, house) => {
                                        setGuestPlace(place);
                                        setGuestHouse(house);
                                    }}
                                />
                            </div>
                        )}

                        {orderType === "delivery" && quote.state === "error" && (
                            <div className="mt-4"><ErrorNote>{quote.error}</ErrorNote></div>
                        )}

                        {/* Самовывоз */}
                        {orderType === "collect" && (
                            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                <div className={`${manrope.className} space-y-4 text-sm`}>
                                    <div className="flex gap-3">
                                        <MapPin className="w-5 h-5 shrink-0 text-[#B8485B]" aria-hidden="true"/>
                                        <div>
                                            <p className="font-semibold text-[#12100F]">Collect from</p>
                                            <p className="text-[#3B302B]">{contact?.address || "Koshi Bakery, London"}</p>
                                            {directions && (
                                                <a href={directions} target="_blank" rel="noopener noreferrer"
                                                   className="mt-1 inline-flex items-center gap-1 font-semibold text-[#B8485B] link-underline">
                                                    <Navigation className="w-3.5 h-3.5" aria-hidden="true"/> Get directions
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    {hours.length > 0 && (
                                        <div className="flex gap-3">
                                            <Clock className="w-5 h-5 shrink-0 text-[#B8485B]" aria-hidden="true"/>
                                            <div>
                                                <p className="font-semibold text-[#12100F]">Opening hours</p>
                                                {hours.map((h) => (
                                                    <p key={h.id} className="text-[#3B302B]"><span className="text-[#6F5E53]">{h.days}:</span> {h.times}</p>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {contact?.phone && (
                                        <div className="flex gap-3">
                                            <Phone className="w-5 h-5 shrink-0 text-[#B8485B]" aria-hidden="true"/>
                                            <div>
                                                <p className="font-semibold text-[#12100F]">Questions?</p>
                                                <a href={`tel:${contact.phone}`} className="text-[#3B302B] link-underline">{contact.phone}</a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {contact?.map && (
                                    <div className="relative min-h-[200px] overflow-hidden rounded-xl ring-1 ring-[#B8485B]/10">
                                        <MapEmbed html={contact.map} className="absolute inset-0 w-full h-full"/>
                                    </div>
                                )}
                            </div>
                        )}
                    </section>

                    {/* Когда нужен заказ */}
                    <section className={CARD} aria-labelledby="ready-title">
                        <h2 id="ready-title" className={`${H2} mb-1`}>
                            {orderType === "delivery" ? "When should we deliver?" : "When will you collect?"}
                        </h2>
                        <p className={`${manrope.className} mb-4 text-sm text-[#6F5E53]`}>
                            Everything is baked fresh for your order.
                        </p>
                        <ReadyTimePicker
                            productIds={cart.map((i) => i.id)}
                            orderType={orderType}
                            date={neededDate}
                            time={neededTime}
                            onChange={onReadyChange}
                        />
                    </section>
                </div>

                {/* Итог заказа */}
                <aside className={`${CARD} lg:sticky lg:top-28`} aria-labelledby="summary-title">
                    <h2 id="summary-title" className={H2}>Order summary</h2>
                    <dl className={`${manrope.className} mt-5 space-y-3 text-[15px]`}>
                        <div className="flex justify-between gap-4">
                            <dt className="text-[#6F5E53]">Items ({itemCount})</dt>
                            <dd className="tabular-nums text-[#12100F]">£{formatPrice(subtotal)}</dd>
                        </div>
                        {messageCount > 0 && (
                            <div className="flex justify-between gap-4">
                                <dt className="text-[#6F5E53]">Cake messages ({messageCount} × £{CUSTOM_MESSAGE_FEE})</dt>
                                <dd className="tabular-nums text-[#12100F]">£{formatPrice(messageFee)}</dd>
                            </div>
                        )}
                        <div className="flex justify-between gap-4">
                            <dt className="text-[#6F5E53]">{orderType === "delivery" ? "Delivery" : "Collection"}</dt>
                            <dd className="tabular-nums text-right text-[#12100F]">
                                {orderType === "collect" ? "Free"
                                    : quote.state === "ok" ? `£${formatPrice(quote.fee)}`
                                        : quote.state === "loading" ? <span className="inline-flex items-center gap-1.5 text-[#6F5E53]"><Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true"/>Calculating…</span>
                                            : <span className="text-[#6F5E53]">{quote.state === "error" ? "Unavailable" : "Add address"}</span>}
                            </dd>
                        </div>
                        {timeReady && (
                            <div className="flex justify-between gap-4">
                                <dt className="text-[#6F5E53]">{orderType === "delivery" ? "Delivery on" : "Collect on"}</dt>
                                <dd className="text-right text-[#12100F]">{shortDate(neededDate)}, {neededTime}</dd>
                            </div>
                        )}
                        <div className="flex justify-between gap-4 border-t border-[#F0E6E3] pt-4 text-lg font-bold text-[#12100F]">
                            <dt>Total</dt>
                            <dd className="tabular-nums">£{formatPrice(total)}</dd>
                        </div>
                    </dl>

                    {checkoutError && <div className="mt-5"><ErrorNote>{checkoutError}</ErrorNote></div>}

                    <button type="submit" disabled={!canPay} className={`${PRIMARY_BTN} mt-6 w-full`}>
                        {submitting ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true"/> : <Lock className="w-4 h-4" aria-hidden="true"/>}
                        {submitting ? "Redirecting to payment…" : `Pay £${formatPrice(total)}`}
                    </button>
                    {!deliveryReady && quote.state !== "loading" ? (
                        <p className={`${manrope.className} mt-3 text-center text-xs text-[#6F5E53]`}>
                            {isUser && addingAddress ? "Save the new address to continue." : "Choose a delivery address to continue, or switch to collection."}
                        </p>
                    ) : !timeReady && (
                        <p className={`${manrope.className} mt-3 text-center text-xs text-[#6F5E53]`}>
                            Choose a date and time to continue.
                        </p>
                    )}
                    <p className={`${manrope.className} mt-4 flex items-center justify-center gap-1.5 text-xs text-[#6F5E53]`}>
                        <Lock className="w-3 h-3" aria-hidden="true"/> Secure payment by Stripe
                    </p>
                </aside>
            </form>

            <ConfirmDialog
                open={clearOpen}
                title="Clear your cart?"
                description={`All ${itemCount} ${itemCount === 1 ? "item" : "items"} will be removed from your cart.`}
                confirmLabel="Clear cart"
                tone="danger"
                onConfirm={() => {
                    clearCart();
                    setMessages({});
                    setClearOpen(false);
                }}
                onClose={() => setClearOpen(false)}
            />

            <ConfirmDialog
                open={removeOpen}
                title="Remove this item?"
                description={removing && (
                    <div className="flex items-center gap-3">
                        {removing.main_image && (
                            <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#F6EEEC]">
                                <Image src={removing.main_image} alt="" fill sizes="56px" className="object-cover"/>
                            </span>
                        )}
                        <span>
                            <span className="block font-semibold text-[#12100F]">{removing.product_name}</span>
                            <span className="block">
                                {removing.variantName && <>{removing.variantName} · </>}
                                {removing.quantity} × £{formatPrice(removing.price)}
                            </span>
                        </span>
                    </div>
                )}
                confirmLabel="Remove"
                tone="danger"
                onConfirm={() => {
                    if (removing) {
                        removeFromCart(removing.id, removing.variantName);
                        // Надпись удалённого товара не должна всплыть, если его добавят снова
                        setMessages((prev) => {
                            const next = {...prev};
                            delete next[itemKey(removing)];
                            return next;
                        });
                    }
                    setRemoveOpen(false);
                }}
                onClose={() => setRemoveOpen(false)}
            />
        </div>
    );
};

export default Cart;
