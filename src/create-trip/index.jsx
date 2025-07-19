import { SelectBudgetOptions, SelectTravelerList, systemprompt } from '@/constants/options';
import { chatSession } from '@/services/AIModel';
import axios from 'axios';
import { Input } from 'postcss';
import React, { useEffect, useState } from 'react';
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from '@react-oauth/google';
import { setDoc,doc } from 'firebase/firestore';
import { db } from '@/services/firebaseConfig';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';



function CreateTrip() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [days, setDays] = useState(null);
  const [formData,setFormData] = useState({});
  const [openDialog,setOpenDialog] = useState(false);
  const [loading,setloading] = useState(false);
  const navigate = useNavigate();

  const toastOptions = {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  }

  const handleInput=(name,value)=>{
      if(name=='noOfDays' && value>5){
        console.log("Invalid days");
      }
      setFormData({
        ...formData,
        [name]:value
      })
  }
  useEffect(()=>{
    console.log(formData)
  },[formData])

  const onGenerateTrip=async ()=>{

    const user = localStorage.getItem('user');
    if(!user){
      setOpenDialog(true);
      return;
    }

    if(!formData.noOfDays || !formData.Budget || !formData.traveller || !formData.location){
      toast.error("Fill all details",toastOptions)
      return;
    }else if(formData?.noOfDays>5){
        toast.error("The number of days can be a maximum of 5", toastOptions);
        return;
    }

    setloading(true);
    const FinalPrompt = systemprompt
    .replace('{location}',formData?.location?.display_name)
    .replace('{totalDays}',formData?.noOfDays)
    .replace('{traveller}',formData?.traveller)
    .replace('{budget}',formData?.Budget)
    .replace('{totalDays}',formData?.noOfDays)

    const result = await chatSession.sendMessage(FinalPrompt);
    console.log(result?.response?.text());
    setloading(false);
    SaveAiTrip(result?.response?.text());
    
  }

  const SaveAiTrip = async (TripData)=>{
    setloading(true);
    const user = JSON.parse(localStorage.getItem('user'));
    const docId = Date.now().toString();
    await setDoc(doc(db, "AITrips", docId), {
      userSelection : formData,
      tripData : JSON.parse(TripData),
      userEmail : user?.email,
      id : docId,
    });
    setloading(false);
    navigate('/view-trip/'+docId);
  }
  const login = useGoogleLogin({
    onSuccess:(codeResp)=>getUserProfile(codeResp),
    onError:(error)=>console.log(error)
  })

  const getUserProfile = async(tokenInfo)=>{
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,{
      headers:{
        Authorization:`Bearer ${tokenInfo?.access_token}`,
        Accept:'Application/json'
      }
    }).then((resp)=>{
      console.log(resp);
      localStorage.setItem('user',JSON.stringify(resp.data));
      setOpenDialog(false);
      onGenerateTrip();
    })
  }
  

  const fetchSuggestions = async (searchText) => {
    if (searchText.length > 2) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchText)}`
        );
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    fetchSuggestions(value);
  };

  const handleSuggestionClick = (place) => {
    setSelectedPlace(place);
    setQuery(place.display_name);
    setSuggestions([]);
    handleInput('location',place);
  };

  const handleDaysChange = (e) => {
    const value = e.target.value;
    setDays(value);
    handleInput('noOfDays',value);
  };

  return (
    <div className='sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10'>
      <h2 className='font-bold text-3xl'>#Tell Us Your Travel Preferences🏕️🍁</h2>
      <p className='mt-3 text-gray-500 text-xl'>
        Just Provide Some Basic Information, And Our Trip Planner Will Generate A Customized Itinerary Based On Your Preferences
      </p>
      <div className='mt-20 flex flex-col gap-10'>
        <div>
          <h2 className='text-xl my-3 font-medium'>What Is Destination Of Choice?</h2>
          <input
            type="text" value={query} onChange={handleInputChange} placeholder="Enter a location" className="w-full p-2 border border-gray-300 rounded-md"
          />
          {suggestions.length > 0 && (
            <ul className="mt-2 border border-gray-300 rounded-md">
              {suggestions.map((place, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(place)}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {place.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h2 className='text-xl my-3 font-medium'>How Many Days Are You Planning Your Trip</h2>
          <input
            type="number"
            value={days}
            onChange={handleDaysChange}
            placeholder="Ex. 3"
            className="w-full p-2 border border-gray-300 rounded-md"
            min="1" 
          />
        </div>

        <div>
          <h2 className="text-xl my-3 font-medium">What Is Your Budget?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-5">
            {SelectBudgetOptions.map((item,index)=>(
              <div key={index} 
                className={
                  `p-6 border border-gray-200 rounded-lg transition-all duration-300 hover:shadow-xl hover:border-blue-500 cursor-pointer
                  ${formData?.Budget==item.title && 'shadow-lg bg-blue-50'}`}
                onClick={()=>{handleInput('Budget',item.title)
                }}>
                <h2 className="text-4xl text-blue-500 mb-4">{item.icon}</h2>
                <h2 className="font-bold text-lg text-gray-800">{item.title}</h2>
                <h2 className="text-sm text-gray-500 mt-2">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl my-3 font-medium">Who Do You Plan On Travelling With On Your Next Adventure?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-5">
            {SelectTravelerList.map((item, index) => (
              <div key={index}
                className={
                  `p-6 border border-gray-200 rounded-lg transition-all duration-300 hover:shadow-xl hover:border-blue-500 cursor-pointer
                  ${formData?.traveller==item.people && 'shadow-lg bg-blue-50'}`}
                onClick={()=>{handleInput('traveller',item.people)}}
              >
                <h2 className="text-4xl text-blue-500 mb-4">{item.icon}</h2>
                <h2 className="font-bold text-lg text-gray-800">{item.title}</h2>
                <h2 className="text-sm text-gray-500 mt-2">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>

        <Button className="mt-10 w-full sm:w-auto px-8 py-3 cursor-pointer bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 mb-5"
        disabled={loading}
        onClick={onGenerateTrip}>
        {loading?
          <AiOutlineLoading3Quarters className="h-7 w-7 animate-spin"/>:"Generate Trip"
        }
        </Button>
    

      </div>
      <ToastContainer/>
      <Dialog open={openDialog}>
        <DialogContent  className="bg-blue-900 text-white">
          <DialogHeader>
            <DialogDescription>
              <img src="logo.svg"/>
              <h2 className="font-bold text-lg mt-5">Sign in with Google</h2>
              <p>Sign in with Google Authentication securely</p>
              <Button onClick={login} className="mt-3 cursor-pointer font-bold w-full hover:bg-blue-700 flex gap-4 items-center" variant="outline">
              <FcGoogle className="h-7 w-7"/>Sign in with Google
            
              </Button>
              </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

    </div>
  );
}

export default CreateTrip;