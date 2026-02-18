"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface CartItem {
    id: number;
    product_name: string;
    price: number;
    main_image: string;
    quantity: number;
    variantName: string;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: Omit<CartItem, "quantity">) => void;
    updateQuantity: (id: number, variantName: string, quantity: number) => void;
    removeFromCart: (id: number, variantName: string) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("cart");
        if (stored) {
            setCart(JSON.parse(stored));
        }
        setInitialized(true);
    }, []);

    useEffect(() => {
        if (initialized) {
            localStorage.setItem("cart", JSON.stringify(cart));
        }
    }, [cart, initialized]);


    const addToCart = (item: Omit<CartItem, "quantity">) => {
        setCart((prev) => {
            const existingIndex = prev.findIndex(
                (p) => p.id === item.id && p.variantName === item.variantName
            );

            if (existingIndex !== -1) {
                const updated = [...prev];
                updated[existingIndex].quantity += 1;
                return updated;
            }

            return [...prev, { ...item, quantity: 1 }];
        });
    };


    const updateQuantity = (id: number, variantName: string, quantity: number) => {
        setCart((prev) =>
            prev.map((item) =>
                item.id === id && item.variantName === variantName
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const removeFromCart = (id: number, variantName?: string) => {
        setCart((prev) =>
            prev.filter(
                (item) =>
                    !(item.id === id && item.variantName === (variantName ?? item.variantName))
            )
        );
    };


    const clearCart = () => setCart([]);

    return (
        <CartContext.Provider
            value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used inside CartProvider");
    return ctx;
};
