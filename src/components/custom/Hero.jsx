import Footer from '@/view-trip/components/Footer'
import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Compass, 
  MapPin, 
  Star, 
  Calendar,
  Users 
} from 'lucide-react';

function Hero() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-8 md:px-16 lg:px-24 xl:px-36 gap-8 sm:gap-10 bg-gradient-to-b from-white to-blue-50">
      {/* Main Content */}
      <div className="flex flex-col items-center text-center max-w-4xl">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full mb-6 text-sm font-medium"
        >
          <Compass size={16} />
          <span>AI-Powered Travel Planning</span>
        </motion.div>
        
        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight mb-6'
        >
          Discover Your Next
          <span className="block bg-gradient-to-r from-[#f56551] to-[#00C897] bg-clip-text text-transparent">
            Adventure with AI
          </span>
        </motion.h1>
        
        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='text-lg sm:text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl leading-relaxed'
        >
          Your personal trip planner and travel curator, creating custom itineraries 
          tailored to your interests and budget.
        </motion.p>
        
        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link to={'/create-trip'}>
            <button className="group relative bg-gradient-to-r from-[#f56551] to-[#00C897] text-white font-semibold py-4 px-8 rounded-full hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-3">
              <span>Get Started</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </motion.div>
      </div>

      {/* Feature Icons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex flex-wrap justify-center gap-6 sm:gap-10 mt-8"
      >
        {[
          { icon: MapPin, text: "Custom Destinations" },
          { icon: Calendar, text: "Daily Itineraries" },
          { icon: Users, text: "Group Planning" },
          { icon: Star, text: "Curated Experiences" }
        ].map((item, index) => (
          <div key={index} className="flex flex-col items-center text-center p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-blue-100 p-3 rounded-full mb-3">
              <item.icon size={24} className="text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">{item.text}</span>
          </div>
        ))}
      </motion.div>

      {/* Hero Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="mt-10 sm:mt-16 max-w-5xl w-full"
      >
        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          <img 
            src="/landing.png" 
            className='w-full h-auto' 
            alt="AI travel planning interface showing personalized itineraries"
          />
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="w-full mt-16"
      >
        <Footer />
      </motion.div>
    </div>
  )
}

export default Hero