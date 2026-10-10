"use client";

import {Suspense, useEffect, useState} from "react";
import {useSearchParams} from "next/navigation";
import OrderItemThumb from "@/components/OrderItemThumb";
import {readyLabel} from "@/lib/readyDate";
import Link from "next/link";
import {CakeSlice, Check, ClipboardList, Mail, MessageSquareText, PackageCheck, Store, Truck} from "lucide-react";
import {manrope, raleway} from "@/app/fonts";
import {formatPrice} from "@/lib/price";
import {useCart} from "@/app/context/CartContext";
import {useAuth} from "@/app/context/AuthContext";
import {Skeleton} from "@/components/ui/skeleton";

interface OrderSummary {
    id: number;
    created_at: string;
    paid: boolean;
    orderType: "delivery" | "collect";
    neededDate: string | null;
    neededTime: string | null;
    items: {
        product_name: string;
        variantName: string | null;
        quantity: number;
        price: number;
        main_image: string | null;
        custom_message: string | null;
    }[];
    deliveryFee: number;
    customMessageFee: number;
    total: number;
    email: string | null;
    is_guest: boolean;
}

const PRIMARY_BTN = `${manrope.className} inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full main-button-color text-white text-[15px] font-semibold shadow-sm transition hover:brightness-110`;
const SECONDARY_BTN = `${manrope.className} inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-white text-[#B8485B] text-[15px] font-semibold ring-1 ring-[#B8485B]/30 transition hover:ring-[#B8485B]`;

