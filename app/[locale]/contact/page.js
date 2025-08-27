import React from 'react'
import { Sora } from 'next/font/google'
import Image from 'next/image'

const sora = Sora({
  subsets: ['latin'],
  weight: ['300'],
  variable: '--font-sora',
})

const Contact = () => {
  return (
    <div className={`${sora.variable} font-main w-full py-10`}>
      <h1 className="text-3xl md:text-5xl text-head font-bold mb-8 text-center">Contact Us</h1>
      <p className="text-center text-brown text-lg">
        We’d love to hear from you!
      </p>
      <p className="max-w-xl mx-auto text-center mb-4 text-brown text-lg">
      Whether you have a question about our menu, want to place a custom order, or just want to say hello — feel free to reach out.
      </p>

      <Image src='/cookies.svg' alt='img' width={50} height={10} className='w-full mb-10' />

      <div className='flex flex-col md:flex-row gap-10 px-5 xl:px-20'>
        {/* Left block */}
        <div className='flex flex-col gap-5 md:w-1/2'>
          {/* Contact card 1 */}
          <div className='bg-[#FFF2BB] flex items-center gap-8 py-10 px-5 xl:px-15 rounded-xl'>
            <Image src='/email.svg' alt='img' width={50} height={10} className='w-20' />
            <div className='flex flex-col gap-2'>
              <p className="font-bold text-2xl text-head">E-mail</p>
              <p className='text-brown'>koshibakery@gmail.com</p>
            </div>
          </div>
          <div className='bg-[#FFF2BB] flex items-center gap-8 py-10 px-5 xl:px-15 rounded-xl'>
            <Image src='/teluphun.svg' alt='img' width={50} height={10} className='w-20' />
            <div className='flex flex-col gap-2'>
              <p className="font-bold text-2xl text-head">Phone</p>
              <p className='text-brown'>+9936-00-00-00</p>
            </div>
          </div>
          {/* Карта с delay и анимацией */}
          <div className={`transition-opacity duration-700 rounded-xl overflow-hidden`}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1071.4981834435594!2d58.3254452445361!3d37.971144258080386!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f70010151cb08a9%3A0x68530bdaf2a27e16!2z0KHRg9C_0LXRgNC80LDRgNC60LXRgiAiSGF5cmF0Ig!5e1!3m2!1sru!2s!4v1753448814408!5m2!1sru!2s"
                width="100%"
                height="300"
                loading="lazy"
                className="w-full"
              />
          </div>
        </div>

        {/* Right block: форма */}
        <div className='md:w-1/2 flex flex-col gap-5'>
          <h1 className='text-4xl md:text-6xl font-semibold text-head'>Get In Touch</h1>
          <p className="text-brown xl:text-xl">
            Duis euismod, magna a cursus bibendum, ligula eros suscipit nisl, nec tempus est velit nec nibh. Quisque at velit vitae nulla pretium hendrerit in eget augue.
          </p>
          <div className='flex flex-col gap-5 xl:gap-20'>
            <input name='name' placeholder='Your Name' className='border-b p-3' />
            <input name='email' placeholder='Email' className='border-b  p-3' />
            <textarea placeholder='Message' className='border-b p-3'></textarea>
          </div>
          <button
            type="submit"
            className="w-full my-5 xl:my-20 border-[#264D30] border-2 bg-white hover:text-white font-bold text-xl text-head py-3 rounded-full hover:bg-[#7DDF9A]/90 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default Contact
