'use client';

import React from 'react';
import { Sora } from 'next/font/google';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from 'next/image';

const sora = Sora({
  subsets: ['latin'],
  weight: ['300'],
  variable: '--font-sora',
});

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};



const MenuThird = () => {

  return (
    <motion.div
      className={`${sora.variable} p-5 sm:my-50 sm:space-y-10`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <motion.div>
        <h1 className="text-center text-2xl md:text-5xl mb-5 font-thin text-[#3B3B3B] font-main">
          Menu
        </h1>
        <p className="text-center py-5 md:text-xl text-[#6F5E53]">
          From soft layered cakes to delicate tarts — each treat is made to brighten your day.
        </p>
      </motion.div>

      {/* Mobile */}
      <div className="w-full flex flex-col sm:hidden gap-5 py-5">
        {[
          '/card1.png',
          '/card2.png',
          '/card3.png',
          '/card4.png',
          '/card5.png',
          '/card6.png',
        ].map((src, i) => (
          <motion.div key={i}>
            <Link href="/order">
              <Image width={20} height={10}  src={src} alt="img" className="w-full" />
            </Link>
          </motion.div>
        ))}
      </div>

        {/* Desktop */}
<div className="sm:block hidden w-full -mt-10">
  <Swiper
    modules={[Navigation]}
    loop={true}
     spaceBetween={30}
    navigation={{
      nextEl: ".swiper-button-next-custom",
      prevEl: ".swiper-button-prev-custom",
    }}
    breakpoints={{
      320: { slidesPerView: 1 },
      640: { slidesPerView: 1 },
      768: { slidesPerView: 3 },
      1024: { slidesPerView: 5},
    }}
    className="w-4/5 "
  >
    {[
      '/card1b.png',
      '/card2b.png',
      '/card3b.png',
      '/card4b.png',
      '/card5b.png',
      '/card6b.png',
    ].map((src, i) => (
      <SwiperSlide key={i}>
        <motion.div>
          <Link href="/order">
            <Image
            width={300}
            height={10}
              src={src}
              alt="img"
              className="transition-transform duration-300 w-full hover:scale-105 shadow-md"
            />
          </Link>
        </motion.div>
      </SwiperSlide>
    ))}
  </Swiper>
   <div className="flex items-end justify-end gap-4 mx-37 mt-5">
    <button className="swiper-button-prev-custom text-2xl px-4 py-3 text-white bg-[#165225] rounded-full hover:bg-gray-300">
      ←
    </button>
    <button className="swiper-button-next-custom text-2xl px-4 py-3 text-white bg-[#165225] rounded-full hover:bg-gray-300">
      →
    </button>
  </div>
</div>

    </motion.div>
  );
};

export default MenuThird;
