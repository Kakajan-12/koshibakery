"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {manrope, sora} from "@/app/fonts";

export default function CancelPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
            <h1 className={`${manrope.className} text-3xl lg:text-5xl font-bold text-red-600 mb-6`}>
                Payment Cancelled
            </h1>
            <p className={`${manrope.className} text-lg text-gray-700 mb-8`}>
                Your payment was not completed. You can try again or return to your cart.
            </p>
            <div className="flex space-x-4">
                <Link href="/cart">
                    <Button className={`${manrope.className} bg-white hover:bg-white main-text-color border-2 main-border-color px-6 py-3 rounded-full cursor-pointer`}>
                        Back to Cart
                    </Button>
                </Link>
                <Link href="/menu">
                    <Button className={`${manrope.className} main-button-color text-white px-6 py-3 rounded-full hover:bg-[#833B45] cursor-pointer`}>
                        Back to Menu
                    </Button>
                </Link>
            </div>
        </div>
    );
}
