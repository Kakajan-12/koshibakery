"use client";

import {useState, useEffect, useRef} from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {raleway} from "@/app/fonts";

export default function RegisterPage() {
    const [fname, setfName] = useState("");
    const [lname, setlName] = useState("");

    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);

    const [street, setStreet] = useState("");
    const [housenumber, setHouseNumber] = useState("");
    const [postcode, setPostcode] = useState("");
    const [city, setCity] = useState("");
    const [fullAddress, setFullAddress] = useState("");

    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const houseInputRef = useRef<HTMLInputElement | null>(null);
    const [houseNumberInputVisible, setHouseNumberInputVisible] = useState(false);


    const router = useRouter();

    const isSelectingRef = useRef(false);

    useEffect(() => {
        if (isSelectingRef.current) return;

        if (fullAddress.length < 3) {
            setSuggestions([]);
            return;
        }

        const fetchSuggestions = async () => {
            try {
                const res = await fetch(
                    `https://photon.komoot.io/api/?q=${encodeURIComponent(fullAddress + ", London")}&bbox=-0.5103,51.2868,0.3340,51.6919&limit=10&lang=en`
                );
                const data = await res.json();
                if (!data.features) return;

                const unique = Array.from(
                    new Map(
                        data.features.map((f: any) => [
                            `${f.properties.housenumber}-${f.properties.street}-${f.properties.city || f.properties.state || ""}`,
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
    }, [fullAddress]);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        const addressString = `${housenumber ? housenumber + " " : ""}${street}, ${city}${postcode ? ", " + postcode : ""}`;

        try {
            const checkRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/check-address`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ address: addressString }),
            });

            const checkData = await checkRes.json();
            if (!checkRes.ok) throw new Error(checkData.error || "Address validation failed");

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fname,
                    lname,
                    address: addressString,
                    phone,
                    email,
                    password,
                    latitude,
                    longitude
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Registration failed");

            setMessage("Account created! Check your email to verify your account.");
            setShowModal(true);
        } catch (err: any) {
            setMessage(err.message || "Something went wrong");
            setShowModal(true);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <form
                onSubmit={handleRegister}
                className="w-full max-w-sm space-y-4 p-6 border rounded-lg bg-white shadow-md relative"
            >
                <h1 className={`${raleway.className} text-2xl font-bold text-center`}>Register</h1>

                <Input type="text" placeholder="First name" value={fname} onChange={(e) => setfName(e.target.value)}
                       required/>
                <Input type="text" placeholder="Last name" value={lname} onChange={(e) => setlName(e.target.value)}
                       required/>

                <div className="relative">
                    <Input
                        type="text"
                        placeholder="Start typing your address (London)"
                        value={fullAddress}
                        onChange={(e) => setFullAddress(e.target.value)}
                        required
                    />
                    {suggestions.length > 0 && (
                        <ul className="absolute z-10 w-full bg-white border rounded mt-1 max-h-48 overflow-auto">
                            {suggestions.map((s, i) => {
                                const p = s.properties;
                                const full = [
                                    p.housenumber,
                                    p.street || p.name,
                                    p.city,
                                    p.postcode,
                                ]
                                    .filter(Boolean)
                                    .join(", ");

                                return (
                                    <li
                                        key={i}
                                        onClick={() => {
                                            isSelectingRef.current = true;

                                            const p = s.properties;

                                            setStreet(p.street || p.name || "");
                                            setPostcode(p.postcode || "");
                                            setCity(p.city || "");
                                            setLatitude(s.geometry.coordinates[1]);
                                            setLongitude(s.geometry.coordinates[0]);
                                            setFullAddress([p.street || p.name, p.city, p.postcode].filter(Boolean).join(", "));

                                            setSuggestions([]);

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
                </div>

                <div className="mt-2">
                    {houseNumberInputVisible && (
                        <Input
                            ref={houseInputRef}
                            type="text"
                            placeholder="House / Flat number"
                            value={housenumber}
                            onChange={(e) => setHouseNumber(e.target.value)}
                            required
                        />
                    )}
                </div>


                <Input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)}
                       required/>
                <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
                       required/>
                <Input type="password" placeholder="Password" value={password}
                       onChange={(e) => setPassword(e.target.value)} required/>

                <Button type="submit" className="w-full bg-[#833B45] cursor-pointer hover:bg-[#833B45]">Register
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
