"use client";
import {useEffect, useState} from "react";
import {ArrowUpDown, Check, ChevronDown, RotateCcw, Search, SlidersHorizontal, X} from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {Slider} from "@/components/ui/slider";
import {SortOption} from "@/lib/sorts"
import {manrope, raleway} from "@/app/fonts";
import {Skeleton} from "@/components/ui/skeleton";

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

// short — подпись на кнопке (коротко, чтобы влезала на телефоне), label — в списке
const SORT_OPTIONS: { value: SortOption; label: string; short: string }[] = [
    {value: "all", label: "Recommended", short: "Recommended"},
    {value: "price-low", label: "Price: Low to High", short: "Price ↑"},
    {value: "price-high", label: "Price: High to Low", short: "Price ↓"},
    {value: "alphabetical", label: "Alphabetical: A–Z", short: "A–Z"},
];

const AVAILABILITY_OPTIONS: { value: AvailabilityOption; label: string }[] = [
    {value: "all", label: "All"},
    {value: "in-stock", label: "In stock"},
    {value: "pre-order", label: "Pre-order"},
];

// Общий вид кнопок панели: белая «пилюля» той же высоты, что и поиск
const PILL = `${manrope.className} group inline-flex items-center justify-center gap-1.5 sm:gap-2 h-12 px-3 sm:px-5 rounded-full bg-white
    text-sm font-medium text-[#12100F] ring-1 ring-[#B8485B]/15 shadow-sm cursor-pointer transition
    hover:ring-[#B8485B]/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8485B]/50
    data-[state=open]:ring-[#B8485B]/50`;

