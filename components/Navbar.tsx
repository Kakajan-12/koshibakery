'use client'
import Link from 'next/link';
import { useEffect } from 'react';
import { useState } from 'react'
import { Sora } from 'next/font/google'
import CartIcon from './CartShop/CartIcon';
import Image from 'next/image';

const sora = Sora({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-sora',
})

const Navbar = () => {
  const [visible, setVisible] = useState(false)
  const [isScroll,setIsScroll] = useState(false)

  useEffect(() => {
    window.addEventListener('scroll',() => {
      setIsScroll(scrollY > 30)
    })
  },[])

  

  return (
    <div className={`px-4 sticky top-0 z-99 md:px-20 py-3 sm:py-8 flex items-center justify-between md:border-none border-b 
      ${isScroll ? 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)]' : ''}
      ${sora.variable}`}
    >
      <div className="flex items-center justify-between">
       <Link href={`/`}>
        <Image width={20} height={10} src="/logo.svg" alt="Logo" className="w-20 h-auto" />
       </Link>
      </div>

      {/* Navigation */}
      <nav className={`hidden lg:flex items-center`}>
        <ul className={`flex items-center justify-center gap-15 text-[#3B3B3B] font-main`}>
          <Link href={`/`}><li className="hover:text-black transition cursor-pointer">Home</li></Link>
          <Link href={`/order`}><li className="hover:text-black transition cursor-pointer">Menu</li></Link>
          <Link href={`/about`}><li className="hover:text-black transition cursor-pointer">About Us</li></Link>
          <Link href={`/contact`}><li className="hover:text-black transition cursor-pointer">Contact</li></Link>
        </ul>
      </nav>

      {/* Icons */}
     <div className='flex items-center'>
         <div className="flex items-center gap-5 lg:gap-10 ">
       <CartIcon/>
      </div>

      {/* Hamburger icon */}
      <div className="lg:hidden px-4">
        <Image
        width={20}
        height={10}
          onClick={() => setVisible(prev => !prev)}
          src="/menu.png"
          alt="menu_icon"
          className="w-6 cursor-pointer"
        />
      </div>
     </div>

      {/* Mobile Menu */}
      <div
  className={`fixed top-18 left-0 w-full h-1/2 bg-white z-55 transition-all duration-300 ease-in-out 
    ${visible ? 'opacity-100 bg-white' : 'opacity-0 scale-95 pointer-events-none'}
    `}
>
  <div className="flex flex-col text-[#4b3f30] font-medium p-10 space-y-10">
    {/* Back Button */}
    

    {/* Mobile links */}
    <Link href="/" onClick={() => setVisible(false)} className='text-2xl font-main font-thin'>
     Home
    </Link>
    <Link href="/order" onClick={() => setVisible(false)} className='text-2xl font-main font-thin'>
     Menu
    </Link>
    <Link href="/about" onClick={() => setVisible(false)} className='text-2xl font-main font-thin'>
      About Us
    </Link>
    <Link href="/contact" onClick={() => setVisible(false)} className='text-2xl font-main font-thin'>
      Contact
    </Link>

    

  </div>
</div>

    </div>
  )
}

export default Navbar
