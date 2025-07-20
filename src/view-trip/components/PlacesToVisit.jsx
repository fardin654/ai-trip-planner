import React from 'react'
import PlaceCardItem from './PlaceCardItem';

function PlacesToVisit({trip}) {
    const itinerary = trip?.tripData?.itinerary;
     if (!itinerary || typeof itinerary !== 'object') {
        return <p className="text-red-500">No itinerary data available.</p>;
    }

    const sortedItinerary = Object.entries(itinerary).sort(
        ([dayA], [dayB]) => {
        const numA = parseInt(dayA.replace(/\D/g, '')) || 0;
        const numB = parseInt(dayB.replace(/\D/g, '')) || 0;
        return numA - numB;
        }
    );

  return (
    <div>
      <h2 className='font-bold text-2xl mt-5'>Places to Visit</h2>
      <div>
        {sortedItinerary.map(([dayKey, dayValue], index) => (
          <div className='mt-5' key={index}>
            <h2 className="font-medium text-lg">
            {dayKey.replace(/day(\d+)/i, (match, p1) => `Day ${p1}`)}
            </h2>
            <div className='grid md:grid-cols-2 gap-5'>
            {dayValue.places.map((place,index)=>(
                <div>
                    <h2 className='font-medium text-sm text-orange-600'>{place.visitTime}</h2>
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
