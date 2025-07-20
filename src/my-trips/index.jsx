import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../services/firebaseConfig';
import UserTripCardItem from './components/UserTripCardItem';
import Footer from '../view-trip/components/Footer';

function MyTrips() {
    
    const navigate = useNavigate();
    const [userTrips, setUserTrips] =useState([]);

    useEffect(() => {
        GetUserTrips();
    }, []);

    const GetUserTrips = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            navigate('/');
            return;
        }

        const q = query(collection(db, "AITrips"), where("userEmail", "==", user?.email));
        const querySnapshot = await getDocs(q);
        const trips = [];
        querySnapshot.forEach((doc) => {
            trips.push(doc.data());
        });

        setUserTrips(trips);
        console.log("Trips fetched:", trips.length);
    };
  return (
    <div className='sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10 flex justify-center flex-col'>
        <h2 className='font-bold text-3xl mb-5'>My Trips</h2>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-5'>
            {userTrips?.length>0?
            userTrips.map((trip,index) =>(
            <UserTripCardItem key={index} trip={trip} />
            )):
            [1,2,3,4,5,6].map((item,index)=>(
            <div key={index} className='w-[200px] h-[150px] bg-slate-200 animate-pulse rounded-xl'>
            </div>))}
        </div>
        <Footer/>
    </div>
  )
}

export default MyTrips
