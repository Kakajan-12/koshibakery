'use client'
import React, { useEffect, useState } from 'react'

const ScrollTop = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300)
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={scrollTop}
        className={`
          transition-all duration-500 ease-in-out
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
          bg-green-200 text-green-800 shadow-md rounded-full w-14 h-14 flex items-center justify-center
          hover:bg-green-300 active:scale-95
        `}
        aria-label="Scroll to top"
      >
        <img src="/up.svg" alt="Up" className="w-6 h-6" />
      </button>
    </div>
  )
}

export default ScrollTop
