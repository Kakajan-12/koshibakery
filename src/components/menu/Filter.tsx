"use client";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FiSliders } from "react-icons/fi";

export default function FilterBar() {
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("popularity");

    const handleSearch = () => {
        console.log("Searching:", search);
    };

    return (
        <div className="container mx-auto px-4 py-6 space-y-4">
            <div className="flex items-center w-full bg-white shadow-sm rounded-md overflow-hidden">
                <div className="px-3 text-gray-400">
                    <FaSearch />
                </div>
                <input
                    type="text"
                    placeholder="Cakes..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 p-3 outline-none text-sm"
                />
                <button
                    onClick={handleSearch}
                    className="bg-green-900 text-white px-5 py-1 text-sm font-medium hover:bg-green-800 transition mr-5 rounded-md"
                >
                    Search
                </button>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-gray-700 text-sm font-medium">Sort By:</span>
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="border rounded-md px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-green-900"
                    >
                        <option value="popularity">Popularity</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="newest">Newest</option>
                    </select>
                </div>

                <button className="p-2 rounded-md hover:bg-gray-100 transition">
                    <FiSliders className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}