const SECTION_TITLE = `${manrope.className} text-xs font-semibold uppercase tracking-[0.14em] text-[#6F5E53]`;

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

    // Окно фильтров работает с черновиком: выбор применяется к списку только по «Show results»,
    // а закрытие окна (крестик, Esc, клик мимо) его отменяет
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [draftType, setDraftType] = useState<number | null>(selectedType);
    const [draftAvailability, setDraftAvailability] = useState<AvailabilityOption>(availability);
    const [draftPrice, setDraftPrice] = useState<[number, number]>(priceRange);

    const onFiltersOpenChange = (open: boolean) => {
        if (open) {
            // Каждый раз начинаем с того, что сейчас применено
            setDraftType(selectedType);
            setDraftAvailability(availability);
            setDraftPrice(priceRange);
        }
        setFiltersOpen(open);
    };

    const applyFilters = () => {
        setSelectedType(draftType);
        setAvailability(draftAvailability);
        setPriceRange(draftPrice);
        setFiltersOpen(false);
    };

    const resetDraft = () => {
        setDraftType(null);
        setDraftAvailability("all");
        setDraftPrice([0, maxPrice]);
    };

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

    const currentSort = SORT_OPTIONS.find((o) => o.value === sort) ?? SORT_OPTIONS[0];
    const typeName = types.find((t) => t.id === selectedType)?.type_name;
    const priceFiltered = priceRange[0] > 0 || priceRange[1] < maxPrice;

    // Выбранные фильтры — чипами под панелью; крестик на чипе снимает только его
    const activeFilters = [
        selectedType !== null && {key: "type", name: "Occasion", label: typeName ?? "Occasion", clear: () => setSelectedType(null)},
        availability !== "all" && {
            key: "availability",
            name: "Availability",
            label: AVAILABILITY_OPTIONS.find((o) => o.value === availability)?.label ?? availability,
            clear: () => setAvailability("all"),
        },
        priceFiltered && {
            key: "price",
            name: "Price",
            label: `£${priceRange[0]} – £${priceRange[1]}`,
            clear: () => setPriceRange([0, maxPrice]),
        },
    ].filter(Boolean) as { key: string; name: string; label: string; clear: () => void }[];

    return (
        <div className="container mx-auto px-4 py-6 space-y-3">
            <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                    <Search
                        aria-hidden="true"
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B8485B]/70"
                    />
                    <input
                        type="search"
                        aria-label="Search products"
                        placeholder="Search cakes, biscuits…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={`${manrope.className} w-full h-12 pl-12 pr-12 rounded-full bg-white text-sm md:text-base text-[#12100F]
                                    placeholder:text-gray-400 ring-1 ring-[#B8485B]/15 shadow-sm outline-none transition
                                    focus:ring-2 focus:ring-[#B8485B]/50 focus:shadow-md
                                    [&::-webkit-search-cancel-button]:appearance-none`}
                    />
                    {search && (
                        <button
                            type="button"
                            aria-label="Clear search"
                            onClick={() => setSearch("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center
                                       text-gray-500 cursor-pointer transition-colors hover:bg-[#B8485B]/10 hover:text-[#B8485B]"
                        >
                            <X className="w-4 h-4"/>
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-2 md:flex gap-3">
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            {/* min-w: подписи сортировки разной длины — без него поле поиска «прыгало» при смене */}
                            <button type="button" className={`${PILL} md:min-w-52 lg:min-w-60`} aria-label={`Sort: ${currentSort.label}`}>
                                <ArrowUpDown className="hidden min-[400px]:block w-4 h-4 shrink-0 text-[#B8485B]" aria-hidden="true"/>
                                <span className="hidden lg:inline text-gray-500">Sort:</span>
                                <span className="truncate">{currentSort.short}</span>
                                <ChevronDown
                                    aria-hidden="true"
                                    className="w-4 h-4 text-gray-400 transition-transform group-data-[state=open]:rotate-180"
                                />
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" sideOffset={8} className={`${manrope.className} w-60 rounded-xl p-1.5`}>
                            {SORT_OPTIONS.map((o) => {
                                const active = o.value === sort;
                                return (
                                    <DropdownMenuItem
                                        key={o.value}
                                        onClick={() => setSort(o.value)}
                                        className={`flex items-center justify-between rounded-lg px-3 py-2 cursor-pointer
                                                    focus:bg-[#B8485B]/10 focus:text-[#B8485B]
                                                    ${active ? "text-[#B8485B] font-semibold" : ""}`}
                                    >
                                        {o.label}
                                        {active && <Check className="w-4 h-4 text-[#B8485B]" aria-hidden="true"/>}
                                    </DropdownMenuItem>
                                );
                            })}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Dialog open={filtersOpen} onOpenChange={onFiltersOpenChange}>
                        <DialogTrigger asChild>
                            <button
                                type="button"
                                className={PILL}
                                aria-label={activeFilters.length ? `Filters, ${activeFilters.length} active` : "Filters"}
                            >
                                <SlidersHorizontal className="w-4 h-4 text-[#B8485B]" aria-hidden="true"/>
                                Filters
                                {activeFilters.length > 0 && (
                                    <span
                                        aria-hidden="true"
                                        className="min-w-5 h-5 px-1.5 rounded-full bg-[#B8485B] text-white text-[11px] font-semibold
                                                   flex items-center justify-center leading-none"
                                    >
                                        {activeFilters.length}
                                    </span>
                                )}
                            </button>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden rounded-2xl">
                            <DialogHeader className="px-6 pt-6 pb-4 border-b border-[#B8485B]/10 text-left">
                                <DialogTitle className={`${raleway.className} text-xl font-bold text-[#12100F]`}>
                                    Filters
                                </DialogTitle>
                                <DialogDescription className={`${manrope.className} text-sm text-[#6F5E53]`}>
                                    Narrow down the menu to find your treat.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="px-6 py-5 space-y-7 max-h-[60vh] overflow-y-auto">
                                <section className="space-y-3">
                                    <h3 className={SECTION_TITLE}>Occasion</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {loadingTypes && Array.from({length: 4}).map((_, i) => (
                                            <Skeleton key={i} className="h-9 w-24 rounded-full"/>
                                        ))}
                                        {!loadingTypes && types.map((t) => {
                                            const active = draftType === t.id;
                                            return (
                                                <button
                                                    key={t.id}
                                                    type="button"
                                                    aria-pressed={active}
                                                    onClick={() => setDraftType(active ? null : t.id)}
                                                    className={`${manrope.className} inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-sm
                                                                cursor-pointer transition-colors focus-visible:outline-none
                                                                focus-visible:ring-2 focus-visible:ring-[#B8485B]/50
                                                                ${active
                                                        ? "bg-[#B8485B] text-white shadow-sm"
                                                        : "bg-[#F6EEEC] text-[#12100F] hover:bg-[#B8485B]/15"}`}
                                                >
                                                    {active && <Check className="w-3.5 h-3.5" aria-hidden="true"/>}
                                                    {t.type_name}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </section>

                                <section className="space-y-3">
                                    <h3 className={SECTION_TITLE} id="availability-label">Availability</h3>
                                    <div
                                        role="radiogroup"
                                        aria-labelledby="availability-label"
                                        className="grid grid-cols-3 p-1 rounded-full bg-[#F6EEEC]"
                                    >
                                        {AVAILABILITY_OPTIONS.map((o) => {
                                            const active = draftAvailability === o.value;
                                            return (
                                                <button
                                                    key={o.value}
                                                    type="button"
                                                    role="radio"
                                                    aria-checked={active}
                                                    onClick={() => setDraftAvailability(o.value)}
                                                    className={`${manrope.className} h-9 rounded-full text-sm cursor-pointer transition-all
                                                                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8485B]/50
                                                                ${active
                                                        ? "bg-white text-[#B8485B] font-semibold shadow-sm"
                                                        : "text-[#6F5E53] hover:text-[#12100F]"}`}
                                                >
                                                    {o.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </section>

                                <section className="space-y-4">
                                    <div className="flex items-baseline justify-between">
                                        <h3 className={SECTION_TITLE}>Price</h3>
                                        <span className={`${manrope.className} text-sm font-semibold text-[#12100F]`}>
                                            £{draftPrice[0]} – £{draftPrice[1]}
                                        </span>
                                    </div>

                                    <Slider
                                        value={draftPrice}
                                        onValueChange={(val) => setDraftPrice(val as [number, number])}
                                        min={0}
                                        max={maxPrice}
                                        step={1}
                                        aria-label="Price range"
                                        className="[&_[data-slot=slider-range]]:bg-[#B8485B] [&_[data-slot=slider-thumb]]:border-[#B8485B]"
                                    />

                                    <div className="grid grid-cols-2 gap-3">
                                        <PriceInput
                                            label="Min"
                                            value={draftPrice[0]}
                                            onChange={(v) => setDraftPrice([v, draftPrice[1]])}
                                        />
                                        <PriceInput
                                            label="Max"
                                            value={draftPrice[1]}
                                            onChange={(v) => setDraftPrice([draftPrice[0], v])}
                                        />
                                    </div>
                                </section>
                            </div>

                            <div className="flex items-center gap-3 px-6 py-4 border-t border-[#B8485B]/10 bg-[#FBF7F6]">
                                <button
                                    type="button"
                                    onClick={resetDraft}
                                    className={`${manrope.className} h-11 px-5 rounded-full text-sm font-medium text-[#6F5E53] cursor-pointer
                                                transition-colors hover:text-[#B8485B] hover:bg-[#B8485B]/10`}
                                >
                                    Reset
                                </button>
                                <button
                                        type="button"
                                        onClick={applyFilters}
                                        className={`${manrope.className} flex-1 h-11 rounded-full main-button-color text-white text-sm
                                                    font-semibold shadow-sm cursor-pointer transition hover:brightness-110
                                                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8485B]/50
                                                    focus-visible:ring-offset-2`}
                                    >
                                        Show results
                                    </button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {activeFilters.length > 0 && (
                // Панель лежит на бордовом фоне: чипы белые, у каждого — какой это фильтр и круглый крестик
                <div className="flex flex-wrap items-center gap-2 pt-1">
                    {activeFilters.map((f) => (
                        <button
                            key={f.key}
                            type="button"
                            onClick={f.clear}
                            aria-label={`Remove filter ${f.name}: ${f.label}`}
                            className={`${manrope.className} group inline-flex items-center gap-2 h-9 pl-3.5 pr-1.5 rounded-full
                                        bg-white text-sm shadow-sm cursor-pointer transition hover:shadow-md`}
                        >
                            <span className="text-[#6F5E53]">{f.name}:</span>
                            <span className="font-semibold text-[#12100F]">{f.label}</span>
                            <span className="flex w-6 h-6 items-center justify-center rounded-full bg-[#F6EEEC] text-[#B8485B]
                                             transition-colors group-hover:bg-[#B8485B] group-hover:text-white">
                                <X className="w-3.5 h-3.5" aria-hidden="true"/>
                            </span>
                        </button>
                    ))}
                    {activeFilters.length > 1 && (
                        <button
                            type="button"
                            onClick={resetFilters}
                            className={`${manrope.className} inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full text-sm font-semibold
                                        text-white ring-1 ring-white/40 cursor-pointer transition hover:bg-white hover:text-[#B8485B] hover:ring-white`}
                        >
                            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true"/>
                            Clear all
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

function PriceInput({label, value, onChange}: { label: string; value: number; onChange: (value: number) => void }) {
    return (
        <label className="block">
            <span className={`${manrope.className} block mb-1 text-xs text-[#6F5E53]`}>{label}</span>
            <span
                className="flex items-center h-11 px-3 rounded-xl bg-white ring-1 ring-[#B8485B]/20 transition
                           focus-within:ring-2 focus-within:ring-[#B8485B]/50">
                <span className={`${manrope.className} text-sm text-gray-400`}>£</span>
                <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value) || 0)}
                    className={`${manrope.className} w-full pl-1.5 bg-transparent text-sm text-[#12100F] outline-none
                                [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                />
            </span>
        </label>
    );
}
