import React from 'react'
import PlaceCardItem from './PlaceCardItem';
import { FaCalendarDay, FaClock } from "react-icons/fa";

function PlacesToVisit({trip}) {
    const itinerary = trip?.tripData?.itinerary;
     if (!itinerary || typeof itinerary !== 'object') {
        return (
          <div className="bg-blue-50 p-6 rounded-xl my-8">
            <p className="text-blue-800 text-center">No itinerary data available.</p>
          </div>
        );
    }

    const sortedItinerary = Object.entries(itinerary).sort(
        ([dayA], [dayB]) => {
        const numA = parseInt(dayA.replace(/\D/g, '')) || 0;
        const numB = parseInt(dayB.replace(/\D/g, '')) || 0;
        return numA - numB;
        }
    );

  return (
    <div className="my-10">
      <div className="flex items-center mb-8 justify-center">
        <div className="h-1 w-10 bg-blue-600 rounded-full mr-4"></div>
        <h2 className='font-bold text-3xl text-gray-800'>Places to Visit</h2>
        <div className="h-1 w-10 bg-blue-600 rounded-full ml-4"></div>
      </div>
      
      <div className="space-y-8">
        {sortedItinerary.map(([dayKey, dayValue], index) => (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl shadow-sm" key={index}>
            <div className="flex items-center mb-6">
              <div className="bg-blue-600 p-2 rounded-lg mr-3">
                <FaCalendarDay className="text-white text-lg" />
              </div>
              <h2 className="font-semibold text-xl text-gray-800">
                {dayKey.replace(/day(\d+)/i, (match, p1) => `Day ${p1}`)}
              </h2>
            </div>
            
            <div className='grid md:grid-cols-1 lg:grid-cols-2 gap-6'>
              {dayValue.places.map((place, index) => (
                <div key={index} className="bg-white p-4 rounded-xl shadow-md">
                  <div className="flex items-center mb-3">
                    <FaClock className="text-orange-500 mr-2" />
                    <h2 className='font-medium text-md text-orange-600'>{place.visitTime?place.visitTime:place.timeToSpend}</h2>
                  </div>
                  <PlaceCardItem place={place}/>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PlacesToVisit