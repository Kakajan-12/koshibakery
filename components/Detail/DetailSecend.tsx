import React from 'react'
import { Sora } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'

const sora = Sora({
  subsets: ['latin'],
  weight: ['300'],
  variable: '--font-sora',
})

const DetailSecend = () => {
  return (
    <div className={`${sora.variable} flex flex-col items-center justify-center gap-4 md:gap-20 font-main  py-20 sm:py-50 xl:py-100`}>
        <h1 className='text-2xl xl:text-7xl font-thin px-3 text-center'>Perfect for special occasions or as a  luxurious treat for yourself.</h1>
        <Image src='/cookies.svg' alt='img' width={100} height={10} className='w-full' />
          <Link href='/order'>
           <button className='px-30 sm:px-60 py-3 rounded-full transition border-2 font-main font-semibold text-head hover:text-white bg-white hover:bg-[#7DDF9A]/90  border-[#7DDF9A]'>Order Now</button>
         </Link>
        
    </div>
  )
}

export default DetailSecend