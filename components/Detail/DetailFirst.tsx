'use client'
import Image from 'next/image'
import React from 'react'
import { Sora } from 'next/font/google'
import { useGetProductQuery } from '@/services/productApi'
import { useParams } from 'next/navigation'

const sora = Sora({
  subsets: ['latin'],
  weight: ['300'],
  variable: '--font-sora',
})



const DetailFirst = () => {
  const params = useParams()
  const { data, isLoading, error } = useGetProductQuery()


  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading data</div>


 const product = data.products.find((p) => p.id == params.id)

  return (
        <div className={`${sora.variable} font-main relative`}>
             <Image  src='/lborder.svg' alt='img' width={750} height={10}  className='absolute w-60 sm:w-80 top-15 xl:top-0 xl:w-[750px]'/>
            <Image  src='/rborder.svg' alt='img' width={350} height={10} className='absolute right-0 sm:w-50 sm:top-0 top-40 xl:top-0 w-30 xl:w-[350px]'/>
            {/* <Image  src='/rcake.svg' alt='img' width={420} height={10} className='absolute w-30 sm:w-50 sm:top-15 sm:right-15 right-3 top-40 lg:w-[300px]  xl:w-[450px] xl:right-20 xl:top-30 '/> */}
            <img src={product.images[0]} alt='img' width={420} height={10} className='absolute w-30 sm:w-50 sm:top-15 sm:right-15 right-3 top-40 lg:w-[300px]  xl:w-[450px] xl:right-20 xl:top-30 '/>
       <div className='py-8 px-2 sm:px-15 xl:p-40 space-y-5 xl:space-y-10 relative'>
            <Image  src='/yellowCircle.svg' alt='img' width={450} height={10} className='absolute w-1/3 sm:w-1/4 opacity-60 sm:opacity-100 top-100 xl:w-[450px] xl:left-20 xl:top-180' />
            <Image  src='/sliceCake.svg' alt='img' width={560} height={10} className='absolute w-1/3  sm:left-20 left-5 top-106 xl:w-[560px] xl:left-45 xl:top-195'/>
         <h1 className='text-3xl xl:text-6xl sm:text-4xl font-thin text-head'>{product.title}</h1>
        <p className='xl:max-w-2xl sm:max-w-sm xl:text-lg text-brown'>A rich, smooth, and indulgent dessert made with real chocolate and cream — simple in composition, but luxurious in taste.</p>
        <div className='flex items-center gap-2 xl:gap-10'>
            <p className='text-2xl sm:text-4xl xl:text-5xl font-bold text-head'>{product.price}</p>
            <p className='xl:text-xl text-brown'>serves 6–8 people</p>
        </div>
       </div>
       <div className='mt-65 px-2 w-full xl:mt-80 sm:pl-90 lg:ml-40 2xl:ml-0 lg:pr-20 sm:items-end sm:justify-center gap-5 flex flex-col items-start'>
        <div className='flex flex-col gap-5 xl:gap-10'>
             <h1 className='text-xl ml-40 sm:ml-0 lg:text-6xl font-thin text-head'>Ingredients & <span className='text-[#44A560]'>Flavors</span></h1>
        <p className='max-w-sm items-start xl:max-w-xl xl:text-lg text-brown'>Crafted with care using premium, real ingredients for deep chocolate richness and melt-in-your-mouth texture.</p>
        <div className='flex lg:flex-col gap-5 item-start '>
            <p className='lg:text-lg font-bold text-head '>Ingredients:</p>
            <p className='max-w-sm xl:text-lg text-brown xl:max-w-lg'>Dark chocolate, cream, butter, eggs, flour, cocoa powder, vanilla.</p>
        </div>
        </div>
       </div>
    </div>
  )
}

export default DetailFirst