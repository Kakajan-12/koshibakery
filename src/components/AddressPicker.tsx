"use client";

import {useEffect, useRef, useState} from "react";
import {Check, MapPin} from "lucide-react";
import {manrope} from "@/app/fonts";
import {PickedPlace, placeLabel, PlaceFeature, searchPlaces, toPickedPlace} from "@/lib/places";

const INPUT = `${manrope.className} w-full h-12 px-4 rounded-xl bg-white text-[15px] text-[#12100F] placeholder:text-gray-400
    ring-1 ring-[#B8485B]/20 outline-none transition focus:ring-2 focus:ring-[#B8485B]/50`;
const LABEL = `${manrope.className} block text-sm font-semibold text-[#12100F] mb-1.5`;

/**
 * Поле адреса с подсказками по Лондону. Адрес считается выбранным только после клика по подсказке;
 * если в подсказке нет номера дома — появляется поле для него.
 * onChange получает выбранное место (или null, если адрес правят) и номер дома.
 * defaultValue — текст в поле при открытии (например, при правке адреса); выбранным он не считается.
 * withBuildingName — после выбора адреса показать необязательное поле «Building name»; его значение
 * приходит третьим аргументом onChange.
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
    const [query, setQuery] = useState(defaultValue);
    const [picked, setPicked] = useState<PickedPlace | null>(null);
    const [housenumber, setHouseNumber] = useState("");
    // Название здания не зависит от выбранной улицы — при смене адреса не сбрасываем
    const [buildingName, setBuildingName] = useState("");
    const [suggestions, setSuggestions] = useState<PlaceFeature[]>([]);
    const [open, setOpen] = useState(false);
    const houseRef = useRef<HTMLInputElement | null>(null);
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    // Подсказки с задержкой; пока адрес выбран, не ищем
    useEffect(() => {
        if (picked || query.trim().length < 3) {
            setSuggestions([]);
            return;
        }
        const controller = new AbortController();
        const timer = setTimeout(() => {
            searchPlaces(query, controller.signal)
                .then((list) => {
                    setSuggestions(list);
                    setOpen(true);
                })
                .catch((err) => (err as Error).name !== "AbortError" && console.error(err));
        }, 400);
        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [query, picked]);

    const pick = (f: PlaceFeature) => {
        const place = toPickedPlace(f);
        setPicked(place);
        setQuery(place.label);
        setSuggestions([]);
        setOpen(false);
        setHouseNumber(place.housenumber);
        onChangeRef.current(place, place.housenumber, buildingName);
        if (!place.housenumber) setTimeout(() => houseRef.current?.focus(), 50);
    };

    // Любая правка текста сбрасывает выбранное место — иначе ушли бы старые улица и координаты
    const edit = (value: string) => {
        setQuery(value);
        if (picked) {
            setPicked(null);
            setHouseNumber("");
            onChangeRef.current(null, "", buildingName);
        }
    };

    const needsHouseNumber = !!picked && !picked.housenumber;

    return (
        <div className="space-y-4">
            <div>
                <label htmlFor={id} className={LABEL}>{label}</label>
                <div className="relative">
                    <MapPin className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B8485B]/70" aria-hidden="true"/>
                    <input
                        id={id}
                        type="text"
                        autoComplete="off"
                        required={required}
                        autoFocus={autoFocus}
                        role="combobox"
                        aria-expanded={open && suggestions.length > 0}
                        aria-controls={`${id}-list`}
                        value={query}
                        onChange={(e) => edit(e.target.value)}
                        onFocus={() => setOpen(true)}
                        onBlur={() => setTimeout(() => setOpen(false), 150)}
                        placeholder="Start typing your street or postcode"
                        className={`${INPUT} pl-10 ${picked ? "pr-10" : ""}`}
                    />
                    {picked && (
                        <Check className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2F6B3F]" aria-label="Address selected"/>
                    )}
                    {open && suggestions.length > 0 && (
                        <ul
                            id={`${id}-list`}
                            role="listbox"
                            className={`${manrope.className} absolute z-20 mt-2 w-full overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-[#B8485B]/15`}
                        >
                            {suggestions.map((s) => (
                                <li key={placeLabel(s.properties)} role="option" aria-selected={false}>
                                    <button
                                        type="button"
                                        // mousedown срабатывает раньше blur поля — иначе список закрылся бы до клика
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            pick(s);
                                        }}
                                        className="w-full flex items-start gap-2 px-4 py-3 text-left text-sm text-[#12100F] cursor-pointer hover:bg-[#FBF7F6]"
                                    >
                                        <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-[#6F5E53]" aria-hidden="true"/>
                                        {placeLabel(s.properties)}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {hint && <p className={`${manrope.className} mt-1.5 text-xs text-[#6F5E53]`}>{hint}</p>}
            </div>

            {needsHouseNumber && (
                <div>
                    <label htmlFor={`${id}-house`} className={LABEL}>House or flat number</label>
                    <input
                        id={`${id}-house`}
                        ref={houseRef}
                        type="text"
                        required
                        maxLength={20}
                        value={housenumber}
                        onChange={(e) => {
                            setHouseNumber(e.target.value);
                            onChangeRef.current(picked, e.target.value, buildingName);
                        }}
                        placeholder="e.g. 12 or Flat 3"
                        className={INPUT}
                    />
                </div>
            )}

            {withBuildingName && picked && (
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
                        onChange={(e) => {
                            setBuildingName(e.target.value);
                            onChangeRef.current(picked, housenumber, e.target.value);
                        }}
                        placeholder="e.g. Rose Court"
                        className={INPUT}
                    />
                </div>
            )}
        </div>
    );
}
