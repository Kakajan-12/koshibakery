"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Sora } from "next/font/google";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);


gsap.registerPlugin(ScrollTrigger);

const sora = Sora({
  subsets: ["latin"],
  weight: ["300"],
  variable: "--font-sora",
});

const Footer = () => {

    useEffect(() => {
    // ➕ Бесконечное вращение hebent.svg
    gsap.to(".hebentLogo", {
      rotation: 360,
      repeat: -1,
      duration: 10, // скорость вращения
      ease: "linear",
    });
  }, []);

  const now = new Date();
  const year = now.getFullYear();

  return (
    <div  className={`${sora.variable} bg-no-repeat bg-cover lg:py-10 relative z-44`}
      style={{ backgroundImage: "url(/footer.png)" }}>
    <div className=" text-white px-6 sm:px-10 py-20 md:px-20">
      <h1 className="text-3xl  container mx-auto sm:text-6xl lg:text-8xl font-main font-semibold mb-6 sm:mb-12">
        Koşi Bakery
      </h1>

      <div className="flex container mx-auto flex-col md:flex-row justify-between gap-12 sm:gap-20">
        {/* Левая часть */}
        <div className="flex flex-col gap-6 max-w-5xl">
          <p className="lg:text-xl leading-relaxed">
            The name “Koşi Bakery” carries personal significance. It originates from the small, culturally rich town of Koşi in Turkmenistan — the birthplace of our founder and the source of much of our culinary inspiration. We honour these roots by incorporating time-honoured recipes and techniques into many of our creations.
          </p>

          <div className="flex flex-col gap-4 text-sm">
            <div className="flex items-center gap-3">
              <Image src="/map.svg" alt="map" width={24} height={24} />
              <span className="lg:text-xl">185 Edgware Road W2 1ET</span>
            </div>
            <div className="flex items-center gap-3">
              <Image src="/phone.svg" alt="phone" width={24} height={24} />
           <a href="tel:07342978654" className="lg:text-xl">07342 978654</a>
            </div>
            <div className="flex items-center gap-3">
              <Image src="/mail.svg" alt="mail" width={24} height={24} />
            <a href="mailto:cakesjandk@gmail.com" className="lg:text-xl">
            cakesjandk@gmail.com
            </a>
            </div>
          </div>
        </div>

        {/* Центр — ссылки */}
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold mb-2 sm:mb-4">Quick Links</h2>
           <Link href={`/`} className="relative after:block after:w-0 after:h-[2px] after:bg-yellow-500 after:transition-all after:duration-300 hover:after:w-full">Home</Link>
          <Link href={`/order`} className="relative after:block after:w-0 after:h-[2px] after:bg-yellow-500 after:transition-all after:duration-300 hover:after:w-full">Menu</Link>
          <Link href={`/about`}  className="relative after:block after:w-0 after:h-[2px] after:bg-yellow-500 after:transition-all after:duration-300 hover:after:w-full">About Us</Link>
          <Link href={`/contact`} className="relative after:block after:w-0 after:h-[2px] after:bg-yellow-500 after:transition-all after:duration-300 hover:after:w-full">Contact</Link>
        <div className="flex gap-4 sm:gap-6 2xl:my-5">
          {/* Instagram (кастомный SVG) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="w-7 h-7 cursor-pointer hover:scale-110 transition text-white"
            onClick={() => window.open("https://instagram.com")}
          >
            <path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 2 .2 2.5.4.6.2 1 .4 1.4.8.4.4.6.8.8 1.4.2.5.3 1.3.4 2.5.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 2-.4 2.5-.2.6-.4 1-.8 1.4-.4.4-.8.6-1.4.8-.5.2-1.3.3-2.5.4-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-2-.2-2.5-.4-.6-.2-1-.4-1.4-.8-.4-.4-.6-.8-.8-1.4-.2-.5-.3-1.3-.4-2.5C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-2 .4-2.5.2-.6.4-1 .8-1.4.4-.4.8-.6 1.4-.8.5-.2 1.3-.3 2.5-.4C8.4 2.2 8.8 2.2 12 2.2m0-2.2C8.7 0 8.3 0 7.1.1 5.9.2 4.9.4 4.1.6c-.9.3-1.7.7-2.4 1.4S.9 3.2.6 4.1C.4 4.9.2 5.9.1 7.1 0 8.3 0 8.7 0 12s0 3.7.1 4.9c.1 1.2.3 2.2.5 3 .3.9.7 1.7 1.4 2.4s1.5 1.1 2.4 1.4c.8.2 1.8.4 3 .5 1.2.1 1.6.1 4.9.1s3.7 0 4.9-.1c1.2-.1 2.2-.3 3-.5.9-.3 1.7-.7 2.4-1.4s1.1-1.5 1.4-2.4c.2-.8.4-1.8.5-3 .1-1.2.1-1.6.1-4.9s0-3.7-.1-4.9c-.1-1.2-.3-2.2-.5-3-.3-.9-.7-1.7-1.4-2.4S20.7.9 19.8.6c-.8-.2-1.8-.4-3-.5C15.7 0 15.3 0 12 0z" />
            <path d="M12 5.8A6.2 6.2 0 1 0 12 18.2 6.2 6.2 0 1 0 12 5.8zm0 10.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8zM18.4 4.9a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
          </svg>
        </div>
        </div>

      </div>
    </div>
         <div className="flex lg:text-xl items-center justify-center text-white pb-5">
        <p>All rights reserved | Privacy Policy | Powered by </p>
      <img src="/hebent.svg" alt="img" className="hebentLogo" />
      </div>
    </div>
  );
};

export default Footer;
