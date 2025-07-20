import { Button } from '@/components/ui/button'
import { getPlaceDetails } from '@/services/GlobalApi';
import React from 'react'
import { IoShareOutline } from "react-icons/io5";
import { useEffect,useState } from 'react';
const unsplash = import.meta.env.VITE_UNSPLASH_ACCESS_KEY

function InfoSection({trip}) {
const [imageUrl, setImageUrl] = useState("");

useEffect(() => {
  trip && GetPlacePhoto();
}, [trip]);

const GetPlacePhoto = async () => {
  setImageUrl("");

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
  }
};


  return (
    <div>
      <img src={imageUrl?imageUrl:'/placeholder.jpg'} className='h-[30rem] w-full object-cover rounded-xl'/>
        
        <div className='flex justify-between items-center mt-5'>
          <div className='my-5 flex flex-col gap-2'>
              <h2 className='font-bold text-2xl'>{trip?.userSelection?.location?.name}</h2>
              <div className='flex gap-5'>
                <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-sm md:text-md'>📆 {trip.userSelection?.noOfDays} Day</h2>
                <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-sm md:text-md'>💵 {trip.userSelection?.Budget} Budget</h2>
                <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-sm md:text-md'>🎲 No. of Travellers: {trip.userSelection?.traveller}</h2>
              </div>
          </div>
          {/* <Button className='bg-black text-white hover:bg-gray-800 w-[5%]'><IoShareOutline /></Button> */}
        </div>
    </div>
  )
}

export default InfoSection
