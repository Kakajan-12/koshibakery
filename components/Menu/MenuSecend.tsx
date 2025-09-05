'use client';

import React from "react";
import { motion } from "framer-motion";
import { Sora } from "next/font/google";

const sora = Sora({
  subsets: ["latin"],
  weight: ["300"],
  variable: "--font-sora",
});

const features = [
  {
    title: 'Reliable, Same-Day Delivery',
    description: 'Get your cakes and pastries delivered fresh to your door — carefully packed and always on time.',
  },
  {
    title: 'Honest Ingredients',
    description: 'No mixes, no shortcuts. Just real butter, fresh cream, and simple ingredients that speak for themselves.',
  },
  {
    title: 'Beautiful in Every Detail',
    description: 'Each item is carefully finished by hand — because we believe great taste deserves great presentation.',
  },
];


const MenuSecond = () => {
  return (
    <motion.section
      className={`${sora.variable} bg-white p-10`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
     
    >
      <motion.h2
        className="text-center text-2xl sm:text-5xl font-main text-[#3B3B3B] font-thin mb-5 sm:mb-30"
      >
        More Than Just Cakes
      </motion.h2>

      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="group transition-all duration-300 hover:scale-105 sm:max-w-70 mx-auto"
          >
            <div className="flex items-center mb-4">
              <div className="h-0.5 bg-black flex-1"></div>
              <div className="w-3 h-3 bg-black rounded-full"></div>
            </div>
            <h3 className="text-xl text-[#3B3B3B] sm:text-3xl font-main font-thin mb-2 group-hover:text-amber-900 transition-colors">
              {feature.title}
            </h3>
            <p className="text-[#6F5E53]">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default MenuSecond;
