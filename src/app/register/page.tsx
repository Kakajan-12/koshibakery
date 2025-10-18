"use client";

import { useState, useEffect } from "react";
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
    const [message, setMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const router = useRouter();

    // ======== AUTOCOMPLETE ========
    useEffect(() => {
        if (address.length < 3) {
            setSuggestions([]);
            return;
        }

        const fetchSuggestions = async () => {
            try {
                const res = await fetch(
                    `https://photon.komoot.io/api/?q=${encodeURIComponent(address + ", London")}&bbox=-0.5103,51.2868,0.3340,51.6919&limit=10`
                );
                const data = await res.json();

                if (!data.features) return;

                const unique = Array.from(
                    new Map(
                        data.features.map((f: any) => [
                            `${f.properties.name}-${f.properties.city || f.properties.state || ""}`,
                            f,
                        ])
                    ).values()
                ).slice(0, 5);

                setSuggestions(unique);
            } catch (err) {
                console.error(err);
            }
        };

        const timeout = setTimeout(fetchSuggestions, 400);
        return () => clearTimeout(timeout);
    }, [address]);

    // ======== REGISTER WITH ADDRESS VALIDATION ========
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // 1️⃣ Проверяем адрес перед регистрацией
            const checkRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/check-address`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ address }),
            });

            const checkData = await checkRes.json();
            if (!checkRes.ok) throw new Error(checkData.error || "Address validation failed");

            // 2️⃣ Если ок — продолжаем регистрацию
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fname, lname, address, phone, email, password }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Registration failed");

            setMessage("✅ Account created! Check your email to verify your account.");
            setShowModal(true);
        } catch (err: any) {
            setMessage(err.message || "Something went wrong");
            setShowModal(true);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <form
                onSubmit={handleRegister}
                className="w-full max-w-sm space-y-4 p-6 border rounded-lg bg-white shadow-md relative"
            >
                <h1 className="text-2xl font-bold text-center">Register</h1>

                <Input type="text" placeholder="First name" value={fname} onChange={(e) => setfName(e.target.value)} required />
                <Input type="text" placeholder="Last name" value={lname} onChange={(e) => setlName(e.target.value)} required />

                {/* Address field with autocomplete */}
                <div className="relative">
                    <Input
                        type="text"
                        placeholder="Address (London only)"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                    {suggestions.length > 0 && (
                        <ul className="absolute z-10 w-full bg-white border rounded mt-1 max-h-48 overflow-auto">
                            {suggestions.map((s, i) => (
                                <li
                                    key={i}
                                    onClick={() => {
                                        setAddress(`${s.properties.name}${s.properties.city ? ", " + s.properties.city : ""}`);
                                        setSuggestions([]);
                                    }}
                                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                >
                                    {s.properties.name}
                                    {s.properties.city && `, ${s.properties.city}`}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <Input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />

                <Button type="submit" className="w-full">
                    Register
                </Button>

                {showModal && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs text-center">
                            <p>{message}</p>
                            <Button
                                onClick={() => {
                                    setShowModal(false);
                                    if (message.includes("Account created")) router.push("/login");
                                }}
                                className="mt-4 w-full"
                            >
                                OK
                            </Button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}
