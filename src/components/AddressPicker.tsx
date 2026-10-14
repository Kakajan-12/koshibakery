"use client";

import {useEffect, useLayoutEffect, useRef, useState} from "react";
import {createPortal} from "react-dom";
import {AlertCircle, Check, ChevronDown, Loader2, MapPin, PencilLine, Search} from "lucide-react";
import {manrope} from "@/app/fonts";
import {PickedPlace} from "@/lib/places";

const INPUT = `${manrope.className} w-full h-12 px-4 rounded-xl bg-white text-[15px] text-[#12100F] placeholder:text-gray-400
    ring-1 ring-[#B8485B]/20 outline-none transition focus:ring-2 focus:ring-[#B8485B]/50`;
const LABEL = `${manrope.className} block text-sm font-semibold text-[#12100F] mb-1.5`;
const MANUAL = "manual";

type NearbyAddress = { housenumber: string; street: string; label: string; lat: number; lng: number };
type PostcodeResult = {
    postcode: string;
    district: string;
    ward: string;
    isLondon: boolean;
    lat: number;
    lng: number;
    addresses: NearbyAddress[];
};

/**
 * Адрес по британскому индексу: покупатель вводит индекс → видит район и выбирает дом из списка
 * (или вводит улицу и номер дома вручную, если его адреса в списке нет).
 * Данные — GET /api/postcode/:postcode (postcodes.io + OpenRouteService на сервере).
 *
 * onChange получает выбранное место (null — адрес ещё не выбран), номер дома и название здания.
 * defaultValue — текущий адрес (при правке): показывается подсказкой, выбранным не считается.
 * withBuildingName — необязательное поле «Building name».
 */
