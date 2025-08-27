"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Sora } from "next/font/google";
import { useTranslations } from "next-intl";

const sora = Sora({
  subsets: ["latin"],
  weight: ["300"],
  variable: "--font-sora",
});

const Footer = () => {
  const now = new Date();
  const year = now.getFullYear();

  return (
    <div  className={`${sora.variable} bg-no-repeat bg-cover lg:py-10 relative z-44`}
      style={{ backgroundImage: "url(/footer.png)" }}>
    <div className=" text-white px-6 sm:px-10 py-20 md:px-20">
      <h1 className="text-3xl  container mx-auto sm:text-6xl font-main font-semibold mb-6 sm:mb-12">
        Koşi Bakery
      </h1>

      <div className="flex container mx-auto flex-col md:flex-row justify-between gap-12 sm:gap-20">
        {/* Левая часть */}
        <div className="flex flex-col gap-6 max-w-md">
          <p className="text-sm leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eget
            tortor ut mauris tincidunt consequat ut sed quam.
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
        </div>

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

          {/* Twitter */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="w-7 h-7 cursor-pointer hover:scale-110 transition text-white"
            onClick={() => window.open("https://twitter.com")}
          >
            <path d="M23.954 4.569c-.885.392-1.83.656-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.897-.957-2.178-1.555-3.594-1.555-2.723 0-4.928 2.205-4.928 4.928 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.708.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.229-.616v.062c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.6 3.419-1.68 1.318-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.402 4.768 2.213 7.557 2.213 9.054 0 14-7.496 14-13.986 0-.209 0-.42-.016-.63.961-.695 1.8-1.562 2.46-2.549z" />
          </svg>

          {/* Facebook */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="w-7 h-7 cursor-pointer hover:scale-110 transition text-white"
            onClick={() => window.open("https://facebook.com")}
          >
            <path d="M22.675 0h-21.35C.597 0 0 .598 0 1.337v21.326C0 23.402.597 24 1.325 24h11.482v-9.294H9.847v-3.622h2.96V8.413c0-2.934 1.792-4.534 4.41-4.534 1.254 0 2.333.093 2.646.135v3.07l-1.815.001c-1.425 0-1.7.679-1.7 1.67v2.187h3.397l-.443 3.622h-2.954V24h5.787C23.403 24 24 23.402 24 22.663V1.337C24 .598 23.403 0 22.675 0z" />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="w-7 h-7 cursor-pointer hover:scale-110 transition text-white"
            onClick={() => window.open("https://linkedin.com")}
          >
            <path
              d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 
           0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11.75 20h-3v-11h3v11zm-1.5-12.27c-.97 
           0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.78 1.75 
           1.75-.78 1.75-1.75 1.75zm13.25 12.27h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 
           0-2.16 1.46-2.16 2.96v5.71h-3v-11h2.89v1.5h.04c.4-.75 
           1.38-1.54 2.85-1.54 3.05 0 3.62 2.01 3.62 4.63v6.41z"
            />
          </svg>
        </div>
      </div>
    </div>
      <p className="flex text-white items-center justify-center " > &copy; {year} &laquo;Kosi Bakery&raquo;</p>
    </div>
  );
};

export default Footer;
