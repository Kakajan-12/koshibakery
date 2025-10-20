"use client";

import { quicksand, sora } from "@/app/fonts";
import { Button } from "@/components/ui/button";
import React from "react";
import Image from "next/image";
import { useCart } from "@/app/context/CartContext";
import Link from "next/link";
import { FaRegTrashCan } from "react-icons/fa6";

const Cart = () => {
    const { cart, removeFromCart, clearCart, updateQuantity } = useCart();

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (cart.length === 0) {
        return (
            <div className="mt-[64px]">
                <div className="container mx-auto px-4">
                    <div className="py-20">
                        <div
                            className="mt-4 flex flex-col items-center justify-center h-50 lg:h-60"
                            style={{
                                backgroundImage: "url('/images/shopping-cart.svg')",
                                backgroundSize: "contain",
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "bottom",
                            }}
                        >
                            <h6
                                className={`${sora.className} pt-6 text-center text-xl mb-3 sm:text-xl lg:text-4xl xl:text-5xl font-semibold`}
                            >
                                Your Cart Is Empty!
                            </h6>

                            <div className="flex items-center py-4 md:justify-center w-64">
                                <Link href="/menu" className="border-2 border-green-800 bg-[#FDFBF8] text-center text-black w-full rounded-2xl font-bold py-3 text-md md:w-72 hover:bg-[#FDFBF8] cursor-pointer">
                                    Order Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-[64px]">
            <div className="container mx-auto px-4 py-10">
                <h2
                    className={`${sora.className} text-2xl lg:text-4xl font-bold mb-6 text-center`}
                >
                    Your Cart
                </h2>

                <div className="flex justify-center">
                    <div className="space-y-2 max-w-4xl w-full">
                        {cart.map((item) => (
                            <div
                                key={`${item.id}-${item.variantName}`}
                                className="flex flex-col md:flex-row items-center justify-between border-2 border-color p-2 rounded-md space-y-4 md:space-y-0"
                            >
                                <div className="flex space-x-4 w-full">
                                    <Image
                                        src={item.main_image}
                                        alt={item.product_name}
                                        width={180}
                                        height={80}
                                        className="rounded-md w-28 h-28"
                                    />
                                    <div className="flex flex-col justify-between min-h-full">
                                        <h3 className={`${quicksand.className} font-semibold text-lg`}>
                                            {item.product_name}
                                        </h3>
                                        <p className="text-md font-bold">£{item.price}</p>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center space-x-4 w-full md:w-fit">
                                    <div className="flex items-center border rounded-lg overflow-hidden">
                                        <button
                                            className="px-3 py-1 bg-green-200"
                                            onClick={() => updateQuantity(item.id, item.variantName, Math.max(item.quantity - 1, 1))}
                                        >
                                            -
                                        </button>
                                        <span className="px-4">{item.quantity}</span>
                                        <button
                                            className="px-3 py-1 bg-green-200"
                                            onClick={() => updateQuantity(item.id, item.variantName, item.quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <Button
                                        variant="destructive"
                                        onClick={() => removeFromCart(item.id, item.variantName)}
                                    >
                                        <FaRegTrashCan />
                                    </Button>

                                </div>
                            </div>
                        ))}
                    </div>

                </div>

                <div className="mt-10 flex flex-col items-end space-y-4">
                    <p className="text-xl font-bold">Total: £{total.toFixed(2)}</p>
                    <div className="flex space-x-4">
                        <Button variant="outline" onClick={clearCart}>
                            Clear Cart
                        </Button>
                        <Button className="bg-green-700 text-white">Checkout</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
