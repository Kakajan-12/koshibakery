"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {manrope} from "@/app/fonts";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Login failed");
            }

            localStorage.setItem("token", data.token);
            router.push("/profile");
        } catch (err: any) {
            alert(err.message || "Invalid credentials");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <form
                onSubmit={handleLogin}
                className="w-full max-w-sm space-y-4 p-6 border rounded-lg bg-white shadow-md"
            >
                <h1 className="text-2xl font-bold">Login</h1>
                <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={manrope.className}

                />
                <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={manrope.className}
                />
                <Button type="submit" className="text-sm sm:text-md md:text-lg w-full rounded-full main-text-color hover:!text-white border-2 main-border-color bg-white cursor-pointer hover:bg-[#B8485B]">Login</Button>
                <p className="text-sm text-gray-500">
                    No account?{" "}
                    <span
                        onClick={() => router.push("/register")}
                        className="text-blue-600 cursor-pointer"
                    >
                        Register
                    </span>
                </p>
            </form>
        </div>
    );
}
