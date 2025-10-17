"use client";

import {useState, useEffect} from "react";
import Link from "next/link";
import Image from "next/image";
import {FiShoppingCart} from "react-icons/fi";
import { BsPerson } from "react-icons/bs";
import {Menu} from "lucide-react";
import { useCart } from "@/app/context/CartContext";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { cart } = useCart();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`w-full fixed top-0 z-50 transition-all duration-300 transition-shadow transition-colors ${
                scrolled ? "bg-white shadow-md" : "bg-transparent shadow-none"
            }`}
        >
            <div
                className="container mx-auto px-4 py-2 flex items-center justify-between border-b border-black md:border-none">
                <Link
                    href="/"
                    className="flex items-center gap-2 font-bold text-gray-900"
                >
                    <Image src="/icon.svg" alt="Logo" width={50} height={50}
                           className="w-20 lg:w-30"/>
                </Link>

                <nav className="hidden md:flex space-x-6">
                    <Link href="/">Home</Link>
                    <Link href="/menu">Menu</Link>
                    <Link href="/about">About Us</Link>
                    <Link href="/contact">Contact Us</Link>
                </nav>

                <div className="flex items-center gap-4">
                    <Link href="/profile"><BsPerson className="w-8 h-8 cursor-pointer"/></Link>
                    <Link href="/cart" className="relative">
                        <FiShoppingCart className="w-6 h-6 cursor-pointer"/>
                        {cart.length > 0 && (
                            <span
                                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
            {cart.length}
          </span>
                        )}
                    </Link>
                    <button
                        className="md:hidden"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <Menu className="w-6 h-6"/>
                    </button>
                </div>
            </div>

            {menuOpen && (
                <div className="md:hidden bg-white shadow-md border-t">
                    <nav className="flex flex-col p-4 space-y-4">
                        <Link href="/" onClick={() => setMenuOpen(false)}>
                            Home
                        </Link>
                        <Link href="/menu" onClick={() => setMenuOpen(false)}>
                            Menu
                        </Link>
                        <Link href="/about" onClick={() => setMenuOpen(false)}>
                            About Us
                        </Link>
                        <Link href="/contact" onClick={() => setMenuOpen(false)}>
                            Contact Us
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}
