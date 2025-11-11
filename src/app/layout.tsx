import type {Metadata} from "next";
import "./globals.css";
import {Toaster} from "@/components/ui/sonner"
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {CategoryProvider} from "@/app/context/CategoryContext";
import {CartProvider} from "@/app/context/CartContext";
import {raleway} from "@/app/fonts";

export const metadata: Metadata = {
    title: {
        default: "Koshi Bakery",
        template: "%s | Koshi Bakery",
    },
    description: "Fresh pastries, breads, and desserts from Koshi Bakery.",
    icons: {
        icon: [
            {url: "/icon.svg", type: "image/svg+xml"},
        ],
    },
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className={`${raleway.className} bg-[#FDFBF8] text-gray-900`}>
        <CategoryProvider>
            <CartProvider>
                <Header />
                {children}
                <Footer />
            </CartProvider>
        </CategoryProvider>
        <Toaster richColors position="top-right" />
        </body>
        </html>
    );
}

