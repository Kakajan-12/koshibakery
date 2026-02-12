"use client";

import Link from "next/link";
import {Button} from "@/components/ui/button";
import {manrope} from "@/app/fonts";
import {useEffect, useRef} from "react";
import {useCart} from "@/app/context/CartContext";

if (typeof window !== "undefined") {
    localStorage.removeItem("cart");
}

export default function SuccessPage() {
    const {clearCart} = useCart();
    const cleared = useRef(false);

    useEffect(() => {
        if (!cleared.current) {
            clearCart();
            cleared.current = true;
        }
    }, [clearCart]);

    return (
        <div className="py-56">
            <div className="container mx-auto px-4">
                <div
                    className="main-block-color w-full p-8 rounded-xl h-96 flex flex-col items-center justify-center flex-grow">
                    <h1 className={`${manrope.className} text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-green-700 mb-6 main-text-color text-center`}>Payment
                        Successful!
                    </h1>
                    <p className={`${manrope.className} text-sm text-gray-700 text-center mb-8`}>
                        Thank you for your order. We’re processing it and will contact you soon.
                    </p>
                    <Link href="/menu">
                        <Button
                            className={`${manrope.className} main-button-color text-white px-6 py-3 rounded-full hover:bg-[#833B45] cursor-pointer`}>
                            Back to Menu
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
