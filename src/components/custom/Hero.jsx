import Footer from '@/view-trip/components/Footer'
import React from 'react'
import { Link } from 'react-router-dom'

function Hero() {
  return (
    <div className='flex flex-col items-center px-4 sm:px-8 md:px-16 lg:px-24 xl:px-56 gap-6 sm:gap-9'>
      <h1 className='font-extrabold text-3xl sm:text-4xl md:text-5xl text-center mt-10 sm:mt-16'>
        <span className='text-[#f56551]'>Discover Your Next Adventure with AI:</span> Personalized Itineraries at Your Fingertips
      </h1>
      
      <p className='text-base sm:text-lg md:text-xl text-gray-500 text-center max-w-2xl'>
        Your personal trip planner and travel curator, creating custom itineraries tailored to your interests and budget.
      </p>
      
      <Link to={'/create-trip'}>
        <button className="bg-black text-white font-semibold py-2 px-5 rounded hover:bg-gray-900 text-sm sm:text-base">
          Get Started
        </button>
      </Link>

      <img 
        src="/landing.png" 
        className='w-full max-w-[720px] h-auto mt-6' 
        alt="Landing Image"
      />

      <Footer />
    </div>
  )
}

export default Hero
