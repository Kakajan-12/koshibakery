'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import { Sora } from 'next/font/google'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, decreaseQuantityzero, increaseQuantityZero } from '@/features/cartSlice'
import CustomSnackbar from '../Helper/CustomSnackbar'
import Link from 'next/link'
import { RootState } from '@/store'
import { useGetProductQuery } from '@/services/productApi'

const sora = Sora({
  subsets: ['latin'],
  weight: ['300'],
  variable: '--font-sora',
})

const cakes = [
  {
      id: 101,
   title:'Peanut Brownie',
   price:6.90,
   img:'/fcake.png'

  },
  {
     id: 102,
   title:'Brownie with Ice-cream',
   price:7.80,
    img:'/fcake2.png'
  },
  {
    id: 103,
   title:'ChocoChip Brownie',
   price:8 ,
    img:'/fcake3.png'
  },
]


const OrderFirst = () => {
  const dispatch = useDispatch()
  const [open,setOpen] = useState(false)
  const item = useSelector((state:RootState) => state.cart.items)

  const {data,isLoading,error} = useGetProductQuery()
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading data</div>


  const beautyProducts = data.products.filter(product => product.category === 'fragrances');
  
  const getQuantity = (id: number) => {
  const cartItem = item.find(i => i.id === id);
  return cartItem ? cartItem.quantity : 0;
};

  return (
 <div className={`relative w-full p-5  space-y-5 overflow-hidden ${sora.variable}`}>
      <div
        className="hidden sm:block absolute inset-0 -z-10"
        style={{
          backgroundImage: "url('/221.png')",
          backgroundPosition: 'center top 150px',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      />
  {/* "Фоновое" изображение */}
  <div className="absolute bottom-18 left-0 w-full flex sm:hidden justify-end z-0">
    <Image src="/bgGreen.png" alt="bg" width={500} height={10} />
  </div>
      <Image
  src="/bgCart.png"
  alt="img"
  width={150}
  height={10}
  className="absolute top-10 sm:top-2 left-[120px] sm:left-[220px] md:left-[300px]  lg:left-100 lg:w-[200px] xl:left-[500px] 2xl:left-[600px] w-[150px] xl:w-[300px]"
/>

      <Image src="/twoCake.png" alt="img" width={250} height={10} className="absolute block sm:hidden top-35 left-35 z-10" />
      <Image src="/bcakes.png" alt="img" width={550} height={10} className="2xl:w-[550px] xl:w-[450px] sm:w-[250px] lg:w-[400px] sm:top-75 absolute hidden sm:block sm:right-15 top-65 right-25 z-10" />

      {/* ✅ Заголовок */}
      <h1 className="text-center text-3xl sm:text-6xl font-main font-thin text-head relative z-10">Place an Order</h1>
      <p className="text-center text-brown font-main relative mx-auto z-10 sm:max-w-xl sm:text-xl ">
        Whether you're planning a birthday, surprising a friend, or simply craving something sweet — we're here to make it special
      </p>

      {/* ✅ Most Loved */}
      <div className="my-20 relative z-20">
        <div className="py-10 space-y-5  xl:mx-20">
        <div className="flex flex-col 2xl:mb-10">
          <Image src="/love.svg" alt="img" width={30} height={10} className='mx-12'/>
          <h2 className="text-2xl sm:text-3xl 2xl:text-4xl font-bold">Most Loved</h2>
        </div>
      {beautyProducts.slice(0,3).map((item,index) => (
             <div className="flex gap-5 2xl:gap-10" key={index}>
           <Link href={`/detail/${item.id}`}>
            <Image 
            src={item.images[0]} alt="img" width={120} height={10} 
            className='w-[120px] xl:w-[150px]'
            />
           </Link>
           {getQuantity(item.id) === 0 ? (

             <Image src='/group.svg'  alt='img' width={50} height={10}  className='absolute self-end-safe w-1/11 md:w-[50px]'
             onClick={() => {
                           dispatch(
                           addToCart({
                      id: item.id,
                      title: item.title,
                      price: item.price,
                      image: item.images[0],
                   })
                 );
               setOpen(true) }}/>
           ): (
             <div  className='absolute self-end-safe w-[120px] flex gap-2'>
                  <button
                    onClick={() => dispatch(decreaseQuantityzero(item.id))}
                    className="text-2xl  h-8 w-full  rounded bg-[#DEFBE6] text-[#29713F] hover:bg-green-300 transition">
                    -
                  </button>
                  <span className=" h-8 w-full  rounded font-main font-semibold bg-gray-200 hover:bg-gray-300 transition flex items-center justify-center">
                    {getQuantity(item.id)}
                  </span>
                  <button
                    onClick={() => dispatch(increaseQuantityZero(item.id))}
                    className="text-2xl  h-8 w-full rounded bg-[#DEFBE6] text-[#29713F] hover:bg-green-300 transition">
                    +
                  </button>
                </div>
           )}
            <div className="flex flex-col flex-1 justify-center">
              <p className="text-xl font-main xl:text-3xl">{item.title}</p>
              <p className='font-bold xl:text-3xl'>£{item.price}</p>
            </div>
          </div>
            ))}
             
        </div>
      </div>
  <CustomSnackbar
        open={open}
        onClose={() => setOpen(false)}
        message="Added to cart!"
        severity="success"
      />
    </div>
  )
}

export default OrderFirst
