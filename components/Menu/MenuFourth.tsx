"use client";
import Image from "next/image";
import React from "react";
import { Sora } from "next/font/google";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { slide } from "@/index";

const sora = Sora({
  subsets: ["latin"],
  weight: ["300"],
  variable: "--font-sora",
});

const MenuFourth = () => {
  return (
    <div className={`${sora.variable} sm:mb-50`}>
      <div className="flex items-center justify-between px-4 sm:px-10 mb-10 md:-mb-20">
        <Image
          src="/left.svg"
          alt="img"
          width={300}
          height={10}
          className="w-15 sm:w-[100px]  md:w-[200px] xl:w-[300px]"
        />
        <h1 className="text-xl sm:text-4xl font-main text-head">
        Testimonials
        </h1>
        <Image
          src="/right.svg"
          alt="img"
          width={300}
          height={10}
          className="w-15 sm:w-[100px] md:w-[200px] xl:w-[300px]"
        />
      </div>

      <div className="flex justify-center overflow-visible ">
        <div className={`relative w-70 sm:w-full sm:max-w-6xl px-4 overflow-visible`}>
          <Swiper
            modules={[Navigation]}
            loop={true}
            spaceBetween={50}
            centeredSlides={true}
            navigation={{
              nextEl: ".swiper-button-next-custom",
              prevEl: ".swiper-button-prev-custom",
            }}
            breakpoints={{
              320: { slidesPerView: 1 },
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="text-center overflow-visible"
          >
            {slide.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="slide-content transition-all duration-300">
                  <div className="border-head border rounded-2xl bg-white p-2 sm:p-10 md:p-16 shadow-lg">
                    <div className="max-w-xl mx-auto flex flex-col gap-10">
                      <Image
                        src="/moon.png"
                        alt="img"
                        width={130}
                        height={50}
                        className="w-20 mx-auto sm:w-[130px]"
                      />
                      <p className="text-head text-start leading-relaxed font-main">
                        {item.title}
                      </p>
                      <p className="text-head text-start font-main">
                        -{item.name}
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* стрелки под слайдером */}
          <div className="sm:flex  hidden justify-center sm:gap-30 -mt-10 ">
            <div className="swiper-button-prev-custom">
              <span className="relative flex items-center rotate-180">
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
            </div>
            <div className="swiper-button-next-custom">
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
            </div>
          </div>
          <div className="flex sm:hidden justify-center sm:gap-30 -mt-10 sm:mt-6">
            <div className="swiper-button-prev-custom">
              <span className="relative flex items-center rotate-180">
                <img
                  src="/arrowRight.svg"
                  alt="Arrow right"
                  className="w-15 h-6 z-2"
                />
                <img
                  src="/ellipse.svg"
                  alt="Ellipse"
                  className="w-10 h-50 -ml-6 z-0"
                />
              </span>
            </div>
            <div className="swiper-button-next-custom">
              <span className="relative flex items-center">
                <img
                  src="/arrowRight.svg"
                  alt="Arrow right"
                  className="w-15 h-6 z-2"
                />
                <img
                  src="/ellipse.svg"
                  alt="Ellipse"
                  className="w-10 h-50 -ml-6 z-0"
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuFourth;