export default function AddressPicker({id, label, hint, required, defaultValue = "", autoFocus, withBuildingName, onChange}: {
    id: string;
    label: string;
    hint?: string;
    required?: boolean;
    defaultValue?: string;
    autoFocus?: boolean;
    withBuildingName?: boolean;
    onChange: (place: PickedPlace | null, housenumber: string, buildingName: string) => void;
}) {
    const [postcode, setPostcode] = useState("");
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState<PostcodeResult | null>(null);
    // Выбор в списке: номер адреса, MANUAL — ввод вручную, "" — ещё не выбрано
    const [choice, setChoice] = useState("");
    const [street, setStreet] = useState("");
    const [housenumber, setHouseNumber] = useState("");
    const [buildingName, setBuildingName] = useState("");
    const selectRef = useRef<HTMLButtonElement | null>(null);
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    const find = async () => {
        const value = postcode.trim();
        if (!value) {
            setError("Please enter your postcode.");
            return;
        }
        setSearching(true);
        setError("");
        setResult(null);
        setChoice("");
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/postcode/${encodeURIComponent(value)}`);
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.error || "We couldn't look up this postcode. Please try again.");
            setResult(data);
            setPostcode(data.postcode);
            if (data.isLondon) {
                // Адресов рядом не нашлось — сразу ручной ввод
                if (data.addresses.length === 0) setChoice(MANUAL);
                else setTimeout(() => selectRef.current?.focus(), 50);
            }
        } catch (err) {
            const text = err instanceof Error ? err.message : "";
            setError(text === "Failed to fetch" ? "We couldn't reach the server. Please check your connection and try again." : text);
        } finally {
            setSearching(false);
        }
    };

    // Собираем выбранное место из состояния и сообщаем форме
    useEffect(() => {
        let place: PickedPlace | null = null;
        let house = housenumber.trim();
        if (result?.isLondon && choice !== "") {
            if (choice === MANUAL) {
                if (street.trim() && house) {
                    place = {
                        street: street.trim(), city: "London", postcode: result.postcode,
                        latitude: result.lat, longitude: result.lng,
                        label: `${house} ${street.trim()}, ${result.postcode}`, housenumber: house,
                    };
                }
            } else {
                const a = result.addresses[Number(choice)];
                if (a) {
                    house = a.housenumber;
                    place = {
                        street: a.street, city: "London", postcode: result.postcode,
                        latitude: a.lat ?? result.lat, longitude: a.lng ?? result.lng,
                        label: `${a.label}, ${result.postcode}`, housenumber: a.housenumber,
                    };
                }
            }
        }
        onChangeRef.current(place, place ? house : "", buildingName);
    }, [result, choice, street, housenumber, buildingName]);

    const manual = choice === MANUAL;

    return (
        <div className="space-y-4">
            <div>
                <label htmlFor={id} className={LABEL}>{label}</label>
                <div className="flex gap-2">
                    <div className="relative flex-1 min-w-0">
                        <MapPin className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B8485B]/70" aria-hidden="true"/>
                        <input
                            id={id}
                            type="text"
                            autoComplete="postal-code"
                            autoCapitalize="characters"
                            required={required}
                            autoFocus={autoFocus}
                            maxLength={10}
                            value={postcode}
                            onChange={(e) => {
                                setPostcode(e.target.value.toUpperCase());
                                // Индекс меняют — прежний результат больше не подходит
                                if (result) {
                                    setResult(null);
                                    setChoice("");
                                }
                                setError("");
                            }}
                            // Enter ищет адрес, а не отправляет всю форму
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    find();
                                }
                            }}
                            placeholder="Postcode, e.g. W2 1ET"
                            className={`${INPUT} pl-10`}
                        />
                    </div>
                    <button
                        type="button"
                        onClick={find}
                        disabled={searching}
                        className={`${manrope.className} shrink-0 inline-flex items-center justify-center gap-2 h-12 px-4 sm:px-5 rounded-xl main-button-color text-white text-sm font-semibold cursor-pointer transition hover:brightness-110 disabled:opacity-70 disabled:cursor-wait`}
                    >
                        {searching ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true"/> : <Search className="w-4 h-4" aria-hidden="true"/>}
                        Find address
                    </button>
                </div>
                {defaultValue && !result && (
                    <p className={`${manrope.className} mt-1.5 text-xs text-[#6F5E53]`}>
                        Current address: <span className="text-[#3B302B]">{defaultValue}</span>
                    </p>
                )}
                {hint && !error && <p className={`${manrope.className} mt-1.5 text-xs text-[#6F5E53]`}>{hint}</p>}
                {error && (
                    <p role="alert" className={`${manrope.className} mt-1.5 flex items-center gap-1.5 text-sm text-[#B42318]`}>
                        <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true"/> {error}
                    </p>
                )}
            </div>

            {result && (
                <div className="space-y-4">
                    <p className={`${manrope.className} flex items-center gap-2 text-sm text-[#3B302B]`}>
                        <MapPin className="w-4 h-4 shrink-0 text-[#B8485B]" aria-hidden="true"/>
                        <span>
                            <span className="font-semibold">{result.postcode}</span>
                            {" · "}{[result.ward, result.district].filter(Boolean).join(", ")}
                        </span>
                    </p>

                    {!result.isLondon ? (
                        <p role="alert" className={`${manrope.className} rounded-xl bg-[#FEF3F2] p-3 text-sm text-[#912018]`}>
                            Sorry, we only deliver within London.
                        </p>
                    ) : (
                        <>
                            {result.addresses.length > 0 && (
                                <div>
                                    <label id={`${id}-select-label`} htmlFor={`${id}-select`} className={LABEL}>Select your address</label>
                                    <AddressSelect
                                        id={`${id}-select`}
                                        buttonRef={selectRef}
                                        addresses={result.addresses}
                                        value={choice}
                                        onChange={setChoice}
                                    />
                                </div>
                            )}

                            {manual && (
                                <div className="grid sm:grid-cols-[1fr_2fr] gap-4">
                                    <div>
                                        <label htmlFor={`${id}-house`} className={LABEL}>House or flat number</label>
                                        <input id={`${id}-house`} type="text" required maxLength={20}
                                               value={housenumber} onChange={(e) => setHouseNumber(e.target.value)}
                                               placeholder="e.g. 12 or Flat 3" className={INPUT}/>
                                    </div>
                                    <div>
                                        <label htmlFor={`${id}-street`} className={LABEL}>Street</label>
                                        <input id={`${id}-street`} type="text" required maxLength={120} autoComplete="address-line1"
                                               value={street} onChange={(e) => setStreet(e.target.value)}
                                               placeholder="e.g. Edgware Road" className={INPUT}/>
                                    </div>
                                </div>
                            )}

                            {withBuildingName && choice !== "" && (
                                <div>
                                    <label htmlFor={`${id}-building`} className={LABEL}>
                                        Building name <span className="font-normal text-[#6F5E53]">(optional)</span>
                                    </label>
                                    <input
                                        id={`${id}-building`}
                                        type="text"
                                        maxLength={80}
                                        autoComplete="address-line2"
                                        value={buildingName}
                                        onChange={(e) => setBuildingName(e.target.value)}
                                        placeholder="e.g. Rose Court"
                                        className={INPUT}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

/** Список адресов в стиле сайта (вместо системного <select>): мышь, стрелки, Enter, Esc. */
function AddressSelect({id, buttonRef, addresses, value, onChange}: {
    id: string;
    buttonRef: React.RefObject<HTMLButtonElement | null>;
    addresses: NearbyAddress[];
    value: string;
    onChange: (value: string) => void;
}) {
    const options = [...addresses.map((a, i) => ({value: String(i), label: a.label})), {value: MANUAL, label: "My address isn't listed"}];
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(0);
    const rootRef = useRef<HTMLDivElement | null>(null);
    const listRef = useRef<HTMLUListElement | null>(null);
    // Положение списка на экране: он рисуется поверх страницы (портал в body),
    // поэтому не раздвигает форму и не обрезается карточкой с overflow-hidden
    const [pos, setPos] = useState<{ left: number; width: number; top?: number; bottom?: number; maxHeight: number } | null>(null);
    const selected = options.find((o) => o.value === value);

    // Клик вне поля и списка закрывает его
    useEffect(() => {
        if (!open) return;
        const close = (e: MouseEvent) => {
            const target = e.target as Node;
            if (!rootRef.current?.contains(target) && !listRef.current?.contains(target)) setOpen(false);
        };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, [open]);

    // Список под полем; если снизу мало места — над ним. Следует за полем при прокрутке и изменении окна
    useLayoutEffect(() => {
        if (!open) return;
        const place = () => {
            const rect = buttonRef.current?.getBoundingClientRect();
            if (!rect) return;
            const gap = 8;
            const margin = 12;
            const below = window.innerHeight - rect.bottom - gap - margin;
            const above = rect.top - gap - margin;
            const up = below < 200 && above > below;
            setPos({
                left: rect.left,
                width: rect.width,
                ...(up ? {bottom: window.innerHeight - rect.top + gap} : {top: rect.bottom + gap}),
                maxHeight: Math.max(120, Math.min(288, up ? above : below)),
            });
        };
        place();
        window.addEventListener("scroll", place, true);
        window.addEventListener("resize", place);
        return () => {
            window.removeEventListener("scroll", place, true);
            window.removeEventListener("resize", place);
        };
    }, [open, buttonRef]);

    // Подсвеченный пункт всегда виден в прокручиваемом списке (прокручиваем только список, не страницу)
    useEffect(() => {
        const list = listRef.current;
        const item = list?.querySelector<HTMLElement>(`[data-index="${active}"]`);
        if (!open || !list || !item) return;
        if (item.offsetTop < list.scrollTop) list.scrollTop = item.offsetTop - 8;
        else if (item.offsetTop + item.offsetHeight > list.scrollTop + list.clientHeight) {
            list.scrollTop = item.offsetTop + item.offsetHeight - list.clientHeight + 8;
        }
    }, [open, active, pos]);

    const show = () => {
        const index = options.findIndex((o) => o.value === value);
        setActive(index >= 0 ? index : 0);
        setOpen(true);
    };
    const pick = (index: number) => {
        onChange(options[index].value);
        setOpen(false);
        buttonRef.current?.focus();
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (!open) {
            if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
                e.preventDefault();
                show();
            }
            return;
        }
        if (e.key === "ArrowDown") setActive((i) => Math.min(i + 1, options.length - 1));
        else if (e.key === "ArrowUp") setActive((i) => Math.max(i - 1, 0));
        else if (e.key === "Home") setActive(0);
        else if (e.key === "End") setActive(options.length - 1);
        else if (e.key === "Enter" || e.key === " ") pick(active);
        else if (e.key === "Escape" || e.key === "Tab") {
            setOpen(false);
            return;
        } else return;
        e.preventDefault();
    };

    return (
        <div ref={rootRef} className="relative">
            <button
                id={id}
                ref={buttonRef}
                type="button"
                role="combobox"
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls={`${id}-list`}
                aria-labelledby={`${id}-label ${id}`}
                aria-activedescendant={open ? `${id}-opt-${active}` : undefined}
                onClick={() => (open ? setOpen(false) : show())}
                onKeyDown={onKeyDown}
                className={`${INPUT} flex items-center justify-between gap-3 text-left cursor-pointer ${open ? "ring-2 ring-[#B8485B]/50" : ""}`}
            >
                <span className={`truncate ${selected ? "" : "text-gray-400"}`}>
                    {selected ? selected.label : `Choose from ${addresses.length} addresses…`}
                </span>
                <ChevronDown aria-hidden="true" className={`w-5 h-5 shrink-0 text-[#B8485B]/70 transition-transform ${open ? "rotate-180" : ""}`}/>
            </button>

            {open && pos && createPortal(
                <ul
                    id={`${id}-list`}
                    ref={listRef}
                    role="listbox"
                    aria-labelledby={`${id}-label`}
                    style={{position: "fixed", left: pos.left, width: pos.width, top: pos.top, bottom: pos.bottom, maxHeight: pos.maxHeight}}
                    className={`${manrope.className} z-40 overflow-y-auto overscroll-contain [scrollbar-width:thin] [scrollbar-color:rgba(184,72,91,0.35)_transparent] rounded-2xl bg-white p-2
                        shadow-[0_12px_32px_rgba(131,59,70,0.18),0_0_0_1px_rgba(184,72,91,0.12)]`}
                >
                    {options.map((o, i) => {
                        const isSelected = o.value === value;
                        const isManual = o.value === MANUAL;
                        return (
                            <li
                                key={o.value}
                                id={`${id}-opt-${i}`}
                                data-index={i}
                                role="option"
                                aria-selected={isSelected}
                                onMouseEnter={() => setActive(i)}
                                // mousedown, чтобы кнопка не теряла фокус до выбора
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    pick(i);
                                }}
                                className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[15px] cursor-pointer transition-colors
                                    ${isManual ? "mt-1 border-t border-[#B8485B]/10 pt-3" : ""}
                                    ${isSelected ? "bg-[#B8485B] text-white font-semibold" : i === active ? "bg-[#B8485B]/10 text-[#B8485B]" : isManual ? "text-[#B8485B]" : "text-[#12100F]"}`}
                            >
                                {isManual
                                    ? <PencilLine className="w-4 h-4 shrink-0" aria-hidden="true"/>
                                    : <MapPin className={`w-4 h-4 shrink-0 ${isSelected ? "" : "text-[#B8485B]/60"}`} aria-hidden="true"/>}
                                <span className="flex-1 truncate">{o.label}</span>
                                {isSelected && <Check className="w-4 h-4 shrink-0" aria-hidden="true"/>}
                            </li>
                        );
                    })}
                </ul>,
                document.body
            )}
        </div>
    );
}
