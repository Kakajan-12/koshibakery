"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { manrope } from "@/app/fonts";

export default function GuestAddressInput({ guestData, setGuestData }: any) {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const isSelectingRef = useRef(false);

    useEffect(() => {
        if (isSelectingRef.current || query.length < 3) {
            setSuggestions([]);
            return;
        }

        const fetchSuggestions = async () => {
            const res = await fetch(
                `https://photon.komoot.io/api/?q=${encodeURIComponent(query + ", London")}&limit=5`
            );
            const data = await res.json();
            setSuggestions(data.features || []);
        };

        const t = setTimeout(fetchSuggestions, 400);
        return () => clearTimeout(t);
    }, [query]);

    return (
        <div className="relative">
            <Input
                placeholder="Delivery address"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={`${manrope.className} border main-border-color rounded p-2 w-full`}
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
                        ].filter(Boolean).join(", ");

                        return (
                            <li
                                key={i}
                                onClick={() => {
                                    isSelectingRef.current = true;
                                    setQuery(full);
                                    setGuestData({
                                        ...guestData,
                                        address: full,
                                    });
                                    setSuggestions([]);
                                    setTimeout(() => (isSelectingRef.current = false), 100);
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
    );
}
