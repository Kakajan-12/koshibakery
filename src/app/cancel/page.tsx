"use client";

import Link from "next/link";
import {ArrowLeft, CreditCard, Mail, RotateCcw, ShoppingBag, Smartphone, XCircle} from "lucide-react";
import {manrope, raleway} from "@/app/fonts";
import {formatPrice} from "@/lib/price";
import {useCart} from "@/app/context/CartContext";
import {Skeleton} from "@/components/ui/skeleton";
import OrderItemThumb from "@/components/OrderItemThumb";

const PRIMARY_BTN = `${manrope.className} inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full main-button-color text-white text-[15px] font-semibold shadow-sm transition hover:brightness-110`;
const SECONDARY_BTN = `${manrope.className} inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-white text-[#B8485B] text-[15px] font-semibold ring-1 ring-[#B8485B]/30 transition hover:ring-[#B8485B]`;

// Частые причины, почему оплата не прошла, — чтобы покупатель понял, что делать дальше
const TIPS = [
    {icon: CreditCard, title: "Card declined?", text: "Check the card details or try another card."},
    {icon: Smartphone, title: "Bank confirmation", text: "Some banks ask you to approve the payment in their app."},
    {icon: RotateCcw, title: "Changed your mind?", text: "No problem — your cart is saved for when you're ready."},
];

export default function CancelPage() {
    const {cart, ready} = useCart();
    const itemCount = cart.reduce((n, i) => n + i.quantity, 0);
    const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

    return (
        <div className="mt-24 my-container mx-auto">
            <div className="container mx-auto px-4 pt-6 pb-16">
                <div className="main-block-color rounded-3xl px-4 py-10 sm:px-10 sm:py-14">
                    {/* Заголовок */}
                    <div className="flex flex-col items-center text-center">
                        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#FFF1DE] text-[#9A5B13] shadow-sm">
                            <XCircle className="h-10 w-10" aria-hidden="true"/>
                        </span>
                        <p className={`${manrope.className} mt-6 text-xs uppercase tracking-[0.18em] text-[#B8485B]`}>Checkout cancelled</p>
                        <h1 className={`${raleway.className} mt-2 text-3xl sm:text-4xl font-bold text-[#12100F]`}>Your payment wasn&apos;t completed</h1>
                        <p className={`${manrope.className} mt-3 max-w-md text-[#6F5E53]`}>
                            Don&apos;t worry — no money has been taken.
                            {cart.length > 0 ? " Your cart is saved, so you can pick up right where you left off." : ""}
                        </p>
                    </div>

                    {/* Сохранённая корзина */}
                    {!ready ? (
                        <Skeleton className="mx-auto mt-10 h-40 w-full max-w-2xl rounded-2xl"/>
                    ) : cart.length > 0 ? (
                        <section className="mx-auto mt-10 max-w-2xl rounded-2xl bg-white p-5 sm:p-6 shadow-sm ring-1 ring-[#B8485B]/10" aria-labelledby="saved-cart">
                            <div className="flex items-center justify-between gap-3">
                                <h2 id="saved-cart" className={`${raleway.className} text-lg font-bold text-[#12100F]`}>Still in your cart</h2>
                                <span className={`${manrope.className} text-sm text-[#6F5E53]`}>{itemCount} {itemCount === 1 ? "item" : "items"}</span>
                            </div>
                            <ul className="mt-4 divide-y divide-[#F0E6E3]">
                                {cart.slice(0, 3).map((item) => (
                                    <li key={`${item.id}-${item.variantName}`} className="flex items-center gap-4 py-3">
                                        <OrderItemThumb src={item.main_image}/>
                                        <div className="min-w-0 flex-1">
                                            <p className={`${manrope.className} font-semibold text-[#12100F] truncate`}>{item.product_name}</p>
                                            <p className={`${manrope.className} text-xs text-[#6F5E53]`}>
                                                {[item.variantName, `× ${item.quantity}`].filter(Boolean).join(" · ")}
                                            </p>
                                        </div>
                                        <p className={`${manrope.className} text-sm font-semibold text-[#12100F] tabular-nums`}>£{formatPrice(item.price * item.quantity)}</p>
                                    </li>
                                ))}
                            </ul>
                            {cart.length > 3 && (
                                <p className={`${manrope.className} text-sm text-[#6F5E53]`}>
                                    and {cart.length - 3} more {cart.length - 3 === 1 ? "item" : "items"}
                                </p>
                            )}
                            <div className={`${manrope.className} mt-3 flex justify-between border-t border-[#F0E6E3] pt-4 font-bold text-[#12100F]`}>
                                <span>Subtotal</span>
                                <span className="tabular-nums">£{formatPrice(subtotal)}</span>
                            </div>
                            <p className={`${manrope.className} mt-1 text-xs text-[#6F5E53]`}>Delivery and cake messages are added at checkout.</p>
                        </section>
                    ) : null}

                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                        {ready && cart.length > 0 ? (
                            <>
                                <Link href="/cart" className={PRIMARY_BTN}><RotateCcw className="w-4 h-4" aria-hidden="true"/> Return to cart and try again</Link>
                                <Link href="/menu" className={SECONDARY_BTN}><ArrowLeft className="w-4 h-4" aria-hidden="true"/> Keep shopping</Link>
                            </>
                        ) : (
                            <Link href="/menu" className={PRIMARY_BTN}><ShoppingBag className="w-4 h-4" aria-hidden="true"/> Browse the menu</Link>
                        )}
                    </div>

                    {/* Подсказки */}
                    <section className="mx-auto mt-12 max-w-2xl" aria-labelledby="payment-help">
                        <h2 id="payment-help" className={`${raleway.className} text-center text-lg font-bold text-[#12100F]`}>Having trouble paying?</h2>
                        <ul className="mt-5 grid gap-4 sm:grid-cols-3">
                            {TIPS.map(({icon: Icon, title, text}) => (
                                <li key={title} className="rounded-2xl bg-white/70 p-5 ring-1 ring-[#B8485B]/10">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#B8485B]/10 text-[#B8485B]">
                                        <Icon className="w-5 h-5" aria-hidden="true"/>
                                    </span>
                                    <p className={`${manrope.className} mt-3 font-semibold text-[#12100F]`}>{title}</p>
                                    <p className={`${manrope.className} mt-1 text-sm leading-relaxed text-[#6F5E53]`}>{text}</p>
                                </li>
                            ))}
                        </ul>
                        <p className={`${manrope.className} mt-6 text-center text-sm text-[#6F5E53]`}>
                            Still stuck?{" "}
                            <Link href="/contact" className="inline-flex items-center gap-1 font-semibold text-[#B8485B] link-underline">
                                <Mail className="w-3.5 h-3.5" aria-hidden="true"/> Contact us
                            </Link>{" "}
                            and we&apos;ll help you place your order.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
