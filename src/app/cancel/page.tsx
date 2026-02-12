"use client";

import Link from "next/link";
import {Button} from "@/components/ui/button";
import {manrope} from "@/app/fonts";

export default function CancelPage() {
    return (
        <div className="py-56">
            <div className="container mx-auto px-4">
                <div
                    className="main-block-color w-full p-8 rounded-xl h-96 flex flex-col items-center justify-center flex-grow">
                    <h1 className={`${manrope.className} text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-red-600 text-center mb-6`}>
                        Payment Cancelled
                    </h1>
                    <p className={`${manrope.className} text-sm text-gray-700 text-center mb-8`}>
                        Your payment was not completed. You can try again or return to your cart.
                    </p>
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                        <Link href="/cart">
                            <Button
                                className={`${manrope.className} main-block-color hover:bg-white main-text-color border-2 main-border-color px-6 py-3 rounded-full cursor-pointer`}>
                                Back to Cart
                            </Button>
                        </Link>
                        <Link href="/menu">
                            <Button
                                className={`${manrope.className} main-button-color text-white px-6 py-3 rounded-full hover:bg-[#833B45] cursor-pointer`}>
                                Back to Menu
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
