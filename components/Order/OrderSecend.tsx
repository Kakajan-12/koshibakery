'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import React from 'react'
import { Sora } from 'next/font/google'

const sora = Sora({
  subsets: ['latin'],
  weight: ['300'],
  variable: '--font-sora',
})

const images = [
    {
        img:"/w1.png",
        title:'Cakes'
    },
    {
        img:"/w2.png",
        title:'Tarts'
    },
    {
        img:"/w3.png",
        title:'Mini Bakes'
    },
    {
        img:"/w4.png",
        title:'Cookies'
    },
    {
        img:"/w5.png",
        title:'Custom'
    },
    {
        img:"/w6.png",
        title:'Drinks'
    },
    {
        img:"/w6.png",
        title:'Drinks'
    },
    {
        img:"/w6.png",
        title:'Drinks'
    },
    {
        img:"/w6.png",
        title:'Drinks'
    },
    {
        img:"/w6.png",
        title:'Drinks'
    },
    {
        img:"/w6.png",
        title:'Drinks'
    },
    {
        img:"/w6.png",
        title:'Drinks'
    },
  
]


const OrderSecond = () => {
  return (
    <div className='w-full'>
    <div className={`${sora.variable} w-full mx-auto py-10 px-5 2xl:px-25`}>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-10">
        {images.map((img, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.2,
              duration: 0.6,
              ease: 'easeOut',
            }}>
            <Image
              src={img.img}
              alt={`img-${index}`}
              width={100}
              height={100}
              className="rounded-full w-full"/>
            <p className='text-center text-brown font-main font-semibold xl:text-xl md:py-5'>{img.title}</p>
          </motion.div>
        ))}
      </div>
      </div>
   </div>
  )
}

export default OrderSecond
