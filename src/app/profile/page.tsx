"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {
    AlertCircle, Check, ClipboardList, Home, Loader2, LogOut, MapPin, Package, Pencil, Plus, Trash2, Truck, User as UserIcon,
} from "lucide-react";
import {manrope, raleway} from "@/app/fonts";
import {formatPrice} from "@/lib/price";
import {Skeleton} from "@/components/ui/skeleton";
import LoadError from "@/components/LoadError";
import AddressPicker from "@/components/AddressPicker";
import ConfirmDialog from "@/components/ConfirmDialog";
import OrderItemThumb from "@/components/OrderItemThumb";
import {readyLabel} from "@/lib/readyDate";
import {formatAddress, PickedPlace, withBuildingName} from "@/lib/places";
import {useAuth} from "@/app/context/AuthContext";

interface User {
    id: number;
    fname: string;
    lname: string;
    email: string;
    phone: string | null;
    address: string | null;
    has_google?: boolean;
    has_password?: boolean;
}

interface ExtraAddress {
    id: number;
    address: string;
}

interface OrderItem {
    product_name: string;
    variantName?: string;
    price: number | string;
    quantity: number;
    main_image?: string | null;
    custom_message?: string | null;
}

interface Order {
    id: number;
    total: number | string;
    payment_status: string;
    created_at: string;
    order_data: {
        cart?: OrderItem[]; orderType?: string; deliveryFee?: number; customMessageFee?: number;
        neededDate?: string; neededTime?: string;
    } | null;
}

type Tab = "details" | "addresses" | "orders";

const TABS: { value: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    {value: "details", label: "My details", icon: UserIcon},
    {value: "addresses", label: "Addresses", icon: MapPin},
    {value: "orders", label: "Orders", icon: ClipboardList},
];

// pending — оплата не завершена (покупатель закрыл страницу Stripe): это не заказ, но и не ошибка
const STATUS: Record<string, { label: string; className: string }> = {
    paid: {label: "Paid", className: "bg-[#EAF5EC] text-[#2F6B3F]"},
    pending: {label: "Payment not completed", className: "bg-[#FFF1DE] text-[#9A5B13]"},
    failed: {label: "Payment failed", className: "bg-[#FEF3F2] text-[#B42318]"},
};

const INPUT = `${manrope.className} w-full h-12 px-4 rounded-xl bg-white text-[15px] text-[#12100F] placeholder:text-gray-400
    ring-1 ring-[#B8485B]/20 outline-none transition focus:ring-2 focus:ring-[#B8485B]/50`;
const LABEL = `${manrope.className} block text-sm font-semibold text-[#12100F] mb-1.5`;
const CARD = "rounded-2xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-[#B8485B]/10";
const PRIMARY_BTN = `${manrope.className} inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full main-button-color text-white text-sm font-semibold shadow-sm cursor-pointer transition hover:brightness-110 disabled:opacity-70 disabled:cursor-wait`;
const SECONDARY_BTN = `${manrope.className} inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full bg-white text-[#B8485B] text-sm font-semibold ring-1 ring-[#B8485B]/30 cursor-pointer transition hover:ring-[#B8485B]`;

const apiUrl = (path: string) => `${process.env.NEXT_PUBLIC_API_URL}${path}`;

