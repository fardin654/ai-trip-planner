import Footer from '@/view-trip/components/Footer'
import React from 'react'
import { Link } from 'react-router-dom'

function Hero() {
  return (
    <div className='flex flex-col items-center mx-56 gap-9'>
      <h1
      className='font-extrabold text-[50px] text-center mt-16'>
        <span className='text-[#f56551]'>Discover Your Next Adventure with AI:</span> Personalized Itineraries at Your Fingertips</h1>
        <p className='text-xl text-gray-500 text-center'>Your Personal trip planner and travel curator, creating custom itineraries tailored to your interests and budget.</p>
        <Link to={'/create-trip'}>
            <button class="bg-black text-white font-semibold py-2 px-4 rounded hover:bg-gray-900">
            Get Started
            </button>
        </Link>
        <img src="\landing.png" className='mt-[0px] h-[25rem] w-[45rem]' alt="Landing Image"/>
        <Footer />
    </div>
  )
}

export default Hero
