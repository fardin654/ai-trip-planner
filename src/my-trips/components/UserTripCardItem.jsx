import React, { useEffect, useState } from 'react'
const unsplash = import.meta.env.VITE_UNSPLASH_ACCESS_KEY
import { Link } from 'react-router-dom';


function UserTripCardItem({trip}) {

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
    <Link to={'/view-trip/'+trip?.id}>
        <div className='hover:scale-105 transition-all'>
        <img src={imageUrl?imageUrl:'/placeholder.jpg'} className='w-[200px] h-[150px] object-cover rounded-xl'/>
        <div>
            <h2 className='font-bold text-lg'>{trip?.userSelection?.location?.name}</h2>
            <h2 className='text-sm text-gray-500'>{trip?.userSelection?.noOfDays} days trip with {trip?.userSelection?.Budget} budget</h2>
        </div>
        </div>
    </Link>
  )
}

export default UserTripCardItem
