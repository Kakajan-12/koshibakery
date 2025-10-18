'use client';

import {useEffect, useState} from "react";
import {quicksand, sora} from "@/app/fonts";
import {IoLocationOutline} from "react-icons/io5";
import {FiPhone, FiFacebook, FiLinkedin} from "react-icons/fi";
import {MdOutlineMail} from "react-icons/md";
import {FaInstagram} from "react-icons/fa6";
import {RiTwitterXLine} from "react-icons/ri";
import Link from "next/link";
import Image from "next/image";

interface Contact {
    id: number;
    address: string;
    phone: string;
    mail: string;
    map: string;
}

interface SocialLink {
    id: number;
    icon: string;
    url: string;
}

export default function Footer() {
    const [contact, setContact] = useState<Contact | null>(null);
    const [links, setLinks] = useState<SocialLink[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [contactRes, linksRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {cache: "no-store"}),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/links`, {cache: "no-store"}),
                ]);

                if (!contactRes.ok || !linksRes.ok) throw new Error("Ошибка загрузки данных");

                const contactData = await contactRes.json();
                const linksData = await linksRes.json();

                setContact(contactData[0]);
                setLinks(linksData);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="text-center py-10 text-white">Loading...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

    return (
        <div className="footer py-10">
            <div className="container mx-auto px-4">
                <div className="pt-20 pb-10">
                    <div className={`${sora.className} text-white text-lg font-bold mb-3 lg:text-2xl xl:text-5xl`}>
                        Koşi bakery
                    </div>

                    <div className="lg:flex lg:justify-between lg:space-x-4">
                        <div className="mb-4 space-y-4 lg:w-2/3">
                            <p className={`${quicksand.className} text-white text-xs sm:text-sm`}>
                                The name “Koşi Bakery”
                                carries personal significance. It originates from the small, culturally rich town of
                                Koşi in
                                Turkmenistan — the birthplace of our founder and the source of much of our culinary
                                inspiration. We honour these roots by incorporating time-honoured recipes and techniques
                                into many of our creations.
                            </p>

                            <div className="hidden space-y-4 lg:block">
                                <ContactItem icon={<IoLocationOutline className="w-5 flex-shrink-0"/>}
                                             text={contact?.address}/>
                                <ContactItem icon={<FiPhone className="w-5 flex-shrink-0"/>} text={contact?.phone}/>
                                <ContactItem icon={<MdOutlineMail className="w-5 flex-shrink-0"/>}
                                             text={contact?.mail}/>
                            </div>
                        </div>

                        <div className="flex justify-between flex-col-reverse md:flex-row">
                            <div className="flex flex-col justify-between space-y-4">
                                <div className="space-y-4 lg:hidden">
                                    <ContactItem icon={<IoLocationOutline className="w-5 flex-shrink-0"/>}
                                                 text={contact?.address}/>
                                    <ContactItem icon={<FiPhone className="w-5 flex-shrink-0"/>} text={contact?.phone}/>
                                    <ContactItem icon={<MdOutlineMail className="w-5 flex-shrink-0"/>}
                                                 text={contact?.mail}/>
                                </div>

                                <div className="flex space-x-3 lg:hidden">
                                    <SocialLinks links={links}/>
                                </div>
                            </div>

                            <div className="space-y-2 flex flex-col lg:w-full min-w-32">
                                <div className={`${sora.className} text-white font-semibold text-md`}>Quick Links</div>
                                <LinkItem href="/about">About Us</LinkItem>
                                <LinkItem href="/contact">Contact Us</LinkItem>
                                <LinkItem href="/menu">Menu</LinkItem>
                                <LinkItem href="/">Main</LinkItem>

                                <div className="hidden flex space-x-3 lg:flex">
                                    <SocialLinks links={links}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center items-center space-x-1 pb-2 space-x-4">
                    <div className={`${sora.className} text-white`}>
                        All rights reserved
                    </div>
                    <div>
                        <Link className="text-white" href="/termsandconditions">Terms and Conditions</Link>
                    </div>
                    <div className="flex items-center space-x-1">
                        <p className="text-white">Powered by</p>
                        <Image src="/hebent_logo.svg" alt="hebent_logo" width={50} height={50} className="w-5"/>
                        <div className="text-white">Hebent Tech</div>
                    </div>

                </div>
            </div>
        </div>
    );
}

function ContactItem({icon, text}: { icon: React.ReactNode; text?: string }) {
    return (
        <div className="flex items-start space-x-2">
            <span className="text-white flex-shrink-0">{icon}</span>
            <p className={`${quicksand.className} text-white text-sm`}>{text || "-"}</p>
        </div>
    );
}

function LinkItem({href, children}: { href: string; children: React.ReactNode }) {
    return (
        <Link href={href} className={`${quicksand.className} text-white text-sm`}>
            {children}
        </Link>
    );
}

function SocialLinks({links}: { links: SocialLink[] }) {
    const iconMap: Record<string, React.ReactNode> = {
        instagram: <FaInstagram color="#ffffff" size={20}/>,
        facebook: <FiFacebook color="#ffffff" size={20}/>,
        linkedin: <FiLinkedin color="#ffffff" size={20}/>,
        twitter: <RiTwitterXLine color="#ffffff" size={20}/>,
        x: <RiTwitterXLine color="#ffffff" size={20}/>,
    };

    return (
        <>
            {links.map((item) => (
                <Link key={item.id} href={item.url} target="_blank" rel="noopener noreferrer">
                    {iconMap[item.icon.toLowerCase()] ?? null}
                </Link>
            ))}
        </>
    );
}
