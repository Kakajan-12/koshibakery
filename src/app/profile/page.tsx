"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
            <div className="py-20">
                <h2 className="text-2xl font-bold mb-4">Profile</h2>

                {/* ---------- Вкладки ---------- */}
                <div className="flex flex-col space-y-2 mb-6">
                    <button
                        onClick={() => setActiveTab("info")}
                        className={`rounded-4xl text-sm px-2 py-2 border ${
                            activeTab === "info"
                                ? "bg-[#264D30] text-white border-[#264D30]"
                                : "border-[#264D30] text-[#264D30]"
                        }`}
                    >
                        Personal Information
                    </button>

                    <button
                        onClick={() => setActiveTab("orders")}
                        className={`rounded-4xl text-sm px-2 py-2 border ${
                            activeTab === "orders"
                                ? "bg-[#264D30] text-white border-[#264D30]"
                                : "border-[#264D30] text-[#264D30]"
                        }`}
                    >
                        Order History
                    </button>
                </div>

                {/* ---------- Контент вкладок ---------- */}
                {activeTab === "info" && (
                    <div className="space-y-2 animate-fadeIn">
                        <p><strong>Name:</strong> {user?.fname} {user?.lname}</p>
                        <p><strong>Email:</strong> {user?.email}</p>
                        <p><strong>Phone:</strong> {user?.phone}</p>
                        <p><strong>Address:</strong> {user?.address}</p>
                        <button className="border border-[#264D30] rounded-4xl text-sm text-[#264D30] px-2 py-2 w-full">
                            Add address
                        </button>
                    </div>
                )}

                {activeTab === "orders" && (
                    <div className="space-y-2 animate-fadeIn">
                        <div className="rounded-lg shadow-md py-2 px-4 space-y-3">
                            <div className="flex justify-between items-center">
                                <div className="bg-[#264D30] text-white rounded-2xl text-xs py-2 px-3">Completed</div>
                                <div className="text-sm">13.09.2025</div>
                            </div>

                            {[1, 2].map((i) => (
                                <div key={i} className="flex flex-col space-y-2">
                                    <Image
                                        src="/images/about.jpg"
                                        alt="cart"
                                        width={300}
                                        height={200}
                                        className="border p-1 rounded-lg max-h-44 object-cover"
                                    />
                                    <div className="flex justify-between">
                                        <div className="space-y-1">
                                            <p className="text-sm">Chocolate Ganache</p>
                                            <p className="text-xs text-gray-400">[x1]</p>
                                        </div>
                                        <div className="text-sm">£24.00</div>
                                    </div>
                                </div>
                            ))}

                            <div className="space-y-1">
                                <div className="flex justify-between items-center">
                                    <p className="font-bold text-sm">Delivery</p>
                                    <p className="text-xs">Delivery within the city</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="font-bold text-sm">Total payment:</p>
                                    <p className="text-xs font-bold">£68.00</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