async function sendJson<T>(path: string, method: "PUT" | "POST" | "DELETE", body?: unknown): Promise<T> {
    const res = await fetch(apiUrl(path), {
        method,
        credentials: "include",
        headers: body !== undefined ? {"Content-Type": "application/json"} : undefined,
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || data.error || "Something went wrong. Please try again.");
    return data as T;
}

function ErrorNote({children}: { children: React.ReactNode }) {
    return (
        <div role="alert" className="flex items-start gap-3 rounded-2xl bg-[#FEF3F2] ring-1 ring-[#B42318]/20 p-4">
            <AlertCircle className="w-5 h-5 shrink-0 text-[#B42318] mt-0.5" aria-hidden="true"/>
            <p className={`${manrope.className} text-sm text-[#912018]`}>{children}</p>
        </div>
    );
}

// ---------- Мои данные ----------

function DetailsTab({user, onSaved}: { user: User; onSaved: (u: Partial<User>) => void }) {
    const [editing, setEditing] = useState(false);
    const [fname, setFname] = useState(user.fname);
    const [lname, setLname] = useState(user.lname ?? "");
    const [phone, setPhone] = useState(user.phone ?? "");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [saved, setSaved] = useState(false);

    const start = () => {
        setFname(user.fname);
        setLname(user.lname ?? "");
        setPhone(user.phone ?? "");
        setError("");
        setSaved(false);
        setEditing(true);
    };

    const save = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        try {
            const data = await sendJson<Partial<User>>("/api/auth/check/me", "PUT", {fname, lname, phone});
            onSaved(data);
            setEditing(false);
            setSaved(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not save your details.");
        } finally {
            setSaving(false);
        }
    };

    const rows: { label: string; value: React.ReactNode }[] = [
        {label: "Name", value: `${user.fname} ${user.lname ?? ""}`.trim()},
        {label: "Email", value: user.email},
        {label: "Phone", value: user.phone || <span className="text-[#6F5E53]">Not added yet</span>},
        {
            label: "Signs in with",
            value: [user.has_password && "Email and password", user.has_google && "Google"].filter(Boolean).join(" · ") || "Email",
        },
    ];

    return (
        <div className={CARD}>
            <div className="flex items-center justify-between gap-4">
                <h2 className={`${raleway.className} text-xl font-bold text-[#12100F]`}>My details</h2>
                {!editing && (
                    <button type="button" onClick={start} className={SECONDARY_BTN}>
                        <Pencil className="w-4 h-4" aria-hidden="true"/> Edit
                    </button>
                )}
            </div>

            {saved && !editing && (
                <p role="status" className={`${manrope.className} mt-4 flex items-center gap-2 text-sm text-[#2F6B3F]`}>
                    <Check className="w-4 h-4" aria-hidden="true"/> Your details have been saved.
                </p>
            )}

            {editing ? (
                <form onSubmit={save} className="mt-6 space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="pf-fname" className={LABEL}>First name</label>
                            <input id="pf-fname" required maxLength={100} autoComplete="given-name"
                                   value={fname} onChange={(e) => setFname(e.target.value)} className={INPUT}/>
                        </div>
                        <div>
                            <label htmlFor="pf-lname" className={LABEL}>Last name</label>
                            <input id="pf-lname" maxLength={100} autoComplete="family-name"
                                   value={lname} onChange={(e) => setLname(e.target.value)} className={INPUT}/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="pf-phone" className={LABEL}>Phone</label>
                        <input id="pf-phone" type="tel" maxLength={30} autoComplete="tel" placeholder="+44 7…"
                               value={phone} onChange={(e) => setPhone(e.target.value)} className={INPUT}/>
                    </div>
                    <div>
                        <span className={LABEL}>Email</span>
                        <p className={`${manrope.className} text-[15px] text-[#3B302B]`}>{user.email}</p>
                        <p className={`${manrope.className} mt-1 text-xs text-[#6F5E53]`}>Your email is your login and can&apos;t be changed here.</p>
                    </div>
                    {error && <ErrorNote>{error}</ErrorNote>}
                    <div className="flex flex-wrap gap-3">
                        <button type="submit" disabled={saving} className={PRIMARY_BTN}>
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true"/> : <Check className="w-4 h-4" aria-hidden="true"/>}
                            {saving ? "Saving…" : "Save changes"}
                        </button>
                        <button type="button" onClick={() => setEditing(false)} disabled={saving} className={SECONDARY_BTN}>Cancel</button>
                    </div>
                </form>
            ) : (
                <dl className={`${manrope.className} mt-6 divide-y divide-[#F0E6E3]`}>
                    {rows.map((r) => (
                        <div key={r.label} className="grid gap-1 py-3 sm:grid-cols-[160px_1fr]">
                            <dt className="text-sm text-[#6F5E53]">{r.label}</dt>
                            <dd className="text-[15px] text-[#12100F] break-words">{r.value}</dd>
                        </div>
                    ))}
                </dl>
            )}
        </div>
    );
}

// ---------- Адреса ----------

type SavedPlace = { address: string; latitude: number; longitude: number };

// Форма выбора адреса — для добавления и правки
function AddressForm({id, label, initial = "", submitLabel, onSubmit, onCancel}: {
    id: string;
    label: string;
    initial?: string;
    submitLabel: string;
    onSubmit: (place: SavedPlace) => Promise<void>;
    onCancel: () => void;
}) {
    const [picked, setPicked] = useState<PickedPlace | null>(null);
    const [housenumber, setHouseNumber] = useState("");
    const [buildingName, setBuildingName] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!picked) {
            setError("Please find your address by postcode and select it from the list.");
            return;
        }
        setSaving(true);
        setError("");
        try {
            // Номер дома, введённый вручную, тоже входит в адрес
            await onSubmit({
                address: withBuildingName(formatAddress(picked, housenumber), buildingName),
                latitude: picked.latitude,
                longitude: picked.longitude,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not save the address.");
            setSaving(false);
        }
    };

    return (
        <form onSubmit={submit} className="space-y-4 rounded-xl bg-[#FBF7F6] p-5 ring-1 ring-[#B8485B]/15">
            <AddressPicker
                id={id}
                label={label}
                hint="Enter the postcode and press Find address."
                defaultValue={initial}
                autoFocus
                required
                withBuildingName
                onChange={(place, house, building) => {
                    setPicked(place);
                    setHouseNumber(house);
                    setBuildingName(building);
                    setError("");
                }}
            />
            {error && <ErrorNote>{error}</ErrorNote>}
            <div className="flex flex-wrap gap-3">
                <button type="submit" disabled={saving} className={PRIMARY_BTN}>
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true"/> : <Check className="w-4 h-4" aria-hidden="true"/>}
                    {saving ? "Saving…" : submitLabel}
                </button>
                <button type="button" disabled={saving} onClick={onCancel} className={SECONDARY_BTN}>Cancel</button>
            </div>
        </form>
    );
}

const ICON_BTN = "h-9 w-9 shrink-0 rounded-full flex items-center justify-center text-[#6F5E53] cursor-pointer transition hover:bg-[#F6EEEC] hover:text-[#B8485B] disabled:opacity-50";

function AddressesTab({user, onMainChanged}: { user: User; onMainChanged: (address: string) => void }) {
    const [extra, setExtra] = useState<ExtraAddress[] | null>(null);
    const [loadError, setLoadError] = useState(false);
    // Что сейчас открыто: форма нового адреса, правка основного или правка дополнительного (id)
    const [editing, setEditing] = useState<"new" | "main" | number | null>(null);
    const [notice, setNotice] = useState("");
    // Действие, ждущее подтверждения в модальном окне
    const [confirm, setConfirm] = useState<{ action: "main" | "delete"; address: ExtraAddress } | null>(null);
    // Данные окна не сбрасываются при закрытии — иначе текст сменился бы во время анимации
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [busy, setBusy] = useState(false);
    const [confirmError, setConfirmError] = useState("");
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        let cancelled = false;
        fetch(apiUrl("/api/user-addresses"), {credentials: "include"})
            .then((res) => {
                if (!res.ok) throw new Error(String(res.status));
                return res.json();
            })
            .then((data) => !cancelled && setExtra(Array.isArray(data) ? data : []))
            .catch(() => !cancelled && setLoadError(true));
        return () => {
            cancelled = true;
        };
    }, [attempt]);

    const open = (what: typeof editing) => {
        setEditing(what);
        setNotice("");
    };

    const ask = (action: "main" | "delete", address: ExtraAddress) => {
        setConfirm({action, address});
        setConfirmOpen(true);
        setConfirmError("");
        setNotice("");
    };

    const add = async (place: SavedPlace) => {
        const data = await sendJson<{ main?: true; address: string; id?: number }>("/api/user-addresses", "POST", place);
        if (data.main) onMainChanged(data.address);
        else setExtra((prev) => [...(prev ?? []), data as ExtraAddress]);
        setEditing(null);
        setNotice("Address added.");
    };

    const updateMain = async (place: SavedPlace) => {
        const data = await sendJson<{ address: string }>("/api/user-addresses/main", "PUT", place);
        onMainChanged(data.address);
        setEditing(null);
        setNotice("Main address updated.");
    };

    const updateExtra = (id: number) => async (place: SavedPlace) => {
        const data = await sendJson<{ id: number; address: string }>(`/api/user-addresses/${id}`, "PUT", place);
        setExtra((prev) => (prev ?? []).map((a) => (a.id === id ? {...a, address: data.address} : a)));
        setEditing(null);
        setNotice("Address updated.");
    };

    // Выполняется после подтверждения в модальном окне; при ошибке окно остаётся открытым
    const runConfirmed = async () => {
        if (!confirm) return;
        const {action, address: {id}} = confirm;
        setBusy(true);
        setConfirmError("");
        try {
            if (action === "main") {
                const data = await sendJson<{ address: string; previous: { id: number; address: string } | null }>(
                    `/api/user-addresses/${id}/main`, "POST"
                );
                onMainChanged(data.address);
                // Прежний основной адрес встаёт на место выбранного
                const previous = data.previous;
                setExtra((prev) => previous
                    ? (prev ?? []).map((a) => (a.id === id ? {...a, address: previous.address} : a))
                    : (prev ?? []).filter((a) => a.id !== id));
                setNotice("Main address changed. It will be used at checkout by default.");
            } else {
                await sendJson("/api/user-addresses/" + id, "DELETE");
                setExtra((prev) => (prev ?? []).filter((a) => a.id !== id));
                setNotice("Address deleted.");
            }
            setConfirmOpen(false);
        } catch (err) {
            setConfirmError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className={CARD}>
            <div className="flex items-center justify-between gap-4">
                <h2 className={`${raleway.className} text-xl font-bold text-[#12100F]`}>Delivery addresses</h2>
                {editing !== "new" && (
                    <button type="button" onClick={() => open("new")} className={SECONDARY_BTN}>
                        <Plus className="w-4 h-4" aria-hidden="true"/> Add address
                    </button>
                )}
            </div>
            <p className={`${manrope.className} mt-2 text-sm text-[#6F5E53]`}>
                Your main address is used at checkout by default. We deliver within London.
            </p>

            {notice && (
                <p role="status" className={`${manrope.className} mt-4 flex items-center gap-2 text-sm text-[#2F6B3F]`}>
                    <Check className="w-4 h-4" aria-hidden="true"/> {notice}
                </p>
            )}

            <ul className="mt-6 space-y-3">
                {/* Основной адрес */}
                {editing === "main" ? (
                    <li>
                        <AddressForm id="pf-main" label="Main address" initial={user.address ?? ""} submitLabel="Save address"
                                     onSubmit={updateMain} onCancel={() => setEditing(null)}/>
                    </li>
                ) : user.address ? (
                    <li className="flex items-start gap-3 rounded-xl bg-[#FBF7F6] p-4 ring-1 ring-[#B8485B]/20">
                        <Home className="w-5 h-5 shrink-0 text-[#B8485B] mt-0.5" aria-hidden="true"/>
                        <div className="min-w-0 flex-1">
                            <p className={`${manrope.className} text-[15px] text-[#12100F] break-words`}>{user.address}</p>
                            <span className={`${manrope.className} mt-1 inline-block rounded-full bg-[#B8485B]/10 px-2.5 py-0.5 text-xs font-semibold text-[#B8485B]`}>Main address</span>
                        </div>
                        <button type="button" onClick={() => open("main")} aria-label="Edit main address" className={ICON_BTN}>
                            <Pencil className="w-4 h-4"/>
                        </button>
                    </li>
                ) : (
                    editing !== "new" && (
                        <li className={`${manrope.className} rounded-xl border border-dashed border-[#B8485B]/30 p-5 text-center text-sm text-[#6F5E53]`}>
                            You haven&apos;t added an address yet. The first one you add becomes your main address.
                        </li>
                    )
                )}

                {extra === null && !loadError && <li><Skeleton className="h-16 w-full rounded-xl"/></li>}
                {loadError && (
                    <li>
                        <LoadError what="your other addresses" onRetry={() => {
                            setLoadError(false);
                            setAttempt((a) => a + 1);
                        }}/>
                    </li>
                )}

                {/* Дополнительные адреса */}
                {extra?.map((a) => editing === a.id ? (
                    <li key={a.id}>
                        <AddressForm id={`pf-addr-${a.id}`} label="Edit address" initial={a.address} submitLabel="Save address"
                                     onSubmit={updateExtra(a.id)} onCancel={() => setEditing(null)}/>
                    </li>
                ) : (
                    <li key={a.id} className="flex flex-wrap items-start gap-3 rounded-xl ring-1 ring-[#B8485B]/10 p-4">
                        <MapPin className="w-5 h-5 shrink-0 text-[#6F5E53] mt-0.5" aria-hidden="true"/>
                        <p className={`${manrope.className} min-w-0 flex-1 text-[15px] text-[#12100F] break-words`}>{a.address}</p>
                        <div className="flex shrink-0 items-center gap-1">
                            <button type="button" onClick={() => ask("main", a)}
                                    className={`${manrope.className} h-9 px-3 rounded-full text-sm font-semibold text-[#B8485B] cursor-pointer transition hover:bg-[#B8485B]/10`}>
                                Make main
                            </button>
                            <button type="button" onClick={() => open(a.id)} aria-label={`Edit address ${a.address}`} className={ICON_BTN}>
                                <Pencil className="w-4 h-4"/>
                            </button>
                            <button type="button" onClick={() => ask("delete", a)} aria-label={`Delete address ${a.address}`}
                                    className="h-9 w-9 shrink-0 rounded-full flex items-center justify-center text-[#6F5E53] cursor-pointer transition hover:bg-[#FEF3F2] hover:text-[#B42318]">
                                <Trash2 className="w-4 h-4"/>
                            </button>
                        </div>
                    </li>
                ))}

                {editing === "new" && (
                    <li>
                        <AddressForm id="pf-new" label="New address" submitLabel="Add address"
                                     onSubmit={add} onCancel={() => setEditing(null)}/>
                    </li>
                )}
            </ul>

            <ConfirmDialog
                open={confirmOpen}
                busy={busy}
                error={confirmError}
                onConfirm={runConfirmed}
                onClose={() => setConfirmOpen(false)}
                {...(confirm?.action === "delete"
                    ? {
                        title: "Delete this address?",
                        description: <><p className="font-semibold text-[#12100F]">{confirm.address.address}</p><p className="mt-2">It will be removed from your saved addresses. This can&apos;t be undone.</p></>,
                        confirmLabel: "Delete address",
                        busyLabel: "Deleting…",
                        tone: "danger" as const,
                    }
                    : {
                        title: "Make this your main address?",
                        description: <>
                            <p className="font-semibold text-[#12100F]">{confirm?.address.address}</p>
                            <p className="mt-2">It will be used at checkout by default.
                                {user.address && <> Your current main address <span className="text-[#12100F]">({user.address})</span> will move to your other addresses.</>}
                            </p>
                        </>,
                        confirmLabel: "Make main",
                        busyLabel: "Saving…",
                    })}
            />
        </div>
    );
}

