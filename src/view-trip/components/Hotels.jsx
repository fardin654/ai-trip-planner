import React from 'react'
import { Link } from 'react-router-dom'
import HotelCardItem from './HotelCardItem'

function Hotels({trip}) {
  return (
    <div>
      <h2 className='text-2xl font-bold my-5'>Recommended Hotels</h2>

      <div className='grid md:grid-cols-2 gap-5'>
        {trip?.tripData?.hotelOptions?.map((hotel, index) => (
          <HotelCardItem hotel={hotel}/>
        ))
        }
      </div>
    </div>
  )
}

export default Hotels
