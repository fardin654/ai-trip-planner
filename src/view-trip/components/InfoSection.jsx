import { Button } from '@/components/ui/button'
import { getPlaceDetails } from '@/services/GlobalApi';
import React from 'react'
import { IoShareOutline } from "react-icons/io5";
import { useEffect,useState } from 'react';
const unsplash = import.meta.env.VITE_UNSPLASH_ACCESS_KEY
import { FaCalendarAlt, FaDollarSign, FaUserFriends, FaMapMarkerAlt } from "react-icons/fa";

function InfoSection({trip}) {
const [imageUrl, setImageUrl] = useState("");
const [imageLoading, setImageLoading] = useState(true);

useEffect(() => {
  trip && GetPlacePhoto();
}, [trip]);

const GetPlacePhoto = async () => {
  setImageUrl("");
  setImageLoading(true);

  const placeName = trip?.userSelection?.location?.name;
  if (!placeName) return;

  try {
    const unsplashRes = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        placeName
      )}&client_id=${unsplash}`
    );

    const unsplashData = await unsplashRes.json();
    const imgUrl = unsplashData?.results?.[0]?.urls?.regular;

    if (imgUrl) {
      setImageUrl(imgUrl);
    } else {
      console.log("No image found on Unsplash");
    }
  } catch (err) {
    console.error("Error fetching image from Unsplash:", err);
  } finally{
    setImageLoading(false);
  }
};


  return (
    <div className="mb-12">
      <div className="relative h-80 md:h-96 lg:h-[30rem] rounded-2xl overflow-hidden shadow-lg">
        {imageLoading ? (
          <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="text-gray-400">Loading image...</div>
          </div>
        ) : (
          <img 
            src={imageUrl || '/placeholder.jpg'} 
            className="w-full h-full object-cover transition-opacity duration-300" 
            alt={trip?.userSelection?.location?.name}
            onLoad={() => setImageLoading(false)}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <div className="p-6 text-white">
            <h1 className="font-bold text-3xl md:text-4xl mb-2">{trip?.userSelection?.location?.name}</h1>
            <p className="text-gray-200">Your personalized travel itinerary</p>
          </div>
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FaCalendarAlt className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Duration</p>
            <p className="font-semibold">{trip.userSelection?.noOfDays} Days</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <FaDollarSign className="text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Budget</p>
            <p className="font-semibold">${trip.userSelection?.Budget}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <FaUserFriends className="text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Travelers</p>
            <p className="font-semibold">{trip.userSelection?.traveller}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <FaMapMarkerAlt className="text-orange-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Destination</p>
            <p className="font-semibold truncate">{trip?.userSelection?.location?.name}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InfoSection
