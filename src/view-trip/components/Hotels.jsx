import React from 'react'
import { Link } from 'react-router-dom'
import HotelCardItem from './HotelCardItem'
import { FaHotel, FaStar, FaMapMarkerAlt } from "react-icons/fa";

function Hotels({trip}) {
  // Check if there are any hotel options
  const hasHotels = trip?.tripData?.hotelOptions && trip.tripData.hotelOptions.length > 0;
  
  return (
    <div className="my-10">
      {/* Header Section */}
      <div className="flex flex-col items-center mb-8 text-center">
        <div className="bg-blue-100 p-3 rounded-full mb-4">
          <FaHotel className="text-blue-600 text-2xl" />
        </div>
        <h2 className='text-3xl font-bold text-gray-800 mb-2'>Recommended Hotels</h2>
        <p className="text-gray-600 max-w-lg">Carefully selected accommodations that match your preferences and budget</p>
      </div>

      {/* Hotels Grid */}
      {hasHotels ? (
        <div className='grid md:grid-cols-1 lg:grid-cols-2 gap-6'>
          {trip.tripData.hotelOptions.map((hotel, index) => (
            <HotelCardItem key={index} hotel={hotel}/>
          ))}
        </div>
      ) : (
        <div className="bg-blue-50 p-8 rounded-2xl text-center">
          <FaHotel className="text-blue-400 text-4xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-blue-800 mb-2">No Hotels Available</h3>
          <p className="text-blue-600">We couldn't find hotel recommendations for your trip.</p>
        </div>
      )}

      {/* Additional Information */}
      {hasHotels && (
        <div className="mt-8 bg-gray-50 p-5 rounded-xl border border-gray-200">
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <div className="flex items-center">
              <FaStar className="text-yellow-500 mr-2" />
              <span className="text-sm text-gray-700">Ratings based on user reviews</span>
            </div>
            <div className="flex items-center">
              <FaMapMarkerAlt className="text-red-500 mr-2" />
              <span className="text-sm text-gray-700">Click on hotels to view location</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Hotels