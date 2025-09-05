'use client'

import { decreaseQuantity, increaseQuantity, removeFromCart } from '@/features/cartSlice'
import Image from 'next/image'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Sora } from "next/font/google";
import Link from 'next/link'
import CustomSnackbar from '@/components/Helper/CustomSnackbar'


const sora = Sora({
  subsets: ["latin"],
  weight: ["300"],
  variable: "--font-sora",
});

const Page = () => {
  const item = useSelector((state) => state.cart.items)
  const totalPrice = item.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const MathTotal = totalPrice.toFixed(2)
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)

  return (
    <div className={`${sora.variable}  sm:min-h-screen flex flex-col`}>
      {item.length === 0 && (
        <div className='relative py-40 flex flex-col items-center justify-center '>
          <div className='absolute  2xl:left-140'>
            <Image src='/bgCart.png' alt='img' width={100} height={10} className='w-55 sm:w-80 z-0'/>
          </div>
          <div className='flex flex-col items-center  relative z-20 gap-10'>
            <h1 className='text-3xl sm:text-5xl text-center font-main font-thin'>Your Cart is Empty</h1>
            <Link href='/order'>
              <button className='px-30 sm:px-50 py-3 rounded-full transition border-2 font-main font-semibold text-head hover:text-white bg-white hover:bg-[#7DDF9A]/90  border-[#7DDF9A]'>Order Now</button>
            </Link>
        
          </div>
        </div>
      )}

     {item.length > 0 && (
  <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
    <h2 className="font-main font-thin text-4xl sm:text-5xl text-center text-head">
      Your Cart
    </h2>
    <p className="font-main text-brown text-center text-sm sm:text-base mx-auto">
      Here’s what you’ve selected — sweet choices! <br />
      Review your items below before proceeding to checkout. You can update quantities or remove items as needed.
    </p>

    <div className="space-y-3">
      {item.map((item, index) => (
        <div key={index} className="flex font-main sm:flex-row items-center border border-gray-300 rounded-xl shadow-sm py-5  gap-1 sm:gap-10">
            <Image width={20} height={10} src={item.image} alt="item" className="w-15 sm:w-1/5 object-cover rounded-lg" />
            <div className="flex flex-col xl:flex-1 xl:w-1/5 space-y-3">
              <h3 className="sm:text-2xl font-thin hidden xl:block text-head">{item.title}</h3>
              <p className="text-sm text-brown hidden xl:block">{item.description}</p>
            </div>
              <div className='flex flex-col flex-1 xl:flex-0 sm:mx-10 text-head'>
              <p className="text-sm text-brown block xl:hidden">{item.title}</p>
               <p className="font-bold sm:text-4xl mt-1">{item.price}$</p>
               </div>

          <div className="flex flex-col-reverse px-5 sm:px-0 xl:flex-row items-center gap-5 sm:gap-15">
           <div className='flex gap-2 sm:mr-10'>
             <button
              onClick={() => dispatch(decreaseQuantity(item.id))}
              className="text-2xl w-8 h-8 sm:w-10 sm:h-10 rounded  text-[#29713F] bg-[#DEFBE6] hover:bg-green-300 transition"
            >
              -
            </button>
            <span className="w-8 h-8 sm:w-10 sm:h-10 rounded font-main font-semibold bg-gray-200 hover:bg-gray-300 transition flex items-center justify-center">{item.quantity}</span>
            <button
              onClick={() => dispatch(increaseQuantity(item.id))}
              className="text-2xl w-8 h-8 sm:w-10 sm:h-10 rounded bg-[#DEFBE6] text-[#29713F] hover:bg-green-300 transition"
            >
              +
            </button>
           </div>
              <Image
              src="/trash.svg"
              alt="remove"
              width={50}
              height={20}
              onClick={() => {
                dispatch(removeFromCart(item.id));
                setOpen(true)
              }
              }
              className="cursor-pointer w-7 self-end sm:w-[50px] sm:mr-10 hover:opacity-70 transition"
            />
          </div>
        </div>
      ))}
      <p className="text-xl font-bold text-gray-800">
        Total: <span className="text-green-600">${MathTotal}</span>
      </p>
    </div>
<div className="font-main w-full py-8 mx-auto">
  <h2 className="text-head font-thin text-center text-4xl md:text-5xl  mb-4">
    Delivery Details
  </h2>
  <p className="text-brown text-center mb-8">
    Please fill in your information so we can prepare and deliver your order with care.
  </p>

  <form className="space-y-10 max-w-6xl mx-auto text-brown font-semibold">
    {/* Имя и фамилия */}
    <div className="flex flex-col md:flex-row gap-10">
      <input
      required
        type="text"
        name="name"
        placeholder="Name"
        className="flex-1  border-[#848484] border-2 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-brown"
      />
      <input
      required
        type="text"
        name="surname"
        placeholder="Surname"
        className="flex-1  border-[#848484] border-2 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-brown"
      />
    </div>

    {/* Email и телефон или ещё что-то */}
    <div className="flex flex-col md:flex-row gap-10">
      <input
      required
        type="email"
        name="email"
        placeholder="E-mail"
        className="flex-1  border-[#848484] border-2 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-brown"
      />
      <input
      required
        type="text"
        name="phone"
        placeholder="Phone Number"
        className="flex-1  border-[#848484] border-2 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-brown"
      />
    </div>

    {/* Адрес */}
    <textarea
    required
      name="address"
      placeholder="Address"
      rows="5"
      className="w-full  border-[#848484] border-2 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brown"
    />

    {/* Delivery Notes */}
    <textarea
    required
      name="notes"
      placeholder="Delivery notes (optional)"
      rows="5"
      className="w-full  border-[#848484] border-2 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brown"
    />

    {/* Кнопка */}
    <button
      type="submit"
      className="w-full border-[#7DDF9A] border-2 bg-white hover:text-white font-bold text-xl text-head py-3 rounded-full hover:bg-[#7DDF9A]/90 transition"
    >
      Send
    </button>
  </form>
</div>
  </div>
)}
  <CustomSnackbar
        open={open}
        onClose={() => setOpen(false)}
        message="Deleted From Cart"
        severity="error"
      />
    </div>
  )
}

export default Page
