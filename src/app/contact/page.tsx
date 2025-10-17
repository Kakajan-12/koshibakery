'use client';

import { useEffect, useState } from 'react';
import { quicksand, sora } from '@/app/fonts';
import { MdOutlineMail } from 'react-icons/md';
import { FiPhone } from 'react-icons/fi';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

interface ContactData {
    id: number;
    address?: string;
    phone?: string;
    mail?: string;
    map?: string;
}

const Contact: React.FC = () => {
    const pathname = usePathname();
    const [contact, setContact] = useState<ContactData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // поля формы
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
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

    // 🔥 Обработчик отправки письма
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message }),
            });

            if (!res.ok) throw new Error('Ошибка при отправке письма');

            setStatus('success');
            setName('');
            setEmail('');
            setMessage('');
        } catch (err) {
            console.error(err);
            setStatus('error');
        } finally {
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    return (
        <div className="my-container mx-auto pt-[64px]">
            <div className="container mx-auto px-4">
                <div className="flex flex-col justify-center items-center py-4">
                    <h6 className={`${sora.className} mb-4 font-bold text-xl md:text-3xl`}>
                        Contact Us
                    </h6>
                    <p
                        className={`${quicksand.className} text-sm max-w-96 md:max-w-[500px] text-center text-[#6F5E53] md:text-lg`}
                    >
                        We’d love to hear from you! Whether you have a question about our
                        menu, want to place a custom order, or just want to say hello — feel
                        free to reach out.
                    </p>
                </div>
            </div>

            {/* Фон с печеньками */}
            <div
                key={pathname}
                className="h-20 bg-repeat-x bg-bottom md:h-35"
                style={{
                    backgroundImage: "url('/images/cookie1.webp')",
                    backgroundSize: 'auto 100%',
                }}
            ></div>

            <div className="container mx-auto px-4">
                {loading ? (
                    <p className="text-center text-gray-500 py-8">Loading...</p>
                ) : (
                    <div className="flex flex-col xl:flex-row xl:space-x-6 space-y-4 py-8">
                        {/* Левая часть: контакты + карта */}
                        <div className="flex flex-col justify-center space-y-3 xl:w-1/2">
                            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-2">
                                {/* Email */}
                                <div className="flex bg-[#FFF2BB] py-2 px-3 rounded-md space-x-2 xl:h-full w-full items-center">
                                    <MdOutlineMail className="w-12 h-12 md:w-16 md:h-16 flex-shrink-0" />
                                    <div className="flex flex-col justify-center">
                                        <div
                                            className={`${sora.className} font-bold text-lg md:text-xl lg:text-2xl`}
                                        >
                                            E-mail
                                        </div>
                                        <p
                                            className={`${quicksand.className} text-md font-light md:text-lg lg:text-xl`}
                                        >
                                            {contact?.mail || '—'}
                                        </p>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="flex bg-[#FFF2BB] py-2 px-3 rounded-md space-x-2 xl:h-full w-full items-center">
                                    <FiPhone className="w-10 h-10 md:w-14 md:h-14 flex-shrink-0" />
                                    <div className="flex flex-col justify-center">
                                        <div
                                            className={`${sora.className} font-bold text-lg md:text-xl lg:text-2xl`}
                                        >
                                            Phone
                                        </div>
                                        <p
                                            className={`${quicksand.className} text-md font-light md:text-lg lg:text-xl`}
                                        >
                                            {contact?.phone || '—'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Карта */}
                            <div className="w-full h-[250px] mt-4 overflow-hidden rounded-lg">
                                {contact?.map ? (
                                    <div className="w-full h-[250px] mt-4 overflow-hidden rounded-lg">
                                        {mapElement}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center">Map not available</p>
                                )}
                            </div>
                        </div>

                        {/* Правая часть: форма */}
                        <div className="space-y-2 xl:w-1/2">
                            <h6
                                className={`${sora.className} font-bold text-lg md:text-2xl`}
                            >
                                Get In Touch
                            </h6>
                            <p
                                className={`${quicksand.className} text-[#6F5E53] text-sm md:text-md leading-4`}
                            >
                                Duis euismod, magna a cursus bibendum, ligula eros suscipit
                                nisl, nec tempus est velit nec nibh. Quisque at velit vitae
                                nulla pretium hendrerit in eget augue.
                            </p>

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-2 md:h-64 md:flex md:flex-col justify-between pt-5"
                            >
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="border-b-2 w-full text-md focus:outline-none"
                                />

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="border-b-2 w-full text-md focus:outline-none"
                                />

                                <textarea
                                    name="message"
                                    placeholder="Message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                    className="border-b-2 w-full text-md focus:outline-none"
                                ></textarea>

                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className={`${sora.className} font-bold w-full text-center border-2 border-[#264D30] rounded-xl py-2 text-lg cursor-pointer transition-all hover:bg-[#264D30] hover:text-white`}
                                >
                                    {status === 'loading'
                                        ? 'Sending...'
                                        : status === 'success'
                                            ? '✅ Sent!'
                                            : status === 'error'
                                                ? '❌ Error'
                                                : 'Send'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Contact;
