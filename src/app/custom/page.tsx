"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function CustomOrderPage() {
    const [orderType, setOrderType] = useState<"standard" | "custom">("standard");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [size, setSize] = useState("");
    const [details, setDetails] = useState("");
    const [referenceFile, setReferenceFile] = useState<File | null>(null);

    const [message, setMessage] = useState("");
    const [showModal, setShowModal] = useState(false);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("email", email);
            formData.append("phone", phone);
            formData.append("orderType", orderType);
            if (orderType === "custom") {
                formData.append("date", date);
                formData.append("time", time);
                formData.append("size", size);
                formData.append("details", details);
                if (referenceFile) formData.append("referenceFile", referenceFile);
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/custom-order`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to submit order");

            setMessage("✅ Your order request has been sent! We will contact you soon.");
            setShowModal(true);

            setName(""); setEmail(""); setPhone("");
            setDate(""); setTime(""); setSize(""); setDetails(""); setReferenceFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (err: any) {
            setMessage(err.message || "Something went wrong");
            setShowModal(true);
        }
    };

    return (
        <div className="flex justify-center pt-24 pb-12">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-xl space-y-4 p-6 border rounded-lg bg-white shadow-md relative"
            >
                <h1 className="text-2xl font-bold text-center">Order Form</h1>
                <p className="text-center text-gray-600">
                    You can submit a standard inquiry or a custom order for cakes, pastries, etc.
                </p>

                <div className="flex justify-center space-x-4 mt-2">
                    <button
                        type="button"
                        onClick={() => setOrderType("standard")}
                        className={`px-4 py-2 rounded-xl border-2 transition-all font-medium cursor-pointer ${
                            orderType === "standard"
                                ? "bg-green-700 text-white border-green-700"
                                : "border-green-700 text-green-700 hover:bg-green-50"
                        }`}
                    >
                        Standard Inquiry
                    </button>

                    <button
                        type="button"
                        onClick={() => setOrderType("custom")}
                        className={`px-4 py-2 rounded-xl border-2 transition-all font-medium cursor-pointer ${
                            orderType === "custom"
                                ? "bg-green-700 text-white border-green-700"
                                : "border-green-700 text-green-700 hover:bg-green-50"
                        }`}
                    >
                        Custom Order
                    </button>
                </div>


                <Input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <Input
                    type="email"
                    placeholder="Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Input
                    type="text"
                    placeholder="Phone (optional)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />

                {orderType === "custom" && (
                    <div className="space-y-3 mt-2">
                        <div className="flex flex-col space-y-2">
                            <label className="text-sm font-medium">Time of delivery (Date Required)</label>
                            <div className="flex space-x-2">
                                <DatePicker
                                    selected={date ? new Date(date) : null}
                                    onChange={(d: Date | null) => {
                                        if (d) setDate(d.toISOString().split("T")[0]);
                                    }}
                                    dateFormat="yyyy-MM-dd"
                                    minDate={new Date()}
                                    className="w-full px-3 py-2 border rounded-lg cursor-pointer selection-none"
                                    onChangeRaw={(e) => e?.preventDefault()}
                                />


                                <DatePicker
                                    selected={time ? new Date(`1970-01-01T${time}`) : null}
                                    onChange={(d: Date | null) => {
                                        if (d) setTime(d.toTimeString().slice(0, 5));
                                    }}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={30}
                                    timeCaption="Time"
                                    dateFormat="HH:mm"
                                    className="w-full px-3 py-2 border rounded-lg cursor-pointer selection-none"
                                    onChangeRaw={(e) => e?.preventDefault()}
                                />
                            </div>


                        </div>
                        <Input
                            type="text"
                            placeholder="Size (e.g., 6-inch, 1kg)"
                            value={size}
                            onChange={(e) => setSize(e.target.value)}
                            required
                        />
                        <Textarea
                            placeholder="Describe your custom order (flavor, design, special requests)"
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            rows={4}
                            required
                        />
                        <div>
                            <label className="block text-sm font-medium mb-1">Upload reference image (optional)</label>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={(e) => setReferenceFile(e.target.files?.[0] || null)}
                                accept="image/*"
                                className="w-full border p-2 rounded-md"
                            />
                        </div>
                    </div>
                )}

                <Button type="submit" className="w-full mt-2 bg-green-700 text-white border-green-700 hover:bg-green-700 cursor-pointer">Submit Order</Button>

                {showModal && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center">
                            <p>{message}</p>
                            <Button
                                className="mt-4 w-full bg-green-700 text-white border-green-700 hover:bg-green-700 cursor-pointer"
                                onClick={() => setShowModal(false)}
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
