"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { sora } from "@/app/fonts";
import { useEffect, useRef } from "react";
import { useCart } from "@/app/context/CartContext";

if (typeof window !== "undefined") {
    localStorage.removeItem("cart");
}

export default function SuccessPage() {
    const { clearCart } = useCart();
    const cleared = useRef(false);

    useEffect(() => {
        if (!cleared.current) {
            clearCart();
            cleared.current = true;
        }
    }, [clearCart]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 text-center px-4">
            <h1 className={`${sora.className} text-3xl lg:text-5xl font-bold text-green-700 mb-6`}>Payment Successful!
            </h1>
            <p className="text-lg text-gray-700 mb-8">
                Thank you for your order. We’re processing it and will contact you soon.
            </p>
            <Link href="/menu">
                <Button className="bg-green-700 text-white px-6 py-3 rounded-2xl">
                    Back to Menu
                </Button>
            </Link>
        </div>
    );
}
