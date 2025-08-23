import React from 'react'
import { useParams } from 'react-router-dom';
import { db } from '@/services/firebaseConfig';
import {doc,getDoc} from 'firebase/firestore'
import { useEffect,useState } from 'react';
import InfoSection from '../components/InfoSection';
import Hotels from '../components/Hotels';
import PlacesToVisit from '../components/PlacesToVisit';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';

function Viewtrip() {

  const {tripId} = useParams();
  const [trip,setTrip] = useState([])
  const [loading,setLoading] = useState(true);

  useEffect(()=>{
    tripId && GetTripData();
  },[tripId])

  const GetTripData = async ()=>{
    setLoading(true);
    const docRef = doc(db,'AITrips',tripId);
    const docSnap = await getDoc(docRef);

    if(docSnap.exists()){
      console.log("Document: "+docSnap.data());
      setTrip(docSnap.data());
    }else{
      console.log("No Such Document");
    }
    setLoading(false);
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
     <div className='min-h-screen bg-gray-50'>
      <div className='p-6 md:px-12 lg:px-24 xl:px-36 max-w-7xl mx-auto'>
        {/*Information Section*/}
        <InfoSection trip={trip}/>

        {/*Recommended Hotels*/}
        <Hotels trip={trip}/>

        {/*Daily Plan*/}
        <PlacesToVisit trip={trip}/> 

        {/*Footer*/}
        <Footer trip={trip}/>
      </div>
    </div>
  )
}

export default Viewtrip
