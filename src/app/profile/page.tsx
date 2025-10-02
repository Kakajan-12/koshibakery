"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login"); // 🔥 если нет токена → сразу на login
            return;
        }

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/check/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (res.status === 401) {
                    localStorage.removeItem("token"); // токен недействителен → очищаем
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
        <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-md bg-white">
            <h1 className="text-2xl font-bold mb-4">Profile</h1>
            <p><strong>Name:</strong> {user?.fname} {user?.lname}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Phone:</strong> {user?.phone}</p>
            <p><strong>Address:</strong> {user?.address}</p>
        </div>
    );
};

export default Profile;
