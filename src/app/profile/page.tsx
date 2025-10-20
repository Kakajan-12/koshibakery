"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

const Profile = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"info" | "orders">("info"); // 👈 новое состояние
    const router = useRouter();

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

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

    return (
        <div className="container mx-auto px-4">
            <div className="py-20 lg:py-40">
                <h2 className="text-2xl lg:text-4xl font-bold mb-4">Profile</h2>

                <div className="flex flex-col lg:flex-row">
                    <div className="flex flex-col sm:flex-row lg:flex-col space-y-2 sm:space-y-0 lg:space-y-2 sm:space-x-2 lg:space-x-0 mb-6 lg:w-1/3">
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
                            <p className="text-sm lg:text-lg"><span className="font-bold">Name:</span> {user?.fname} {user?.lname}</p>
                            <p className="text-sm lg:text-lg"><span className="font-bold">Email:</span> {user?.email}</p>
                            <p className="text-sm lg:text-lg"><span className="font-bold">Phone:</span> {user?.phone}</p>
                            <p className="text-sm lg:text-lg"><span className="font-bold">Address:</span> {user?.address}</p>
                            <div className="flex justify-center">
                                <button
                                    className="border border-[#264D30] rounded-4xl text-sm text-[#264D30] px-2 py-2 w-full max-w-56">
                                    Add address
                                </button>
                            </div>

                        </div>
                    )}

                    {activeTab === "orders" && (
                        <div className="space-y-2 animate-fadeIn w-full bg-white">
                            <div className="rounded-lg shadow-md py-2 px-4 space-y-3 sm:space-y-0 ">
                                <div
                                    className="sm:flex sm:space-x-4 sm:justify-between">
                                    <div
                                        className="flex justify-between items-center sm:flex-col sm:justify-start sm:space-y-2">
                                        <div
                                            className="bg-[#264D30] text-white rounded-2xl text-xs py-2 px-3">Completed
                                        </div>
                                        <div className="text-sm">13.09.2025</div>
                                    </div>
                                    <div className="space-y-2 w-full">
                                        <p className={`${quicksand} hidden sm:block font-bold text-lg`}>List of
                                            products</p>
                                        {[1, 2].map((i) => (
                                            <div key={i} className="flex flex-col sm:flex-row space-y-2  sm:space-x-2">
                                                <Image
                                                    src="/images/about.jpg"
                                                    alt="cart"
                                                    width={300}
                                                    height={200}
                                                    className="border p-1 rounded-lg w-full sm:max-w-22 object-cover"
                                                />
                                                <div className="flex justify-between w-full">
                                                    <div className="space-y-1">
                                                        <p className="text-sm sm:text-md md:text-lg">Chocolate Ganache</p>
                                                        <p className="text-xs text-gray-400">[x1]</p>
                                                    </div>
                                                    <div className="text-sm sm:text-md">£24.00</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-1 sm:pt-8 min-w-36 md:min-w-56">
                                    <div
                                        className="flex justify-start items-center space-x-2">
                                        <p className="font-bold text-sm sm:text-md md:text-lg">Delivery</p>
                                        <p className="text-xs sm:text-sm md:text-md">Delivery within the city</p>
                                    </div>
                                    <div
                                        className="flex justify-start items-center space-x-2">
                                        <p className="font-bold text-sm sm:text-md md:text-lg">Total payment:</p>
                                        <p className="text-xs font-bold sm:text-sm md:text-lg">£68.00</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}
                </div>


            </div>
        </div>
    );
};

export default Profile;
