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
        default: "Koşi Bakery",
        template: "%s | Koşi Bakery",
    },
    description: "Fresh pastries, breads, and desserts from Koşi Bakery.",
    icons: {
        icon: [
            { url: "/favicon.ico" },
            { url: "/icon.svg", type: "image/svg+xml" },
        ],
        apple: [
            { url: "/logo.png" },
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
        <body className={`${raleway.className} main-background-color`}>
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

