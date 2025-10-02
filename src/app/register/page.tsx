"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
    const [fname, setfName] = useState("");
    const [lname, setlName] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState(""); // <-- сообщение для модалки
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fname, lname, address, phone, email, password }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Registration failed");

            setMessage("✅ Account created! Check your email to verify your account.");
            setShowModal(true); // показываем модалку
        } catch (err: any) {
            setMessage(err.message || "Something went wrong");
            setShowModal(true);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <form onSubmit={handleRegister} className="w-full max-w-sm space-y-4 p-6 border rounded-lg bg-white shadow-md relative">
                <h1 className="text-2xl font-bold text-center">Register</h1>
                <Input type="text" placeholder="First name" value={fname} onChange={(e) => setfName(e.target.value)} required />
                <Input type="text" placeholder="Last name" value={lname} onChange={(e) => setlName(e.target.value)} required />
                <Input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
                <Input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <Button type="submit" className="w-full">Register</Button>
                <p className="text-sm text-gray-500 text-center">
                    Already have an account?{" "}
                    <span onClick={() => router.push("/login")} className="text-blue-600 cursor-pointer">Login</span>
                </p>

                {/* Модальное окно */}
                {showModal && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs text-center">
                            <p>{message}</p>
                            <Button onClick={() => {
                                setShowModal(false);
                                if (message.includes("Account created")) router.push("/login");
                            }} className="mt-4 w-full">OK</Button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}
