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

// Столько же разрешает сервер (controllers/order/pricing.js)
export const MAX_QUANTITY = 100;

interface CartContextType {
    cart: CartItem[];
    // false, пока корзина не прочитана из localStorage — чтобы не мелькало «корзина пуста»
    ready: boolean;
    addToCart: (item: Omit<CartItem, "quantity">) => void;
    updateQuantity: (id: number, variantName: string, quantity: number) => void;
    removeFromCart: (id: number, variantName: string) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const clampQuantity = (q: number) => Math.min(Math.max(Math.round(q) || 1, 1), MAX_QUANTITY);

// Испорченные или устаревшие данные в localStorage не должны ломать сайт
function readStoredCart(): CartItem[] {
    try {
        const parsed = JSON.parse(localStorage.getItem("cart") || "[]");
        if (!Array.isArray(parsed)) return [];
        return parsed
            .filter((i) => i && typeof i.id === "number" && typeof i.product_name === "string")
            .map((i) => ({ ...i, price: Number(i.price) || 0, quantity: clampQuantity(Number(i.quantity)) }));
    } catch {
        return [];
    }
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        setCart(readStoredCart());
        setReady(true);
    }, []);

    useEffect(() => {
        if (!ready) return;
        try {
            localStorage.setItem("cart", JSON.stringify(cart));
        } catch {
            // Хранилище недоступно (приватный режим) — корзина живёт до перезагрузки
        }
    }, [cart, ready]);

    const addToCart = (item: Omit<CartItem, "quantity">) => {
        setCart((prev) => {
            const exists = prev.some((p) => p.id === item.id && p.variantName === item.variantName);
            // Новый объект, а не мутация: в StrictMode функция вызывается дважды и прибавляла бы 2
            if (exists) {
                return prev.map((p) =>
                    p.id === item.id && p.variantName === item.variantName
                        ? { ...p, quantity: clampQuantity(p.quantity + 1) }
                        : p
                );
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const updateQuantity = (id: number, variantName: string, quantity: number) => {
        setCart((prev) =>
            prev.map((item) =>
                item.id === id && item.variantName === variantName
                    ? { ...item, quantity: clampQuantity(quantity) }
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
            value={{ cart, ready, addToCart, updateQuantity, removeFromCart, clearCart }}
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