function SuccessContent() {
    const sessionId = useSearchParams().get("session_id");
    const {ready, clearCart} = useCart();
    const {status} = useAuth();
    const [order, setOrder] = useState<OrderSummary | null>(null);
    // loading — ждём сервер; done — заказ получен или показать его не удалось
    const [state, setState] = useState<"loading" | "done">(sessionId ? "loading" : "done");
    const [paidCheckout, setPaidCheckout] = useState(false);

    useEffect(() => {
        if (!sessionId) return;
        let cancelled = false;
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/order/session/${encodeURIComponent(sessionId)}`)
            .then((res) => (res.ok ? res.json() : null))
            .then((data: OrderSummary | null) => {
                if (cancelled) return;
                setOrder(data);
                // Корзину чистим, только если заказ действительно есть (или сервер недоступен, но Stripe вернул сюда)
                setPaidCheckout(!!data);
            })
            .catch(() => !cancelled && setPaidCheckout(true))
            .finally(() => !cancelled && setState("done"));
        return () => {
            cancelled = true;
        };
    }, [sessionId]);

    // Ждём, пока корзина прочитается из localStorage, — иначе прочитанная корзина перезаписала бы очистку
    useEffect(() => {
        if (!ready || !paidCheckout) return;
        clearCart();
        try {
            sessionStorage.removeItem("cart-messages");
        } catch {
            // не критично
        }
        // clearCart не в зависимостях: функция новая на каждый рендер, эффект должен сработать один раз
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ready, paidCheckout]);

    if (state === "loading") {
        return (
            <div className="flex flex-col items-center gap-4 py-6" aria-busy="true" aria-label="Loading your order">
                <Skeleton className="h-20 w-20 rounded-full"/>
                <Skeleton className="h-9 w-72"/>
                <Skeleton className="h-5 w-96 max-w-full"/>
                <Skeleton className="mt-6 h-64 w-full max-w-2xl rounded-2xl"/>
            </div>
        );
    }

    const delivery = order?.orderType === "delivery";
    const showOrdersLink = status === "user" && !order?.is_guest;

    const readyAt = order ? readyLabel(order.neededDate, order.neededTime, "long") : null;
    const steps = [
        {
            icon: Mail,
            title: "Confirmation email",
            text: order && !order.paid
                ? `We'll email ${order.email ?? "you"} as soon as your payment is confirmed.`
                : order?.email ? `We've sent your receipt to ${order.email}.` : "Your receipt is on its way to your inbox.",
        },
        {icon: CakeSlice, title: "Baked fresh for you", text: "We bake your order fresh, timed for the date you chose."},
        delivery
            ? {
                icon: Truck,
                title: "Delivery",
                text: readyAt
                    ? `We'll deliver on ${readyAt} to the address you chose. If anything needs confirming, we'll contact you.`
                    : "We'll deliver to the address you chose. If anything needs confirming, we'll contact you.",
            }
            : {
                icon: Store,
                title: "Collection",
                text: readyAt
                    ? `Your order will be ready to collect on ${readyAt}. Directions are on the Contact page.`
                    : "Pick up your order from our bakery during opening hours. Directions are on the Contact page.",
            },
    ];

    return (
        <>
            {/* Заголовок */}
            <div className="flex flex-col items-center text-center">
                <span className="relative flex h-20 w-20 items-center justify-center">
                    <span className="absolute inset-0 rounded-full bg-[#2F6B3F]/15 animate-ping [animation-iteration-count:2]" aria-hidden="true"/>
                    <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[#2F6B3F] text-white shadow-lg">
                        <Check className="h-10 w-10" strokeWidth={3} aria-hidden="true"/>
                    </span>
                </span>
                <p className={`${manrope.className} mt-6 text-xs uppercase tracking-[0.18em] text-[#B8485B]`}>
                    {order && !order.paid ? "Order received" : "Payment successful"}
                </p>
                <h1 className={`${raleway.className} mt-2 text-3xl sm:text-4xl font-bold text-[#12100F]`}>Thank you for your order!</h1>
                {order ? (
                    <p className={`${manrope.className} mt-3 text-[#6F5E53]`}>
                        Order <span className="font-semibold text-[#12100F]">#{order.id}</span>
                        {" · "}
                        {new Date(order.created_at).toLocaleString("en-GB", {day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"})}
                    </p>
                ) : (
                    <p className={`${manrope.className} mt-3 max-w-md text-[#6F5E53]`}>
                        We&apos;re preparing your order and will be in touch soon.
                    </p>
                )}
                {order && !order.paid && (
                    <p className={`${manrope.className} mt-3 max-w-md text-sm text-[#9A5B13]`}>
                        Your payment is still being confirmed. This usually takes a moment — we&apos;ll email you once it&apos;s done.
                    </p>
                )}
            </div>

            {/* Состав заказа */}
            {order && order.items.length > 0 && (
                <section className="mx-auto mt-10 max-w-2xl rounded-2xl bg-white p-5 sm:p-6 shadow-sm ring-1 ring-[#B8485B]/10" aria-labelledby="order-items">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <h2 id="order-items" className={`${raleway.className} text-lg font-bold text-[#12100F]`}>Your order</h2>
                        <span className={`${manrope.className} inline-flex items-center gap-1.5 rounded-full bg-[#F6EEEC] px-3 py-1 text-xs font-semibold text-[#3B302B]`}>
                            {delivery ? <Truck className="w-3.5 h-3.5" aria-hidden="true"/> : <Store className="w-3.5 h-3.5" aria-hidden="true"/>}
                            {delivery ? "Delivery" : "Collection"}
                            {readyLabel(order.neededDate, order.neededTime) && <> · {readyLabel(order.neededDate, order.neededTime)}</>}
                        </span>
                    </div>
                    <ul className="mt-4 divide-y divide-[#F0E6E3]">
                        {order.items.map((item, i) => (
                            <li key={i} className="flex items-center gap-4 py-3">
                                <OrderItemThumb src={item.main_image}/>
                                <div className="min-w-0 flex-1">
                                    <p className={`${manrope.className} font-semibold text-[#12100F] truncate`}>{item.product_name}</p>
                                    <p className={`${manrope.className} text-xs text-[#6F5E53]`}>
                                        {[item.variantName, `× ${item.quantity}`].filter(Boolean).join(" · ")}
                                    </p>
                                    {item.custom_message && (
                                        <p className={`${manrope.className} mt-0.5 flex items-center gap-1 text-xs text-[#9A5B13] truncate`}>
                                            <MessageSquareText className="w-3.5 h-3.5 shrink-0" aria-hidden="true"/> “{item.custom_message}”
                                        </p>
                                    )}
                                </div>
                                <p className={`${manrope.className} text-sm font-semibold text-[#12100F] tabular-nums`}>
                                    £{formatPrice(item.price * item.quantity)}
                                </p>
                            </li>
                        ))}
                    </ul>
                    <dl className={`${manrope.className} mt-2 space-y-1.5 border-t border-[#F0E6E3] pt-4 text-sm`}>
                        {order.customMessageFee > 0 && (
                            <div className="flex justify-between text-[#6F5E53]"><dt>Cake messages</dt><dd className="tabular-nums">£{formatPrice(order.customMessageFee)}</dd></div>
                        )}
                        <div className="flex justify-between text-[#6F5E53]">
                            <dt>{delivery ? "Delivery" : "Collection"}</dt>
                            <dd className="tabular-nums">{delivery ? `£${formatPrice(order.deliveryFee)}` : "Free"}</dd>
                        </div>
                        <div className="flex justify-between pt-2 text-base font-bold text-[#12100F]">
                            <dt>{order.paid ? "Total paid" : "Total"}</dt>
                            <dd className="tabular-nums">£{formatPrice(order.total)}</dd>
                        </div>
                    </dl>
                </section>
            )}

            {/* Что дальше */}
            <section className="mx-auto mt-8 max-w-2xl" aria-labelledby="next-steps">
                <h2 id="next-steps" className={`${raleway.className} text-lg font-bold text-[#12100F] text-center`}>What happens next</h2>
                <ol className="mt-5 grid gap-4 sm:grid-cols-3">
                    {steps.map(({icon: Icon, title, text}) => (
                        <li key={title} className="rounded-2xl bg-white/70 p-5 ring-1 ring-[#B8485B]/10">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#B8485B]/10 text-[#B8485B]">
                                <Icon className="w-5 h-5" aria-hidden="true"/>
                            </span>
                            <p className={`${manrope.className} mt-3 font-semibold text-[#12100F]`}>{title}</p>
                            <p className={`${manrope.className} mt-1 text-sm leading-relaxed text-[#6F5E53]`}>{text}</p>
                        </li>
                    ))}
                </ol>
            </section>

            <div className="mt-10 flex flex-wrap justify-center gap-3">
                {showOrdersLink && (
                    <Link href="/profile?tab=orders" className={PRIMARY_BTN}>
                        <ClipboardList className="w-4 h-4" aria-hidden="true"/> View my orders
                    </Link>
                )}
                <Link href="/menu" className={showOrdersLink ? SECONDARY_BTN : PRIMARY_BTN}>
                    <PackageCheck className="w-4 h-4" aria-hidden="true"/> Back to menu
                </Link>
                <Link href="/contact" className={SECONDARY_BTN}>Questions? Contact us</Link>
            </div>
        </>
    );
}

export default function SuccessPage() {
    return (
        <div className="mt-24 my-container mx-auto">
            <div className="container mx-auto px-4 pt-6 pb-16">
                <div className="main-block-color rounded-3xl px-4 py-10 sm:px-10 sm:py-14">
                    <Suspense fallback={<Skeleton className="mx-auto h-64 w-full max-w-2xl rounded-2xl"/>}>
                        <SuccessContent/>
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
