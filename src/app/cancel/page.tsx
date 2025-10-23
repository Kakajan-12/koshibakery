"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { sora } from "@/app/fonts";

export default function CancelPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-center px-4">
            <h1 className={`${sora.className} text-3xl lg:text-5xl font-bold text-red-600 mb-6`}>
                Payment Cancelled
            </h1>
            <p className="text-lg text-gray-700 mb-8">
                Your payment was not completed. You can try again or return to your cart.
            </p>
            <div className="flex space-x-4">
                <Link href="/cart">
                    <Button className="bg-red-600 text-white px-6 py-3 rounded-2xl">
                        Back to Cart
                    </Button>
                </Link>
                <Link href="/menu">
                    <Button variant="outline" className="border-red-600 text-red-600 px-6 py-3 rounded-2xl">
                        Back to Menu
                    </Button>
                </Link>
            </div>
        </div>
    );
}
