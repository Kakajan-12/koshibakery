import Image from 'next/image'
import React from 'react'
import { Sora } from 'next/font/google'

const sora = Sora({
  subsets: ['latin'],
  weight: ['300'],
  variable: '--font-sora',
})

const AboutSecend = () => {
  return (
    <div className={`${sora.variable} relative font-main  text-head flex flex-col 2xl:flex-row items-center p-5 pb-30 md:p-30`}>
      <Image src='/aboutels.svg' alt='img' width={250} height={10} className='absolute -z-0 top-210 right-10 block lg:hidden'/>
      <Image src='/aboutelf.svg' alt='img' width={100} height={10} className='absolute -z-0 top-195 right-0 blok lg:hidden'/>
      <Image src='/babout.svg' alt='img' width={200} height={10} className='absolute -z-0 top-100 right-0 hidden lg:block'/>
      <Image src='/vabout.svg' alt='img' width={450} height={10} className='absolute -z-0 top-130 right-0 hidden lg:block'/>
      {/* Картинка слева */}
       <div className='w-full flex flex-col lg:flex-row gap-5'>
         <Image
          src='/aboutSecend.svg'
          alt='img'
          width={50}
          height={10}
          className='w-full  lg:w-1/2 2xl:w-1/2 rounded-2xl'
        />

      {/* Контент справа */}
      <div className='w-full lg:w-1/2 2xl:w-1/2 bg-[#FFEB97] rounded-2xl flex flex-col items-start justify-center py-5 gap-5 px-5'>
        <h1 className='text-3xl  2xl:text-7xl font-semibold text-head'>Koşi bakery</h1>
        <p className=' text-lg'>
          Duis euismod, magna a cursus bibendum, ligula eros suscipit nisl, nec tempus est velit nec nibh. Quisque at velit vitae nulla pretium hendrerit in eget augue.
        </p>
        <p className='font-semibold text-xl pt-15'>Opening hours:</p>
        <div className='flex items-center justify-end gap-10'>
          <div className='flex flex-col gap-2'>
          <p>Monday - Friday</p>
          <p>Saturday - Sunday</p>
        </div>
        <div className='flex flex-col gap-2'>
          <p>09:00 - 16:00</p>
          <p>10:00 - 19:00</p>
        </div>
        </div>
      </div>
       </div>
    </div>
  )
}

export default AboutSecend
