import React from 'react'
import { useParams } from 'react-router-dom';
import { db } from '@/services/firebaseConfig';
import {doc,getDoc} from 'firebase/firestore'
import { useEffect,useState } from 'react';
import InfoSection from '../components/InfoSection';
import Hotels from '../components/Hotels';
import PlacesToVisit from '../components/PlacesToVisit';
import Footer from '../components/Footer';

function Viewtrip() {

  const {tripId} = useParams();
  const [trip,setTrip] = useState([])

  useEffect(()=>{
    tripId && GetTripData();
  },[tripId])

  const GetTripData = async ()=>{
    const docRef = doc(db,'AITrips',tripId);
    const docSnap = await getDoc(docRef);

    if(docSnap.exists()){
      console.log("Document: "+docSnap.data());
      setTrip(docSnap.data());
    }else{
      console.log("No Such Document");
    }
  }

  return (
    <div className='p-10 md:px-20 lg:px-44 xl:px-56'>
      {/*Information Section*/}
      <InfoSection trip={trip}/>

      {/*Recommended Hotels*/}
      <Hotels trip={trip}/>

      {/*Daily Plan*/}
      <PlacesToVisit trip={trip}/> 

      {/*Footer*/}
      <Footer trip={trip}/>

    </div>
  )
}

export default Viewtrip
