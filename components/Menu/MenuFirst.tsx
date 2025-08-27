'use client'
import React from "react";
import Link from "next/link";
import { Sora } from "next/font/google";
import { motion } from "framer-motion"; // ✅ импорт Framer Motion

const sora = Sora({
  subsets: ["latin"],
  weight: ["300"],
  variable: "--font-sora",
});

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay,
      ease: "easeOut",
    },
  }),
};

const MenuFirst = () => {
  return (
    <section
      className={`${sora.variable} relative w-full bg-white sm:py-20 p-10 md:px-16`}
    >
      <img
        src="/half.svg"
        alt="Background half"
        className="absolute top-10 sm:top-0 -left-6 w-25 sm:w-fit  z-0"
      />
      <img
        src="/tasty.svg"
        alt="Tasty bakery"
        className="absolute top-20 right-5 sm:top-50 md:top-50 lg:top-0 sm:right-0 w-1/2 max-w-none z-0 opacity-20 md:opacity-40 lg:opacity-40 xl:opacity-100"
      />

      <div className="relative z-10 sm:max-w-4xl sm:px-25 sm:py-15 sm:text-center lg:text-left flex flex-col sm:items-center lg:items-start space-y-4 sm:space-y-8">
        <motion.h1
          className="text-3xl text-[#3B3B3B] sm:text-5xl lg:text-6xl font-main font-thin tracking-tight"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          A Little Slice of Joy
        </motion.h1>

        <motion.p
          className="text-left text-lg lg:text-2xl text-[#6F5E53] leading-relaxed"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.3}
        >
          A boutique bakery offering thoughtfully made cakes and pastries — for morning coffee or meaningful celebrations.
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.6}
        >
          <Link
            href="/about"
            className="flex items-center justify-center font-thin font-main text-xl gap-3 text-[#3B3B3B] hover:text-green-500 xl:my-8 transition-colors"
          >
            About Us
            <span className="relative flex items-center">
              <img
                src="/arrowRight.svg"
                alt="Arrow right"
                className="w-20 h-6 z-2"
              />
              <img
                src="/ellipse.svg"
                alt="Ellipse"
                className="w-15 h-50 -ml-6 z-0"
              />
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default MenuFirst;
