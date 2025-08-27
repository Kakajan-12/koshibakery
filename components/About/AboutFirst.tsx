import React from 'react'
import { Sora } from 'next/font/google'

const sora = Sora({
  subsets: ['latin'],
  weight: ['300'],
  variable: '--font-sora',
})

const AboutFirst = () => {
  return (
    <div
      className={`${sora.variable} font-main w-full  responsive-height relative overflow-hidden bg-gradient-layer bg-cover bg-no-repeat xl:bg-center p-8 xl:p-20`}
      style={{
        backgroundImage: `url('/about.svg')`,
        
      }}
    >
      <div className="relative z-10 xl:max-w-2xl xl:ml-auto xl:mx-60 space-y-2 xl:space-y-15">
        <h1 className="text-2xl xl:text-6xl text-center md:text-start font-thin text-head">About Us</h1>
        <div className="space-y-15 text-brown">
         <div className='flex flex-col gap-2'>
             <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus rutrum, augue at placerat posuere,
            lorem nisi dictum ex, sed laoreet elit arcu a risus.
          </p>
          <p>
            Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Integer
            dapibus, turpis sed luctus rutrum, erat magna feugiat arcu, sed laoreet nisi risus a odio.
          </p>
         </div>
          <p>
            Duis euismod, magna a cursus bibendum, ligula eros suscipit nisl, nec tempus est velit nec nibh.
            Quisque at velit vitae nulla pretium hendrerit in eget augue.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AboutFirst
