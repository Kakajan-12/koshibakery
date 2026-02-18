"use client";

import {manrope, quicksand, raleway, sora} from "@/app/fonts";
import {Button} from "@/components/ui/button";
import React, {useEffect, useMemo, useState} from "react";
import Image from "next/image";
import {useCart} from "@/app/context/CartContext";
import Link from "next/link";
import {FaMinus, FaPlus, FaRegTrashCan} from "react-icons/fa6";
import {useRouter} from "next/navigation";
import {MdOutlineMail} from "react-icons/md";
import {FiPhone} from "react-icons/fi";

interface ContactData {
    id: number;
    address?: string;
    phone?: string;
    mail?: string;
    map?: string;
}

interface Address {
    doorNumber: string;
    addressLine1: string;
    addressLine2?: string;
    buildingName?: string;
    postcode: string;
    city: string;
}

const Cart = () => {
    const SHOP_COORDS = {lat: 51.518648926574, lng: -0.16809783068325745};
    const {cart, removeFromCart, clearCart, updateQuantity} = useCart();
    const [customMessages, setCustomMessages] = useState<{ [key: string]: string }>({});
    const [showInput, setShowInput] = useState<{ [key: string]: boolean }>({});
    const [orderType, setOrderType] = useState<"delivery" | "collect">("delivery");
    const [addresses, setAddresses] = useState<string[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<string | "">("");
    const [deliveryFee, setDeliveryFee] = useState(0);
    const [isGuest, setIsGuest] = useState(false);
    const [guestData, setGuestData] = useState({
        name: "",
        email: "",
        phone: "",
    });
    const [guestAddress, setGuestAddress] = useState<Address>({
        doorNumber: "",
        addressLine1: "",
        addressLine2: "",
        buildingName: "",
        postcode: "",
        city: "",
    });
    const [cityError, setCityError] = useState<string>("");
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [contact, setContact] = useState<ContactData | null>(null);
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(true);
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const toggleCustomMessage = (key: string) => {
        setShowInput(prev => ({...prev, [key]: !prev[key]}));
    };

    const handleInputChange = (key: string, value: string) => {
        setCustomMessages(prev => ({...prev, [key]: value}));
    };

    const validateCity = (city: string): boolean => {
        const londonVariants = ['london', 'londra', 'лондон'];
        const normalizedCity = city.toLowerCase().trim();
        return londonVariants.some(variant => normalizedCity.includes(variant));
    };

    const formatFullAddress = (address: Address): string => {
        const parts = [
            address.doorNumber,
            address.addressLine1,
            address.addressLine2,
            address.buildingName,
            address.postcode,
            address.city
        ].filter(part => part && part.trim() !== '');

        return parts.join(', ');
    };

    const validateAddress = (): boolean => {
        if (orderType !== "delivery") return true;

        if (!guestAddress.doorNumber || !guestAddress.addressLine1 || !guestAddress.postcode || !guestAddress.city) {
            alert("Please fill in all required address fields");
            return false;
        }

        if (!validateCity(guestAddress.city)) {
            setCityError("We only deliver within London area");
            return false;
        }

        setCityError("");
        return true;
    };

    const getDistanceInMiles = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * (Math.PI / 180)) *
            Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distanceKm = R * c;
        return distanceKm * 1.3;
    };

    const getCoordinatesFromAddress = async (address: string) => {
        try {
            const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(address)}&limit=1`);
            const data = await res.json();
            if (data.features && data.features.length > 0) {
                const [lon, lat] = data.features[0].geometry.coordinates;
                return {lat, lon};
            }
        } catch (err) {
            console.error("Photon error:", err);
        }
        return null;
    };

    const mapElement = useMemo(() => {
        if (!contact?.map) return <p className="text-gray-500 text-center">Map not available</p>;

        return <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: contact.map }} />;
    }, [contact?.map]);

    useEffect(() => {
        const fetchContact = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`);
                if (!res.ok) throw new Error('Ошибка при получении данных');
                const data: ContactData[] = await res.json();
                if (data.length > 0) setContact(data[0]);
            } catch (err) {
                console.error('Ошибка загрузки контактов:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchContact();
    }, []);

    useEffect(() => {
        const checkAuthAndFetchAddresses = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setIsAuthorized(false);
                setAuthLoading(false);
                return;
            }

            try {
                const meRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/check/me`, {
                    headers: {Authorization: `Bearer ${token}`},
                });

                if (!meRes.ok) {
                    localStorage.removeItem("token");
                    setIsAuthorized(false);
                    setAuthLoading(false);
                    return;
                }

                setIsAuthorized(true);

                const meData = await meRes.json();
                let mainAddr: string | null = meData.address || null;
                let extraAddrs: string[] = [];

                try {
                    const addrRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user-addresses`, {
                        headers: {Authorization: `Bearer ${token}`},
                    });

                    if (addrRes.ok) {
                        const addrData = await addrRes.json();
                        extraAddrs = addrData.map((a: { address: string }) => a.address);
                    }
                } catch (addrErr) {
                    console.error("Error fetching additional addresses:", addrErr);
                }

                const allAddresses = mainAddr ? [mainAddr, ...extraAddrs] : extraAddrs;
                setAddresses(allAddresses);

                if (!selectedAddress && allAddresses.length > 0) {
                    setSelectedAddress(allAddresses[0]);
                }

            } catch (err) {
                console.error("Auth check error:", err);
                setIsAuthorized(false);
                localStorage.removeItem("token");
            } finally {
                setAuthLoading(false);
            }
        };

        checkAuthAndFetchAddresses();
    }, []);

    useEffect(() => {
        if (orderType !== "delivery" || !selectedAddress) {
            setDeliveryFee(0);
            return;
        }

        const calculateDeliveryFee = async () => {
            try {
                const coords = await getCoordinatesFromAddress(selectedAddress);
                if (coords) {
                    const miles = getDistanceInMiles(
                        SHOP_COORDS.lat,
                        SHOP_COORDS.lng,
                        coords.lat,
                        coords.lon
                    );
                    const roadMiles = miles * 1.3;
                    const fee = Math.round(roadMiles * 2 * 100) / 100;
                    setDeliveryFee(fee);
                } else {
                    setDeliveryFee(0);
                }
            } catch (err) {
                console.error("Error calculating delivery fee:", err);
                setDeliveryFee(0);
            }
        };

        calculateDeliveryFee();
    }, [selectedAddress, orderType]);

    useEffect(() => {
        if (orderType === "collect") {
            setDeliveryFee(0);
            setGuestAddress({
                doorNumber: "",
                addressLine1: "",
                addressLine2: "",
                buildingName: "",
                postcode: "",
                city: "",
            });
            return;
        }
    }, [orderType]);

    useEffect(() => {
        if (orderType === "delivery" && guestAddress.addressLine1 && guestAddress.city && validateCity(guestAddress.city)) {
            const fullAddress = formatFullAddress(guestAddress);
            calculateDeliveryFeeFromAddress(fullAddress);
        } else {
            setDeliveryFee(0);
        }
    }, [guestAddress]);

    const calculateDeliveryFeeFromAddress = async (fullAddress: string) => {
        try {
            const coords = await getCoordinatesFromAddress(fullAddress);
            if (coords) {
                const miles = getDistanceInMiles(
                    SHOP_COORDS.lat,
                    SHOP_COORDS.lng,
                    coords.lat,
                    coords.lon
                );
                const roadMiles = miles * 1.3;
                const fee = Math.round(roadMiles * 2 * 100) / 100;
                setDeliveryFee(fee);
            } else {
                setDeliveryFee(0);
            }
        } catch (err) {
            console.error("Error calculating delivery fee:", err);
            setDeliveryFee(0);
        }
    };

    const customMessageCount = Object.values(showInput).filter(Boolean).length;
    const customMessageFee = customMessageCount * 10;
    const grandTotal = total + (orderType === "delivery" ? deliveryFee : 0) + customMessageFee;

    const handleCheckout = async () => {
        const token = localStorage.getItem("token");

        if (!isAuthorized) {
            router.push("/login");
            return;
        }

        const cartWithMessages = cart.map(item => {
            const key = `${item.id}-${item.variantName}`;
            return {
                ...item,
                custom_message: customMessages[key] || null
            };
        });

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/create-checkout-session`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        cart: cartWithMessages,
                        deliveryFee,
                        customMessageFee,
                        orderType,
                        selectedAddress,
                        total: grandTotal,
                    }),
                }
            );

            if (res.status === 401) {
                localStorage.removeItem("token");
                setIsGuest(true);
                return;
            }

            const data = await res.json();
            if (data.url) window.location.href = data.url;
        } catch (err) {
            console.error(err);
        }
    };

    const handleGuestCheckout = async () => {
        if (!guestData.email || !guestData.name || !guestData.phone) {
            alert("Please fill all required fields");
            return;
        }

        if (orderType === "delivery" && !validateAddress()) {
            return;
        }

        const cartWithMessages = cart.map(item => {
            const key = `${item.id}-${item.variantName}`;
            return {
                ...item,
                custom_message: customMessages[key] || null
            };
        });

        const fullAddress = orderType === "delivery" ? formatFullAddress(guestAddress) : "";

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/create-checkout-session/guest`,
                {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        cart: cartWithMessages,
                        guest: {
                            ...guestData,
                            address: fullAddress
                        },
                        deliveryFee,
                        customMessageFee,
                        orderType,
                        total: grandTotal,
                    }),
                }
            );

            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (err) {
            console.error("Guest checkout error:", err);
        }
    };


    if (cart.length === 0) {
        return (
            <div className="h-screen">
                <div className="container mx-auto px-4 h-full">
                    <div className="flex justify-center items-center h-full">
                        <div
                            className="mt-4 flex flex-col items-center justify-center h-50 lg:h-60"
                            style={{
                                backgroundImage: "url('/images/shopping-cart.svg')",
                                backgroundSize: "contain",
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "bottom",
                            }}
                        >
                            <h6
                                className={`${sora.className} pt-6 text-white text-center text-2xl mb-3 sm:text-3xl lg:text-4xl xl:text-5xl font-medium`}
                            >
                                Your cart is empty!
                            </h6>

                            <div className="flex items-center py-4 md:justify-center max-w-96 w-full">
                                <Link href="/menu"
                                      className="border-2 bg-white text-center main-text-color w-full rounded-full font-bold py-3 text-lg md:text-xl cursor-pointer">
                                    Order Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="my-28">
            <div className="container mx-auto px-4">
                <div className="main-block-color p-8 rounded-xl">
                    <div className="mb-6">
                        <h2 className={`${raleway.className} text-2xl lg:text-4xl font-bold text-center`}>Your Cart</h2>
                        <p className={`${manrope.className} text-sm md:text-md text-center main-text-color`}>Here’s what
                            you’ve
                            selected — sweet choices!</p>
                        <p className={`${manrope.className} text-sm md:text-md text-center main-text-color`}>Review your
                            items
                            below before proceeding to checkout. You can update quantities or remove items as
                            needed.</p>
                    </div>
                    <div className="flex justify-center">
                        <div className="space-y-2 max-w-4xl w-full">
                            {cart.map((item, index) => {
                                const key = `${item.id}-${item.variantName}`;
                                return (
                                    <div key={key} className="border-2 main-border-color p-2 rounded-md space-y-2">
                                        <div
                                            className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                                            <div className="flex space-x-4 w-full">
                                                <Image src={item.main_image} alt={item.product_name} width={180}
                                                       height={80} className="rounded-md w-28 h-28"/>
                                                <div className="flex flex-col justify-between min-h-full">
                                                    <h3 className={`${raleway.className} font-semibold text-lg`}>{item.product_name}</h3>
                                                    <p className={`${manrope.className} text-sm main-text-color italic`}>Size: {item.variantName}</p>
                                                    <p className={`${sora.className} text-md font-bold`}>£{item.price}</p>
                                                </div>
                                            </div>
                                            <div
                                                className="flex justify-between items-center space-x-4 w-full md:w-fit">
                                                <div className="flex items-center border rounded-sm overflow-hidden">
                                                    <button
                                                        className="px-3 py-1 contact-color cursor-pointer text-green-800 h-8"
                                                        onClick={() => updateQuantity(item.id, item.variantName, Math.max(item.quantity - 1, 1))}
                                                    >
                                                        <FaMinus/>
                                                    </button>
                                                    <div
                                                        className="w-10 h-8 text-center bg-white flex items-center justify-center">
                                                        <p className={`${manrope.className}`}>{item.quantity}</p></div>
                                                    <button
                                                        className="px-3 py-1 contact-color cursor-pointer text-green-800 h-8"
                                                        onClick={() => updateQuantity(item.id, item.variantName, item.quantity + 1)}
                                                    >
                                                        <FaPlus/>
                                                    </button>
                                                </div>
                                                <Button className="cursor-pointer" variant="destructive"
                                                        onClick={() => removeFromCart(item.id, item.variantName)}>
                                                    <FaRegTrashCan/>
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="flex flex-col space-y-2">
                                            <div className="flex items-center">
                                                <input
                                                    id={`custom-message-${index}`}
                                                    type="checkbox"
                                                    checked={!!showInput[key]}
                                                    onChange={() => toggleCustomMessage(key)}
                                                    className="h-5 w-5 appearance-none rounded border-2 main-border-color checked:bg-[#B8485B] checked:border-[#B8485B] transition-all duration-200 cursor-pointer"
                                                />
                                                <label htmlFor={`custom-message-${index}`}
                                                       className={`${manrope.className} ml-2 text-sm text-gray-900 cursor-pointer`}>
                                                    Custom message
                                                </label>
                                            </div>
                                            {showInput[key] && (
                                                <input
                                                    type="text"
                                                    placeholder="Enter your message..."
                                                    value={customMessages[key] || ""}
                                                    onChange={e => handleInputChange(key, e.target.value)}
                                                    className={`${manrope.className} border main-border-color rounded-lg p-2 w-full outline-none focus:ring-1 focus:ring-[#B8485B]`}
                                                />
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="flex justify-center">
                        {authLoading ? (
                            <p className={`${manrope.className} text-gray-500 text-sm`}>
                                Checking authorization...
                            </p>
                        ) : isAuthorized ? (
                            <div className="max-w-4xl w-full">
                                <div className="mt-4 flex space-x-4">
                                    <button
                                        onClick={() => setOrderType("delivery")}
                                        className={`${manrope.className} px-3 py-1 rounded-full border-2 transition-all cursor-pointer ${
                                            orderType === "delivery"
                                                ? "main-button-color text-white main-border-color"
                                                : "main-border-color hover:text-white hover:bg-[#B8485B]"
                                        }`}
                                    >
                                        Delivery
                                    </button>
                                    <button
                                        onClick={() => setOrderType("collect")}
                                        className={`${manrope.className} px-3 py-1 rounded-full border-2 transition-all cursor-pointer ${
                                            orderType === "collect"
                                                ? "main-button-color text-white main-border-color"
                                                : "main-border-color hover:text-white hover:bg-[#B8485B]"
                                        }`}
                                    >
                                        Collect order
                                    </button>
                                </div>

                                {orderType === "delivery" && (
                                    <div className="mt-2 flex flex-col items-start main-border-color">
                                        <label
                                            className={`${manrope.className} text-base md:text-md font-semibold ml-1 mb-2`}
                                        >
                                            Choose delivery address:
                                        </label>

                                        {addresses.length > 0 ? (
                                            <select
                                                value={selectedAddress}
                                                onChange={(e) => setSelectedAddress(e.target.value)}
                                                className={`${manrope.className} border-[#833B45] border-2 rounded-lg p-2 w-full max-w-md text-xs sm:text-sm cursor-pointer`}
                                            >
                                                {addresses.map((addr, i) => (
                                                    <option key={i} value={addr}>
                                                        {addr}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <p className={`${manrope.className} text-yellow-600 text-sm`}>
                                                No addresses found. Please add an address in your profile.
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div></div>
                        )}
                        {isGuest && (
                            <div
                                className="bg-white rounded-xl shadow-lg w-full max-w-4xl mt-6 overflow-hidden flex flex-col">
                                <div className="p-6 overflow-y-auto flex-1">
                                    <h3 className={`${raleway.className} text-xl font-bold text-center mb-4`}>
                                        Guest checkout
                                    </h3>

                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            handleGuestCheckout();
                                        }}
                                        className="space-y-3"
                                    >
                                        <div className={`${manrope.className} flex flex-col gap-4`}>
                                            <div>
                                                <input
                                                    placeholder="Full name"
                                                    className={`${manrope.className} border main-border-color rounded p-2 w-full`}
                                                    type="text"
                                                    value={guestData.name}
                                                    onChange={e => setGuestData({...guestData, name: e.target.value})}
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <input
                                                    type="email"
                                                    placeholder="Email"
                                                    className={`${manrope.className} border main-border-color rounded p-2 w-full`}
                                                    value={guestData.email}
                                                    onChange={e => setGuestData({...guestData, email: e.target.value})}
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <input
                                                    placeholder="Phone"
                                                    type="text"
                                                    className={`${manrope.className} border main-border-color rounded p-2 w-full`}
                                                    value={guestData.phone}
                                                    onChange={e => setGuestData({...guestData, phone: e.target.value})}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <p className={`${manrope.className} text-sm text-gray-600 mb-2`}>
                                                Choose order type:
                                            </p>
                                            <div className="flex space-x-3">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setOrderType("delivery");
                                                    }}
                                                    className={`${manrope.className} px-4 py-2 rounded-full border-2 transition-all cursor-pointer flex-1 ${
                                                        orderType === "delivery"
                                                            ? "main-button-color text-white main-border-color"
                                                            : "main-border-color hover:text-white hover:bg-[#B8485B]"
                                                    }`}
                                                >
                                                    Delivery
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setOrderType("collect");
                                                        setGuestAddress({
                                                            doorNumber: "",
                                                            addressLine1: "",
                                                            addressLine2: "",
                                                            buildingName: "",
                                                            postcode: "",
                                                            city: "",
                                                        });
                                                        setDeliveryFee(0);
                                                    }}
                                                    className={`${manrope.className} px-4 py-2 rounded-full border-2 transition-all cursor-pointer flex-1 ${
                                                        orderType === "collect"
                                                            ? "main-button-color text-white main-border-color"
                                                            : "main-border-color hover:text-white hover:bg-[#B8485B]"
                                                    }`}
                                                >
                                                    Collect
                                                </button>
                                            </div>
                                        </div>

                                        {orderType === "delivery" && (
                                            <div className="space-y-4">
                                                <h4 className="font-semibold text-md">Delivery Address</h4>

                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="text-sm text-gray-600">Door Number *</label>
                                                        <input
                                                            type="text"
                                                            value={guestAddress.doorNumber}
                                                            onChange={(e) => setGuestAddress({...guestAddress, doorNumber: e.target.value})}
                                                            className="border main-border-color rounded p-2 w-full"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm text-gray-600">Postcode *</label>
                                                        <input
                                                            type="text"
                                                            value={guestAddress.postcode}
                                                            onChange={(e) => setGuestAddress({...guestAddress, postcode: e.target.value})}
                                                            className="border main-border-color rounded p-2 w-full"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="text-sm text-gray-600">Address Line 1 *</label>
                                                    <input
                                                        type="text"
                                                        value={guestAddress.addressLine1}
                                                        onChange={(e) => setGuestAddress({...guestAddress, addressLine1: e.target.value})}
                                                        className="border main-border-color rounded p-2 w-full"
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label className="text-sm text-gray-600">Address Line 2 (optional)</label>
                                                    <input
                                                        type="text"
                                                        value={guestAddress.addressLine2}
                                                        onChange={(e) => setGuestAddress({...guestAddress, addressLine2: e.target.value})}
                                                        className="border main-border-color rounded p-2 w-full"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="text-sm text-gray-600">Building Name (optional)</label>
                                                    <input
                                                        type="text"
                                                        value={guestAddress.buildingName}
                                                        onChange={(e) => setGuestAddress({...guestAddress, buildingName: e.target.value})}
                                                        className="border main-border-color rounded p-2 w-full"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="text-sm text-gray-600">City *</label>
                                                    <input
                                                        type="text"
                                                        value={guestAddress.city}
                                                        onChange={(e) => {
                                                            setGuestAddress({...guestAddress, city: e.target.value});
                                                            setCityError("");
                                                        }}
                                                        className={`border rounded p-2 w-full ${
                                                            cityError ? 'border-red-500' : 'main-border-color'
                                                        }`}
                                                        placeholder="London"
                                                        required
                                                    />
                                                    {cityError && (
                                                        <p className="text-red-500 text-sm mt-1">{cityError}</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {orderType === "collect" && (
                                         <div>
                                             <div className="flex flex-col justify-center space-y-3">
                                                 <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-2">
                                                     <div className="flex contact-color py-2 px-3 rounded-md space-x-2 xl:h-full w-full items-center">
                                                         <MdOutlineMail className="w-12 h-12 md:w-16 md:h-16 flex-shrink-0" />
                                                         <div className="flex flex-col justify-center">
                                                             <div
                                                                 className={`${sora.className} font-bold text-lg md:text-xl lg:text-2xl`}
                                                             >
                                                                 E-mail
                                                             </div>
                                                             {contact?.mail ? (
                                                                 <a
                                                                     href={`mailto:${contact.mail}`}
                                                                     className={`${quicksand.className} text-md font-light md:text-lg lg:text-xl`}
                                                                 >
                                                                     {contact.mail}
                                                                 </a>
                                                             ) : (
                                                                 <p
                                                                     className={`${quicksand.className} text-md font-light md:text-lg lg:text-xl`}
                                                                 >
                                                                     —
                                                                 </p>
                                                             )}
                                                         </div>
                                                     </div>

                                                     <div className="flex contact-color py-2 px-3 rounded-md space-x-2 xl:h-full w-full items-center">
                                                         <FiPhone className="w-10 h-10 md:w-14 md:h-14 flex-shrink-0" />
                                                         <div className="flex flex-col justify-center">
                                                             <div
                                                                 className={`${sora.className} font-bold text-lg md:text-xl lg:text-2xl`}
                                                             >
                                                                 Phone
                                                             </div>
                                                             {contact?.phone ? (
                                                                 <a
                                                                     href={`tel:${contact.phone}`}
                                                                     className={`${quicksand.className} text-md font-light md:text-lg lg:text-xl`}
                                                                 >
                                                                     {contact.phone}
                                                                 </a>
                                                             ) : (
                                                                 <p
                                                                     className={`${quicksand.className} text-md font-light md:text-lg lg:text-xl`}
                                                                 >
                                                                     —
                                                                 </p>
                                                             )}

                                                         </div>
                                                     </div>
                                                 </div>

                                                 {contact?.map ? (
                                                     <div className="relative w-full h-[250px] rounded-lg overflow-hidden">
                                                         <div
                                                             dangerouslySetInnerHTML={{ __html: contact.map }}
                                                             className="w-full h-full"
                                                         />

                                                         <a
                                                             href="https://www.google.com/maps/dir/?api=1&destination=185+Edgware+Rd+London+W2+1ET"
                                                             target="_blank"
                                                             rel="noopener noreferrer"
                                                             className="absolute inset-0 z-10"
                                                         />
                                                     </div>
                                                 ) : (
                                                     <p className="text-gray-500 text-center">Map not available</p>
                                                 )}

                                             </div>
                                         </div>
                                        )}

                                        <div className="flex justify-end space-x-2 p-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="w-28 cursor-pointer"
                                                onClick={() => setIsGuest(false)}
                                            >
                                                Cancel
                                            </Button>

                                            <Button
                                                type="submit"
                                                className="w-28 main-button-color text-white cursor-pointer"
                                            >
                                                Pay
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-10 flex flex-col items-end space-y-2">
                        <p className={`${manrope.className} font-semibold lg:text-lg`}>Price: £{total}</p>
                        {orderType === "delivery" && deliveryFee > 0 && (
                            <p className={`${manrope.className} font-semibold lg:text-lg`}>
                                Delivery: £{deliveryFee.toFixed(2)}
                            </p>
                        )}

                        {customMessageFee > 0 && (
                            <p className={`${manrope.className} font-semibold lg:text-lg`}>
                                Custom messages: £{customMessageFee}
                            </p>
                        )}
                        <p className={`${manrope.className} text-md lg:text-2xl font-bold`}>
                            Total: £{grandTotal.toFixed(2)}
                        </p>

                        {isAuthorized ? (
                            <div className="flex space-x-4">
                                <Button
                                    className={`${manrope.className} border-2 main-border-color main-block-color cursor-pointer main-text-color`}
                                    variant="outline"
                                    onClick={clearCart}
                                >
                                    Clear Cart
                                </Button>
                                <Button
                                    className={`${manrope.className} main-button-color text-white cursor-pointer hover:bg-[#833B45]`}
                                    onClick={handleCheckout}
                                >
                                    Checkout
                                </Button>
                            </div>
                        ) : (
                            <div className="flex space-x-4">
                                <Button
                                    className={`${manrope.className} main-button-color text-white cursor-pointer hover:bg-[#833B45]`}
                                    onClick={() => router.push('/login')}
                                >
                                    Login
                                </Button>
                                <Button
                                    className={`${manrope.className} border-2 main-border-color cursor-pointer`}
                                    variant="outline"
                                    onClick={() => setIsGuest(true)}
                                >
                                    Pay as guest
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;