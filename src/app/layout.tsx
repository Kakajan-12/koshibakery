import type {Metadata} from "next";
import "./globals.css";
import {Toaster} from "@/components/ui/sonner"
import Header from "@/components/Header";
import {sora} from "./fonts";
import Footer from "@/components/Footer";
import {CategoryProvider} from "@/app/context/CategoryContext";

export const metadata: Metadata = {
    title: "Koshi Bakery",
    description: "Koshi Bakery",
    icons: {
        icon: [
            {url: "/icon.svg", type: "image/svg+xml"},
        ],
    },
};


export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={`${sora.className} bg-[#FDFBF8] text-gray-900`}>
        <Header/>
        <CategoryProvider>
            {children}
        </CategoryProvider>
        <Toaster richColors position="top-right"/>
        <Footer/>
        </body>
        </html>
    );
}
