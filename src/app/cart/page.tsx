"use client";

import {quicksand, sora} from "@/app/fonts";
import {Button} from "@/components/ui/button";
import React, {useEffect, useState} from "react";
import Image from "next/image";
import {useCart} from "@/app/context/CartContext";
import Link from "next/link";
import {FaRegTrashCan} from "react-icons/fa6";

interface Address {
    id: number;
    address: string;
    latitude: number;
    longitude: number;
}


const Cart = () => {
    const SHOP_COORDS = { lat: 51.518648926574, lng: -0.16809783068325745 };
    const {cart, removeFromCart, clearCart, updateQuantity} = useCart();
    const [customMessages, setCustomMessages] = useState<{ [key: string]: string }>({});
    const [showInput, setShowInput] = useState<{ [key: string]: boolean }>({});
    const [orderType, setOrderType] = useState<"delivery" | "collect">("delivery");
    const [addresses, setAddresses] = useState<string[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<string | "">(""); // выбранный адрес
    const [deliveryFee, setDeliveryFee] = useState(0);


    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const toggleCustomMessage = (key: string) => {
        setShowInput((prev) => ({...prev, [key]: !prev[key]}));
    };

    const handleInputChange = (key: string, value: string) => {
        setCustomMessages((prev) => ({...prev, [key]: value}));
    };

    const getDistanceInMiles = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // радиус Земли в км
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * (Math.PI / 180)) *
            Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distanceKm = R * c;
        return distanceKm * 0.621371; // в милях
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

        // Главный адрес
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/check/me`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then((data) => {
                if (data.address) mainAddr = data.address;
            })
            .catch(err => console.error(err));

        // Дополнительные адреса
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user-addresses`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then((data: { address: string }[]) => extraAddrs = data.map(a => a.address))
            .catch(err => console.error(err))
            .finally(() => {
                // Объединяем адреса в один массив
                const allAddresses = mainAddr ? [mainAddr, ...extraAddrs] : extraAddrs;
                setAddresses(allAddresses);

                // Если ещё не выбран адрес — ставим первый
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
                const roadMiles = miles * 1.3; // коэффициент, чтобы учесть дороги
                setDeliveryFee(Math.round(roadMiles * 2 * 100) / 100); // £2 за милю
                console.log("Distance in miles (road approx.):", roadMiles);
            }
        })();
    }, [selectedAddress]);


    const grandTotal = total + (orderType === "delivery" ? deliveryFee : 0);

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
                                <Link
                                    href="/menu"
                                    className="border-2 border-green-800 bg-[#FDFBF8] text-center text-black w-full rounded-2xl font-bold py-3 text-md md:w-72 hover:bg-[#FDFBF8] cursor-pointer"
                                >
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
        <div className="mt-[64px]">
            <div className="container mx-auto px-4 py-10">
                <h2
                    className={`${sora.className} text-2xl lg:text-4xl font-bold mb-6 text-center`}
                >
                    Your Cart
                </h2>

                <div className="flex justify-center">
                    <div className="space-y-2 max-w-4xl w-full">
                        {cart.map((item, index) => {
                            const key = `${item.id}-${item.variantName}`;
                            return (
                                <div
                                    key={key}
                                    className="border-2 border-color p-2 rounded-md space-y-2"
                                >
                                    <div
                                        className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                                        <div className="flex space-x-4 w-full">
                                            <Image
                                                src={item.main_image}
                                                alt={item.product_name}
                                                width={180}
                                                height={80}
                                                className="rounded-md w-28 h-28"
                                            />
                                            <div className="flex flex-col justify-between min-h-full">
                                                <h3 className={`${quicksand.className} font-semibold text-lg`}>
                                                    {item.product_name}
                                                </h3>
                                                <p className="text-sm text-gray-500 italic">
                                                    Size: {item.variantName}
                                                </p>
                                                <p className="text-md font-bold">£{item.price}</p>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center space-x-4 w-full md:w-fit">
                                            <div className="flex items-center border rounded-lg overflow-hidden">
                                                <button
                                                    className="px-3 py-1 bg-green-200"
                                                    onClick={() =>
                                                        updateQuantity(item.id, item.variantName, Math.max(item.quantity - 1, 1))
                                                    }
                                                >
                                                    -
                                                </button>
                                                <span className="px-4">{item.quantity}</span>
                                                <button
                                                    className="px-3 py-1 bg-green-200"
                                                    onClick={() =>
                                                        updateQuantity(item.id, item.variantName, item.quantity + 1)
                                                    }
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <Button
                                                variant="destructive"
                                                onClick={() => removeFromCart(item.id, item.variantName)}
                                            >
                                                <FaRegTrashCan/>
                                            </Button>
                                        </div>
                                    </div>

                                    {/* ✅ чекбокс + поле ввода */}
                                    <div className="flex flex-col space-y-2">
                                        <div className="flex items-center">
                                            <input
                                                id={`custom-message-${index}`}
                                                type="checkbox"
                                                checked={!!showInput[key]}
                                                onChange={() => toggleCustomMessage(key)}
                                                className="h-5 w-5 appearance-none rounded border-2 border-green-700 checked:bg-green-700 checked:border-green-700 transition-all duration-200 cursor-pointer"
                                            />
                                            <label
                                                htmlFor={`custom-message-${index}`}
                                                className="ml-2 text-sm text-gray-900 cursor-pointer"
                                            >
                                                Custom message
                                            </label>
                                        </div>

                                        {showInput[key] && (
                                            <input
                                                type="text"
                                                placeholder="Enter your message..."
                                                value={customMessages[key] || ""}
                                                onChange={(e) =>
                                                    handleInputChange(key, e.target.value)
                                                }
                                                className="border border-green-700 rounded-lg p-2 w-full outline-none focus:ring-2 focus:ring-green-500"
                                            />
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex justify-center pt-6">
                    <div className="max-w-4xl w-full">
                        <div className="flex items-center space-x-4 justify-start">
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="delivery"
                                    name="order-type"
                                    checked={orderType === "delivery"}
                                    onChange={() => setOrderType("delivery")}
                                    className="h-5 w-5 appearance-none rounded-full border-2 border-green-700 checked:bg-green-700 checked:border-green-700 transition-all duration-200 cursor-pointer"
                                />
                                <label
                                    htmlFor="delivery"
                                    className="ml-2 text-sm lg:text-lg text-gray-900 cursor-pointer"
                                >
                                    Delivery
                                </label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="collect"
                                    name="order-type"
                                    checked={orderType === "collect"}
                                    onChange={() => setOrderType("collect")}
                                    className="h-5 w-5 appearance-none rounded-full border-2 border-green-700 checked:bg-green-700 checked:border-green-700 transition-all duration-200 cursor-pointer"
                                />
                                <label
                                    htmlFor="collect"
                                    className="ml-2 text-sm lg:text-lg text-gray-900 cursor-pointer"
                                >
                                    Collect order
                                </label>
                            </div>
                        </div>
                        <div className="mt-4">
                            {orderType === "delivery" && (
                                <>
                                    <p className="text-sm lg:text-lg text-gray-700 mb-2">Select delivery address:</p>
                                    <select
                                        value={selectedAddress}
                                        onChange={(e) => setSelectedAddress(e.target.value)}
                                        className="border border-green-700 rounded-lg p-2 w-full"
                                    >
                                        <option value="" disabled>Select address</option>
                                        {addresses.map((addr, i) => (
                                            <option key={i} value={addr}>{addr}</option>
                                        ))}
                                    </select>
                                </>
                            )}
                        </div>
                    </div>
                </div>


                <div className="mt-10 flex flex-col items-end space-y-4">
                    <p className="text-md lg:text-xl font-bold">
                        Total:
                        £{grandTotal.toFixed(2)} {orderType === "delivery" && `(including £${deliveryFee} delivery)`}
                    </p>

                    <div className="flex space-x-4">
                        <Button variant="outline" onClick={clearCart}>
                            Clear Cart
                        </Button>
                        <Button className="bg-green-700 text-white">Checkout</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
