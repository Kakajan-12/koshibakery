"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyPage() {
    const params = useSearchParams();
    const token = params.get("token");
    const [status, setStatus] = useState("Verifying...");
    const router = useRouter();

    useEffect(() => {
        if (!token) {
            setStatus("❌ No token provided.");
            return;
        }

        const verify = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify?token=${token}`);
                if (res.ok) {
                    setStatus("✅ Email confirmed! Redirecting...");
                    setTimeout(() => router.push("/login"), 2000);
                } else {
                    setStatus("❌ Invalid or expired link.");
                }
            } catch (err) {
                setStatus("❌ Server error.");
            }
        };

        verify();
    }, [token]);

    return (
        <div className="flex justify-center items-center h-screen text-xl font-bold">
            {status}
        </div>
    );
}
