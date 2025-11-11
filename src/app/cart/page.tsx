"use client";

import {manrope, quicksand, raleway, sora} from "@/app/fonts";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useCart } from "@/app/context/CartContext";
import Link from "next/link";
import { FaRegTrashCan } from "react-icons/fa6";
import { useRouter } from "next/navigation";

const Cart = () => {
    const SHOP_COORDS = { lat: 51.518648926574, lng: -0.16809783068325745 };
    const { cart, removeFromCart, clearCart, updateQuantity } = useCart();
    const [customMessages, setCustomMessages] = useState<{ [key: string]: string }>({});
    const [showInput, setShowInput] = useState<{ [key: string]: boolean }>({});
    const [orderType, setOrderType] = useState<"delivery" | "collect">("delivery");
    const [addresses, setAddresses] = useState<string[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<string | "">("");
    const [deliveryFee, setDeliveryFee] = useState(0);
    const router = useRouter();

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const toggleCustomMessage = (key: string) => {
        setShowInput(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleInputChange = (key: string, value: string) => {
        setCustomMessages(prev => ({ ...prev, [key]: value }));
    };

    const getDistanceInMiles = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * (Math.PI / 180)) *
            Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distanceKm = R * c;
        return distanceKm * 0.621371;
    };

    const getCoordinatesFromAddress = async (address: string) => {
        try {
            const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(address)}&limit=1`);
            const data = await res.json();
            if (data.features && data.features.length > 0) {
                const [lon, lat] = data.features[0].geometry.coordinates;
                return { lat, lon };
            }
        } catch (err) {
            console.error("Photon error:", err);
        }
        return null;
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        let mainAddr: string | null = null;
        let extraAddrs: string[] = [];

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/check/me`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then((data) => {
                if (data.address) mainAddr = data.address;
            })
            .catch(console.error);

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user-addresses`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then((data: { address: string }[]) => (extraAddrs = data.map(a => a.address)))
            .catch(console.error)
            .finally(() => {
                const allAddresses = mainAddr ? [mainAddr, ...extraAddrs] : extraAddrs;
                setAddresses(allAddresses);
                if (!selectedAddress && allAddresses.length > 0) setSelectedAddress(allAddresses[0]);
            });
    }, []);

    useEffect(() => {
        if (!selectedAddress) {
            setDeliveryFee(0);
            return;
        }

        (async () => {
            const coords = await getCoordinatesFromAddress(selectedAddress);
            if (coords) {
                const miles = getDistanceInMiles(SHOP_COORDS.lat, SHOP_COORDS.lng, coords.lat, coords.lon);
                const roadMiles = miles * 1.3;
                setDeliveryFee(Math.round(roadMiles * 2 * 100) / 100);
            }
        })();
    }, [selectedAddress]);

    const customMessageCount = Object.values(showInput).filter(Boolean).length;
    const customMessageFee = customMessageCount * 10;
    const grandTotal = total + (orderType === "delivery" ? deliveryFee : 0) + customMessageFee;

    const handleCheckout = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/create-checkout-session`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    cart: cart.map(item => ({
                        ...item,
                        image: item.main_image.startsWith("http")
                            ? item.main_image
                            : `${process.env.NEXT_PUBLIC_API_URL}${item.main_image}`, // делаем абсолютный URL
                    })),
                    deliveryFee,
                    customMessageFee,
                    orderType,
                    selectedAddress,
                    total: grandTotal,
                }),
            });

            const data = await res.json();
            if (data.url) window.location.href = data.url;
            else console.error("Stripe session creation failed:", data);
        } catch (err) {
            console.error(err);
            router.push("/login");
        }
    };

    if (cart.length === 0) {
        return (
            <div className="mt-[64px]">
                <div className="container mx-auto px-4">
                    <div className="py-20">
                        <div
                            className="mt-4 flex flex-col items-center justify-center h-50 lg:h-60"
                            style={{
                                backgroundImage: "url('/images/shopping-cart.svg')",
                                backgroundSize: "contain",
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "bottom",
                            }}
                        >
                            <h6
                                className={`${sora.className} pt-6 text-center text-xl mb-3 sm:text-xl lg:text-4xl xl:text-5xl font-semibold`}
                            >
                                Your Cart Is Empty!
                            </h6>

                            <div className="flex items-center py-4 md:justify-center w-64">
                                <Link href="/menu" className="border-2 border-[#833B45] text-center text-[#833B45] w-full rounded-full font-bold py-3 text-md md:text-lg md:w-72 cursor-pointer">
                                    Order Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-[64px] container mx-auto px-4 py-10">
            <div className="mb-6">
                <h2 className={`${raleway.className} text-2xl lg:text-4xl font-bold text-center`}>Your Cart</h2>
                <p className={`${manrope.className} text-sm md:text-md text-center text-[#833B45]`}>Here’s what you’ve
                    selected — sweet choices!</p>
                <p className={`${manrope.className} text-sm md:text-md text-center text-[#833B45]`}>Review your items
                    below before proceeding to checkout. You can update quantities or remove items as needed.</p>
            </div>

            <div className="flex justify-center">
                <div className="space-y-2 max-w-4xl w-full">
                    {cart.map((item, index) => {
                        const key = `${item.id}-${item.variantName}`;
                        return (
                            <div key={key} className="border-2 border-[#833B45] p-2 rounded-md space-y-2">
                                <div
                                    className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                                    <div className="flex space-x-4 w-full">
                                        <Image src={item.main_image} alt={item.product_name} width={180} height={80} className="rounded-md w-28 h-28" />
                                        <div className="flex flex-col justify-between min-h-full">
                                            <h3 className={`${raleway.className} font-semibold text-lg`}>{item.product_name}</h3>
                                            <p className={`${manrope.className} text-sm text-gray-500 italic`}>Size: {item.variantName}</p>
                                            <p className={`${sora.className} text-md font-bold`}>£{item.price}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center space-x-4 w-full md:w-fit">
                                        <div className="flex items-center border rounded-lg overflow-hidden">
                                            <button
                                                className="px-3 py-1 bg-[#E6BEBD] cursor-pointer"
                                                onClick={() => updateQuantity(item.id, item.variantName, Math.max(item.quantity - 1, 1))}
                                            >
                                                -
                                            </button>
                                            <p className="w-10 text-center">
                                                {item.quantity}</p>
                                            <button
                                                className="px-3 py-1 bg-[#E6BEBD] cursor-pointer"
                                                onClick={() => updateQuantity(item.id, item.variantName, item.quantity + 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <Button className="cursor-pointer" variant="destructive" onClick={() => removeFromCart(item.id, item.variantName)}>
                                            <FaRegTrashCan />
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex flex-col space-y-2">
                                    <div className="flex items-center">
                                        <input
                                            id={`custom-message-${index}`}
                                            type="checkbox"
                                            checked={!!showInput[key]}
                                            onChange={() => toggleCustomMessage(key)}
                                            className="h-5 w-5 appearance-none rounded border-2 border-[#833B45] checked:bg-[#833B45] checked:border-[#833B45] transition-all duration-200 cursor-pointer"
                                        />
                                        <label htmlFor={`custom-message-${index}`} className={`${manrope.className} ml-2 text-sm text-gray-900 cursor-pointer`}>
                                            Custom message
                                        </label>
                                    </div>
                                    {showInput[key] && (
                                        <input
                                            type="text"
                                            placeholder="Enter your message..."
                                            value={customMessages[key] || ""}
                                            onChange={e => handleInputChange(key, e.target.value)}
                                            className={`${manrope.className} border border-[#833B45] rounded-lg p-2 w-full outline-none focus:ring-1 focus:ring-[#833B45]`}
                                        />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex justify-center">
                <div className="max-w-4xl w-full">
                    <div className="mt-4 flex space-x-4">
                        <button
                            onClick={() => setOrderType("delivery")}
                            className={`${manrope.className} px-3 py-1 rounded-full border-2 transition-all cursor-pointer text-[#833B45] ${
                                orderType === "delivery"
                                    ? "bg-[#833B45] text-white border-[#833B45]"
                                    : "border-[#833B45] hover:text-white hover:bg-[#E6BEBD]"
                            }`}
                        >
                            Delivery
                        </button>
                        <button
                            onClick={() => setOrderType("collect")}
                            className={`${manrope.className} px-3 py-1 rounded-full border-2 transition-all cursor-pointer text-[#833B45] ${
                                orderType === "collect"
                                    ? "bg-[#833B45] text-white border-[#833B45]"
                                    : "border-[#833B45] hover:text-white hover:bg-[#E6BEBD]"
                            }`}
                        >
                            Collect order
                        </button>
                    </div>
                    {orderType === "delivery" && (
                        <div className="mt-2 flex flex-col items-start">
                            <label className={`${manrope.className} text-sm md:text-md font-semibold ml-1 mb-2`}>Choose delivery address:</label>
                            <select
                                value={selectedAddress}
                                onChange={(e) => setSelectedAddress(e.target.value)}
                                className={`${manrope.className} border-[#833B45] border-2 rounded-lg p-2 w-full max-w-md text-xs sm:text-sm cursor-pointer`}
                            >
                                {addresses.map((addr, i) => (
                                    <option key={i} value={addr}>
                                        {addr}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            </div>


            <div className="mt-10 flex flex-col items-end space-y-2">
                <p className={`${manrope.className} font-semibold lg:text-lg`}>Price: £{total}</p>
                {orderType === "delivery" && <p className={`${manrope.className} font-semibold lg:text-lg`}>Delivery: £{deliveryFee}</p>}
                {customMessageFee > 0 &&
                    <p className={`${manrope.className} font-semibold lg:text-lg`}>Custom messages: £{customMessageFee}</p>}
                <p className={`${manrope.className} text-md lg:text-2xl font-bold`}>Total: £{grandTotal.toFixed(2)}</p>
                <div className="flex space-x-4">
                    <Button className={`${manrope.className} border-2 border-[#833B45] text-[#833B45] cursor-pointer`} variant="outline" onClick={clearCart}>Clear Cart</Button>
                    <Button className={`${manrope.className} bg-[#833B45] text-white cursor-pointer hover:bg-[#833B45]`} onClick={handleCheckout}>Checkout</Button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
