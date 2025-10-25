"use client";

import {useEffect, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import Image from "next/image";
import {quicksand} from "@/app/fonts";

interface User {
    id: number;
    fname: string;
    lname: string;
    email: string;
    phone: string;
    address: string;
}

interface ExtraAddress {
    id: number;
    address: string;
}

const Profile = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"info" | "orders">("info");
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [newAddress, setNewAddress] = useState("");
    const [extraAddresses, setExtraAddresses] = useState<ExtraAddress[]>([]);
    const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
    const [isSelectingAddress, setIsSelectingAddress] = useState(false);
    const [selectedFeature, setSelectedFeature] = useState<any | null>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [housenumber, setHouseNumber] = useState("");
    const houseInputRef = useRef<HTMLInputElement | null>(null);
    const [houseNumberInputVisible, setHouseNumberInputVisible] = useState(false);
    const router = useRouter();
    const isSelectingRef = useRef(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/check/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (res.status === 401) {
                    localStorage.removeItem("token");
                    router.push("/login");
                }
                return res.json();
            })
            .then((data) => {
                if (data) setUser(data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
                router.push("/profile");
            });
    }, [router]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user-addresses`, {
            headers: {Authorization: `Bearer ${token}`},
        })
            .then((res) => res.json())
            .then((data) => setExtraAddresses(data))
            .catch((err) => console.error("Failed to load addresses:", err));
    }, []);

    useEffect(() => {
        if (isSelectingRef.current) return;
        if (!isAddingAddress || isSelectingAddress) return;
        if (newAddress.length < 3) {
            setAddressSuggestions([]);
            return;
        }

        const fetchSuggestions = async () => {
            try {
                const res = await fetch(
                    `https://photon.komoot.io/api/?q=${encodeURIComponent(newAddress + ", London")}&bbox=-0.5103,51.2868,0.3340,51.6919&limit=5&lang=en`
                );
                const data = await res.json();
                if (!data.features) return;

                // Оставляем уникальные по адресу
                const unique = Array.from(
                    new Map(
                        data.features.map((f: any) => [
                            `${f.properties.housenumber}-${f.properties.street}-${f.properties.city || ""}`,
                            f
                        ])
                    ).values()
                );

                setAddressSuggestions(unique);
            } catch (err) {
                console.error(err);
            }
        };

        const timeout = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timeout);
    }, [newAddress, isAddingAddress, isSelectingAddress]);


    const handleSaveAddress = async () => {
        if (!newAddress.trim() || !selectedFeature) return; // добавляем проверку

        try {
            const token = localStorage.getItem("token");
            const p = selectedFeature.properties;
            const correctedAddress = [
                p.housenumber,
                p.street || p.name,
                p.city,
                p.postcode
            ].filter(Boolean).join(", ");

            const latitude = selectedFeature.geometry.coordinates[1];
            const longitude = selectedFeature.geometry.coordinates[0];

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user-addresses`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({address: correctedAddress, latitude, longitude}),
            });

            if (!res.ok) throw new Error("Failed to save address");

            const newAddr = await res.json();
            setExtraAddresses((prev) => [...prev, newAddr]);
            setIsAddingAddress(false);
            setNewAddress("");
            setSelectedFeature(null); // <- сброс после сохранения
        } catch (err) {
            console.error(err);
            alert("Failed to save address");
        }
    };

    useEffect(() => {
        if (activeTab !== "orders") return;
        const token = localStorage.getItem("token");
        if (!token) return;

        setOrdersLoading(true);
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/order`, {
            headers: {Authorization: `Bearer ${token}`},
        })
            .then((res) => res.json())
            .then((data) => setOrders(data))
            .catch((err) => console.error("Failed to load orders:", err))
            .finally(() => setOrdersLoading(false));
    }, [activeTab]);

    const handleDeleteAddress = async (id: number) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        if (!confirm("Are you sure you want to delete this address?")) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user-addresses/${id}`, {
                method: "DELETE",
                headers: {Authorization: `Bearer ${token}`},
            });

            if (!res.ok) throw new Error("Failed to delete address");
            setExtraAddresses((prev) => prev.filter((a) => a.id !== id));
        } catch (err) {
            console.error(err);
            alert("Failed to delete address");
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

    return (
        <div className="container mx-auto px-4">
            <div className="py-20 lg:py-40">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl lg:text-4xl font-bold">Profile</h2>
                    <button
                        onClick={() => {
                            localStorage.removeItem("token");
                            router.push("/login");
                        }}
                        className="bg-red-600 text-white px-4 py-1 rounded-4xl text-sm hover:bg-red-700 transition"
                    >
                        Logout
                    </button>
                </div>


                <div className="flex flex-col lg:flex-row">
                    <div
                        className="flex flex-col sm:flex-row lg:flex-col space-y-2 sm:space-y-0 lg:space-y-2 sm:space-x-2 lg:space-x-0 mb-6 lg:w-1/3">
                        <button
                            onClick={() => setActiveTab("info")}
                            className={`rounded-4xl text-sm px-2 py-2 border w-full lg:w-56 cursor-pointer ${
                                activeTab === "info"
                                    ? "bg-[#264D30] text-white border-[#264D30]"
                                    : "border-[#264D30] text-[#264D30]"
                            }`}
                        >
                            Personal Information
                        </button>

                        <button
                            onClick={() => setActiveTab("orders")}
                            className={`rounded-4xl text-sm px-2 py-2 border w-full lg:w-56 cursor-pointer ${
                                activeTab === "orders"
                                    ? "bg-[#264D30] text-white border-[#264D30]"
                                    : "border-[#264D30] text-[#264D30]"
                            }`}
                        >
                            Order History
                        </button>
                    </div>
                    {activeTab === "info" && (
                        <div className="space-y-2 lg:space-y-4 animate-fadeIn bg-white p-4 w-full">
                            <p className="text-sm lg:text-lg"><span
                                className="font-bold">Name:</span> {user?.fname} {user?.lname}</p>
                            <p className="text-sm lg:text-lg"><span className="font-bold">Email:</span> {user?.email}
                            </p>
                            <p className="text-sm lg:text-lg"><span className="font-bold">Phone:</span> {user?.phone}
                            </p>
                            <p className="text-sm lg:text-lg"><span
                                className="font-bold">Main address:</span> {user?.address}</p>
                            <div className="mt-4">
                                <p className="font-bold text-sm lg:text-lg mb-2">Additional addresses:</p>
                                {extraAddresses.length === 0 && (
                                    <p className="text-sm text-gray-500">No additional addresses yet.</p>
                                )}
                                {extraAddresses.map((addr) => (
                                    <div
                                        key={addr.id}
                                        className="flex justify-between items-center py-2 mb-2"
                                    >
                                        <p className="text-sm lg:text-lg">{addr.address}</p>
                                        <button
                                            onClick={() => handleDeleteAddress(addr.id)}
                                            className="text-white bg-red-600 text-sm cursor-pointer px-2 py-1 rounded-md"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-center mt-4">
                                {!isAddingAddress ? (
                                    <button
                                        onClick={() => setIsAddingAddress(true)}
                                        className="border border-[#264D30] rounded-4xl text-sm text-[#264D30] px-2 py-2 w-full max-w-56"
                                    >
                                        Add address
                                    </button>
                                ) : (
                                    <div className="relative flex flex-col items-center space-y-3 w-full">
                                        <input
                                            type="text"
                                            value={newAddress}
                                            onChange={(e) => {
                                                setNewAddress(e.target.value);
                                                setIsSelectingAddress(false);
                                                setHouseNumberInputVisible(false);
                                                setHouseNumber(""); // сброс house number при ручном вводе
                                            }}
                                            placeholder="Enter new address"
                                            className="border rounded-lg px-3 py-2 w-full"
                                        />

                                        {/* Автоподсказки */}
                                        {addressSuggestions.length > 0 && (
                                            <ul className="absolute z-10 w-full bg-white border rounded mt-1 max-h-48 overflow-auto top-10">
                                                {addressSuggestions.map((s, i) => {
                                                    const p = s.properties;
                                                    const full = [p.housenumber, p.street || p.name, p.city, p.postcode].filter(Boolean).join(", ");

                                                    return (
                                                        <li
                                                            key={i}
                                                            onClick={() => {
                                                                isSelectingRef.current = true;

                                                                setNewAddress([p.street || p.name, p.city, p.postcode].filter(Boolean).join(", "));
                                                                setSelectedFeature(s);
                                                                setIsSelectingAddress(true);
                                                                setAddressSuggestions([]);

                                                                setTimeout(() => {
                                                                    isSelectingRef.current = false;

                                                                    if (!p.housenumber) {
                                                                        setHouseNumberInputVisible(true);
                                                                        setTimeout(() => houseInputRef.current?.focus(), 50);
                                                                    } else {
                                                                        setHouseNumber(p.housenumber || "");
                                                                        setHouseNumberInputVisible(false);
                                                                    }
                                                                }, 100);
                                                            }}
                                                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                                        >
                                                            {full}
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        )}

                                        {/* Поле для house number, если нужно */}
                                        {houseNumberInputVisible && (
                                            <input
                                                ref={houseInputRef}
                                                type="text"
                                                value={housenumber}
                                                onChange={(e) => setHouseNumber(e.target.value)}
                                                placeholder="House / Flat number"
                                                className="border rounded-lg px-3 py-2 w-full mt-2"
                                                required
                                            />
                                        )}

                                        <div className="flex space-x-3">
                                            <button
                                                onClick={handleSaveAddress}
                                                className="bg-[#264D30] text-white rounded-4xl text-sm px-4 py-2"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setIsAddingAddress(false);
                                                    setNewAddress("");
                                                    setHouseNumber("");
                                                    setHouseNumberInputVisible(false);
                                                    setSelectedFeature(null);
                                                }}
                                                className="border border-[#264D30] text-[#264D30] rounded-4xl text-sm px-4 py-2"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>

                                )}
                            </div>

                        </div>
                    )}

                    {activeTab === "orders" && (
                        <div className="space-y-4 animate-fadeIn w-full">
                            {ordersLoading ? (
                                <p>Loading orders...</p>
                            ) : orders.length === 0 ? (
                                <p>No orders yet.</p>
                            ) : (
                                orders.map((order) => (
                                    <div key={order.id}
                                         className="rounded-lg shadow-xl py-2 px-4 space-y-3 sm:space-y-0 bg-white">
                                        <div
                                            className="sm:flex sm:space-x-4 sm:justify-between">
                                            <div
                                                className="flex justify-between items-start mb-2 sm:flex-col sm:justify-start sm:space-y-2">
                                                <div
                                                    className={`text-white rounded-2xl text-xs py-2 px-3 ${order.payment_status === "paid" ? "bg-[#264D30]" : "bg-yellow-500"}`}>{order.payment_status}
                                                </div>
                                                <div
                                                    className="text-sm">{new Date(order.created_at).toLocaleDateString()}</div>
                                            </div>
                                            <div className="space-y-2 w-full">
                                                <p className={`${quicksand} hidden sm:block font-bold text-lg`}>List of
                                                    products</p>
                                                {order.order_data.cart.map((item: any, i: number) => (
                                                    <div key={i}
                                                         className="flex flex-col sm:flex-row space-y-2  sm:space-x-2">
                                                        <Image
                                                            src={item.main_image}
                                                            alt="cart"
                                                            width={300}
                                                            height={200}
                                                            className="border p-1 rounded-lg w-full sm:max-w-22 object-cover"
                                                        />
                                                        <div className="flex justify-between w-full">
                                                            <div className="space-y-1">
                                                                <p className="text-sm sm:text-md md:text-lg">{item.product_name}</p>
                                                        <p className="text-xs text-gray-400">[x{item.quantity}]</p>
                                                    </div>
                                                    <div className="text-sm sm:text-md">£{item.price.toFixed(2)}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-1 sm:pt-8 min-w-36 md:min-w-56">
                                    <div
                                        className="flex justify-start items-center space-x-2">
                                        <p className="font-bold text-sm sm:text-md md:text-lg">Order type</p>
                                        <p className="text-xs sm:text-sm md:text-md">{order.order_data.orderType} {order.order_data.deliveryFee}</p>
                                    </div>
                                    <div
                                        className="flex justify-start items-center space-x-2">
                                        <p className="font-bold text-sm sm:text-md md:text-lg">Total payment:</p>
                                        <p className="text-xs font-bold sm:text-sm md:text-lg">£{Number(order.total).toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
