"use client";
import {useEffect, useState} from "react";
import {FaSearch} from "react-icons/fa";
import {FiSliders} from "react-icons/fi";

import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Slider} from "@/components/ui/slider";
import {SortOption} from "@/lib/sorts"

type AvailabilityOption = "all" | "in-stock" | "pre-order";

type FilterBarProps = {
    sort: SortOption;
    setSort: React.Dispatch<React.SetStateAction<SortOption>>;
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    selectedType: number | null;
    setSelectedType: React.Dispatch<React.SetStateAction<number | null>>;
    availability: AvailabilityOption;
    setAvailability: React.Dispatch<React.SetStateAction<AvailabilityOption>>;
    priceRange: [number, number];
    setPriceRange: React.Dispatch<React.SetStateAction<[number, number]>>;
    maxPrice: number;
    resetFilters: () => void;
};

interface ProductType {
    id: number;
    type_name: string;
}

export default function FilterBar({
                                      sort,
                                      setSort,
                                      search,
                                      setSearch,
                                      selectedType,
                                      setSelectedType,
                                      availability,
                                      setAvailability,
                                      priceRange,
                                      setPriceRange,
                                      maxPrice,
                                      resetFilters
                                  }: FilterBarProps) {
    const [types, setTypes] = useState<ProductType[]>([]);
    const [loadingTypes, setLoadingTypes] = useState(false);

    useEffect(() => {
        const fetchTypes = async () => {
            try {
                setLoadingTypes(true);
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product-types`, {
                    cache: "no-store",
                });
                if (!res.ok) throw new Error("Failed to load product types");
                const data: ProductType[] = await res.json();
                setTypes(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingTypes(false);
            }
        };

        fetchTypes();
    }, []);

    const sortOptions: { value: SortOption; label: string }[] = [
        {value: "all", label: "All"},
        {value: "price-low", label: "Price: Low to High"},
        {value: "price-high", label: "Price: High to Low"},
        {value: "alphabetical", label: "Alphabetical: A-Z"},
    ];


    return (
        <div className="container mx-auto px-4 py-6 space-y-4">
            <div className="flex items-center w-full bg-white shadow-sm rounded-md overflow-hidden">
                <div className="px-3 text-gray-400">
                    <FaSearch/>
                </div>
                <input
                    type="text"
                    placeholder="Cakes..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 p-3 outline-none text-sm"
                />

            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-gray-700 text-md sm:text-lg font-medium">Sort By:</span>

                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="min-w-[160px] justify-between shadow-sm"
                            >
                                {sortOptions.find((o) => o.value === sort)?.label}
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="start" className="w-[160px]">
                            {sortOptions.map((o) => (
                                <DropdownMenuItem key={o.value} onClick={() => setSort(o.value)}>
                                    {o.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="border cursor-pointer">
                            <FiSliders/>
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="max-w-sm pt-10">
                        <DialogHeader>
                            <DialogTitle className="flex justify-between items-center">
                                <span>Filter</span>
                                <button
                                    onClick={resetFilters}
                                    className="text-sm text-blue-500 hover:underline"
                                >
                                    Reset all
                                </button>
                            </DialogTitle>
                        </DialogHeader>


                        <div className="space-y-6">

                            <div className="space-y-2">
                                <p className="text-sm text-gray-500">Occasion</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {loadingTypes && <p className="col-span-2 text-sm text-gray-400">Loading...</p>}
                                    {!loadingTypes &&
                                        types.map((t) => (
                                            <Button
                                                key={t.id}
                                                // variant={selectedType === t.id ? "default" : "outline"}
                                                variant="outline"
                                                onClick={() =>
                                                    setSelectedType(selectedType === t.id ? null : t.id)
                                                }
                                                className={`justify-center transition-colors rounded-3xl cursor-pointer
              ${
                                                    selectedType === t.id
                                                        ? "bg-green-700 text-white border-green-700 hover:bg-green-700 hover:text-white"
                                                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                                }`}
                                            >
                                                {t.type_name}
                                            </Button>
                                        ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-sm text-gray-500">Availability</p>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="availability"
                                            value="all"
                                            checked={availability === "all"}
                                            onChange={() => setAvailability("all")}
                                        />
                                        All
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="availability"
                                            value="in-stock"
                                            checked={availability === "in-stock"}
                                            onChange={() => setAvailability("in-stock")}
                                        />
                                        In Stock
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="availability"
                                            value="pre-order"
                                            checked={availability === "pre-order"}
                                            onChange={() => setAvailability("pre-order")}
                                        />
                                        Pre-order
                                    </label>
                                </div>
                            </div>


                            <div className="space-y-2">
                                <p className="text-sm text-gray-500">Price</p>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Min"
                                        type="number"
                                        value={priceRange[0]}
                                        onChange={(e) =>
                                            setPriceRange([Number(e.target.value) || 0, priceRange[1]])
                                        }
                                        className="w-1/2"
                                    />
                                    <Input
                                        placeholder="Max"
                                        type="number"
                                        value={priceRange[1]}
                                        onChange={(e) =>
                                            setPriceRange([priceRange[0], Number(e.target.value) || 0])
                                        }
                                        className="w-1/2"
                                    />
                                </div>

                                <Slider
                                    value={priceRange}
                                    onValueChange={(val) => setPriceRange(val as [number, number])}
                                    min={0}
                                    max={maxPrice}
                                    step={1}
                                />

                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>${priceRange[0]}</span>
                                    <span>${priceRange[1]}</span>
                                </div>
                            </div>

                            <DialogTrigger asChild>
                                <Button variant="ghost" className="w-full bg-green-900 hover:bg-green-800 text-white hover:text-white cursor-pointer">
                                    Save
                                </Button>
                            </DialogTrigger>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