// ---------- Заказы ----------

function OrdersTab() {
    const [orders, setOrders] = useState<Order[] | null>(null);
    const [failed, setFailed] = useState(false);
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        let cancelled = false;
        fetch(apiUrl("/api/order"), {credentials: "include"})
            .then((res) => {
                if (!res.ok) throw new Error(String(res.status));
                return res.json();
            })
            .then((data) => !cancelled && setOrders(Array.isArray(data) ? data : []))
            .catch(() => !cancelled && setFailed(true));
        return () => {
            cancelled = true;
        };
    }, [attempt]);

    if (failed) {
        return <div className={CARD}><LoadError what="your orders" onRetry={() => {
            setFailed(false);
            setAttempt((a) => a + 1);
        }}/></div>;
    }

    if (!orders) {
        return (
            <div className="space-y-4" aria-busy="true" aria-label="Loading orders">
                {Array.from({length: 3}).map((_, i) => <Skeleton key={i} className="h-36 w-full rounded-2xl"/>)}
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className={`${CARD} flex flex-col items-center text-center gap-3 py-12`}>
                <span className="w-14 h-14 rounded-full bg-[#B8485B]/10 text-[#B8485B] flex items-center justify-center">
                    <Package className="w-6 h-6" aria-hidden="true"/>
                </span>
                <h2 className={`${raleway.className} text-xl font-bold text-[#12100F]`}>No orders yet</h2>
                <p className={`${manrope.className} text-sm text-[#6F5E53]`}>When you place an order, it will appear here.</p>
                <Link href="/menu" className={`${PRIMARY_BTN} mt-2`}>Browse the menu</Link>
            </div>
        );
    }

    return (
        <ul className="space-y-4">
            {orders.map((order) => {
                const data = order.order_data ?? {};
                const items = data.cart ?? [];
                const status = STATUS[order.payment_status] ?? {label: order.payment_status, className: "bg-[#F6EEEC] text-[#3B302B]"};
                const delivery = data.orderType === "delivery";
                return (
                    <li key={order.id} className={CARD}>
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <p className={`${raleway.className} text-lg font-bold text-[#12100F]`}>Order #{order.id}</p>
                                <p className={`${manrope.className} text-sm text-[#6F5E53]`}>
                                    {new Date(order.created_at).toLocaleString("en-GB", {day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"})}
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className={`${manrope.className} inline-flex items-center gap-1.5 rounded-full bg-[#F6EEEC] px-3 py-1 text-xs font-semibold text-[#3B302B]`}>
                                    {delivery ? <Truck className="w-3.5 h-3.5" aria-hidden="true"/> : <Home className="w-3.5 h-3.5" aria-hidden="true"/>}
                                    {delivery ? "Delivery" : "Collection"}
                                    {readyLabel(data.neededDate, data.neededTime) && <> · {readyLabel(data.neededDate, data.neededTime)}</>}
                                </span>
                                <span className={`${manrope.className} rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}>{status.label}</span>
                            </div>
                        </div>

                        <ul className="mt-5 divide-y divide-[#F0E6E3]">
                            {items.map((item, i) => (
                                <li key={i} className="flex items-center gap-4 py-3">
                                    <OrderItemThumb src={item.main_image}/>
                                    <div className="min-w-0 flex-1">
                                        <p className={`${manrope.className} font-semibold text-[#12100F] truncate`}>{item.product_name}</p>
                                        <p className={`${manrope.className} text-xs text-[#6F5E53]`}>
                                            {[item.variantName, `× ${item.quantity}`].filter(Boolean).join(" · ")}
                                        </p>
                                        {item.custom_message && (
                                            <p className={`${manrope.className} text-xs text-[#9A5B13] truncate`}>“{item.custom_message}”</p>
                                        )}
                                    </div>
                                    <p className={`${manrope.className} text-sm font-semibold text-[#12100F] tabular-nums`}>
                                        £{formatPrice(Number(item.price) * Number(item.quantity))}
                                    </p>
                                </li>
                            ))}
                        </ul>

                        <dl className={`${manrope.className} mt-3 space-y-1 border-t border-[#F0E6E3] pt-4 text-sm`}>
                            {Number(data.deliveryFee) > 0 && (
                                <div className="flex justify-between text-[#6F5E53]"><dt>Delivery</dt><dd>£{formatPrice(data.deliveryFee)}</dd></div>
                            )}
                            {Number(data.customMessageFee) > 0 && (
                                <div className="flex justify-between text-[#6F5E53]"><dt>Cake messages</dt><dd>£{formatPrice(data.customMessageFee)}</dd></div>
                            )}
                            <div className="flex justify-between text-base font-bold text-[#12100F]"><dt>Total</dt><dd>£{formatPrice(order.total)}</dd></div>
                        </dl>
                    </li>
                );
            })}
        </ul>
    );
}

// ---------- Страница ----------

const Profile = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<Tab>("details");
    // Ссылка вида /profile?tab=addresses (например, из корзины) открывает нужную вкладку
    useEffect(() => {
        const requested = new URLSearchParams(window.location.search).get("tab");
        if (TABS.some((t) => t.value === requested)) setTab(requested as Tab);
    }, []);
    const [loggingOut, setLoggingOut] = useState(false);
    const router = useRouter();
    const {status: authStatus, setStatus} = useAuth();
    // Зависим только от «гость или нет»: переход unknown → user не должен перезагружать профиль
    const isGuest = authStatus === "guest";
    const [loadFailed, setLoadFailed] = useState(false);
    // Увеличивается по кнопке «Try again» — запускает проверку заново
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        // Уже известно, что это гость (например, сессия закончилась) — сразу на вход, без запроса
        if (isGuest) {
            router.replace("/login");
            return;
        }
        // Авторизация — httpOnly-cookie; без входа сервер вернёт user: null
        let cancelled = false;
        fetch(apiUrl("/api/auth/check/session"), {credentials: "include"})
            .then((res) => {
                if (!res.ok) throw new Error(`Profile responded ${res.status}`);
                return res.json();
            })
            .then(({user: data}) => {
                if (cancelled) return;
                if (!data) {
                    // replace, а не push: в истории не остаётся /profile, «назад» не возвращает сюда.
                    // Скелетон остаётся до перехода — содержимое профиля не мелькает
                    setStatus("guest");
                    router.replace("/login");
                    return;
                }
                setStatus("user");
                setUser(data);
                setLoading(false);
            })
            .catch(() => {
                if (!cancelled) {
                    setLoadFailed(true);
                    setLoading(false);
                }
            });
        return () => {
            cancelled = true;
        };
    }, [router, isGuest, setStatus, attempt]);

    const logout = async () => {
        setLoggingOut(true);
        // Cookie httpOnly — удалить её может только сервер
        await fetch(apiUrl("/api/login/logout"), {method: "POST", credentials: "include"}).catch(() => {});
        setStatus("guest");
        router.replace("/login");
    };

    const shell = (children: React.ReactNode) => (
        <div className="mt-24 my-container mx-auto">
            <div className="container mx-auto px-4 pt-6 pb-16">
                <div className="mx-auto max-w-4xl space-y-6">{children}</div>
            </div>
        </div>
    );

    if (loadFailed) {
        return shell(
            <div className={`${CARD} min-h-[300px] flex items-center justify-center`}>
                <LoadError what="your profile" onRetry={() => {
                    setLoadFailed(false);
                    setLoading(true);
                    setAttempt((a) => a + 1);
                }}/>
            </div>
        );
    }

    if (loading || !user) {
        return shell(
            <div aria-busy="true" aria-label="Loading profile" className="space-y-6">
                <div className="main-block-color rounded-3xl p-6 sm:p-8 flex items-center gap-4">
                    <Skeleton className="h-16 w-16 rounded-full"/>
                    <div className="space-y-2 flex-1"><Skeleton className="h-6 w-48"/><Skeleton className="h-4 w-64"/></div>
                </div>
                <Skeleton className="h-12 w-full rounded-full"/>
                <Skeleton className="h-64 w-full rounded-2xl"/>
            </div>
        );
    }

    const initials = ((user.fname?.[0] ?? "") + (user.lname?.[0] ?? "")).toUpperCase() || user.email[0]?.toUpperCase();
    const missing = !user.phone || !user.address;

    return shell(
        <>
            {/* Шапка профиля */}
            <div className="main-block-color rounded-3xl p-6 sm:p-8 flex flex-wrap items-center gap-4">
                <span className={`${raleway.className} h-16 w-16 shrink-0 rounded-full bg-[#B8485B] text-white text-xl font-bold flex items-center justify-center shadow-md`}>
                    {initials}
                </span>
                <div className="min-w-0 flex-1">
                    <p className={`${manrope.className} text-xs uppercase tracking-[0.18em] text-[#B8485B]`}>My account</p>
                    <h1 className={`${raleway.className} text-2xl sm:text-3xl font-bold text-[#12100F] truncate`}>
                        Hello, {user.fname}!
                    </h1>
                    <p className={`${manrope.className} text-sm text-[#6F5E53] truncate`}>{user.email}</p>
                </div>
                <button type="button" onClick={logout} disabled={loggingOut} className={SECONDARY_BTN}>
                    {loggingOut ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true"/> : <LogOut className="w-4 h-4" aria-hidden="true"/>}
                    Log out
                </button>
            </div>

            {/* Подсказка, если не хватает данных для оформления заказа (часто после входа через Google) */}
            {missing && (
                <div className={`${manrope.className} flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#FFF6E8] ring-1 ring-[#D18A2C]/25 p-4 text-sm text-[#7A4A12]`}>
                    <span>
                        Add your {[!user.phone && "phone number", !user.address && "delivery address"].filter(Boolean).join(" and ")} to check out faster.
                    </span>
                    <button type="button" onClick={() => setTab(!user.phone ? "details" : "addresses")}
                            className="font-semibold underline underline-offset-2 cursor-pointer">
                        Add now
                    </button>
                </div>
            )}

            {/* Вкладки */}
            <div role="tablist" aria-label="Profile sections" className="grid grid-cols-3 gap-1 rounded-full bg-white p-1 shadow-sm ring-1 ring-[#B8485B]/10">
                {TABS.map(({value, label, icon: Icon}) => {
                    const active = tab === value;
                    return (
                        <button
                            key={value}
                            type="button"
                            role="tab"
                            aria-selected={active}
                            onClick={() => setTab(value)}
                            className={`${manrope.className} inline-flex items-center justify-center gap-2 h-11 rounded-full text-sm font-semibold cursor-pointer transition-colors ${
                                active ? "main-button-color text-white shadow-sm" : "text-[#6F5E53] hover:text-[#12100F] hover:bg-[#FBF7F6]"
                            }`}
                        >
                            <Icon className="w-4 h-4" aria-hidden="true"/>
                            <span className="hidden sm:inline">{label}</span>
                            <span className="sm:hidden">{label.replace("My ", "")}</span>
                        </button>
                    );
                })}
            </div>

            <div role="tabpanel">
                {tab === "details" && <DetailsTab user={user} onSaved={(u) => setUser({...user, ...u})}/>}
                {tab === "addresses" && <AddressesTab user={user} onMainChanged={(address) => setUser({...user, address})}/>}
                {tab === "orders" && <OrdersTab/>}
            </div>
        </>
    );
};

export default Profile;
