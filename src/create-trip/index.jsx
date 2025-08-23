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
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  Sparkles,
  ChevronDown,
  Search
} from 'lucide-react';

function CreateTrip() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [days, setDays] = useState(null);
  const [formData,setFormData] = useState({});
  const [openDialog,setOpenDialog] = useState(false);
  const [loading,setloading] = useState(false);
  const [activeSection, setActiveSection] = useState('destination');
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
      
      // Auto-advance to next section
      if (name === 'location' && value) setActiveSection('duration');
      if (name === 'noOfDays' && value) setActiveSection('budget');
      if (name === 'Budget' && value) setActiveSection('travelers');
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
      toast.error("Please fill all details to continue",toastOptions)
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
    console.log("API Key:", import.meta.env.VITE_OPENCAGE_API_KEY[0]); // Debugging line 
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
          searchText
        )}&key=${import.meta.env.VITE_OPENCAGE_API_KEY}`
      );

      const data = await response.json();

      // OpenCage returns results in data.results[]
      const suggestions = data.results.map(result => ({
        name: result.formatted,
        lat: result.geometry.lat,
        lng: result.geometry.lng
      }));

      setSuggestions(suggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
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

  // Progress tracking
  const progress = () => {
    let completed = 0;
    if (formData.location) completed++;
    if (formData.noOfDays) completed++;
    if (formData.Budget) completed++;
    if (formData.traveller) completed++;
    return (completed / 4) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-6">
            <Sparkles className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="font-bold text-4xl md:text-5xl text-gray-900 mb-4">
            Plan Your Perfect Trip
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Just provide some basic information, and our AI will create a personalized itinerary tailored to your preferences
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Trip Details</span>
            <span className="text-sm font-medium text-blue-600">{Math.round(progress())}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${progress()}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-10">
          {/* Destination Section */}
          <div 
            className={`mb-8 pb-8 ${activeSection === 'destination' ? 'border-b border-gray-200' : ''}`}
            onClick={() => setActiveSection('destination')}
          >
            <div className="flex items-center mb-6 cursor-pointer">
              <div className={`flex items-center justify-center h-10 w-10 rounded-full ${formData.location ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'} mr-4`}>
                <MapPin size={20} />
              </div>
              <h2 className="text-[1.3rem] font-semibold text-gray-900">Where do you want to go?</h2>
              <ChevronDown className={`ml-auto transform ${activeSection === 'destination' ? 'rotate-180' : ''} transition-transform text-gray-400`} />
            </div>
            
            {activeSection === 'destination' && (
              <div className="pl-14 animate-fade-in">
                <div className="relative">
                  <Search className="absolute left-3 top-5 h-5 w-5 text-gray-400" />
                  <input
                    type="text" 
                    value={query} 
                    onChange={handleInputChange} 
                    placeholder="Enter your dream destination" 
                    className="w-full pl-10 p-4 border border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                {suggestions.length > 0 && (
                  <ul className="mt-3 border border-gray-200 rounded-xl shadow-lg overflow-hidden animate-fade-in">
                    {suggestions.slice(0, 5).map((place, index) => (
                      <li
                        key={index}
                        onClick={() => handleSuggestionClick(place)}
                        className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                      >
                        {place.name}
                      </li>
                    ))}
                  </ul>
                )}
                {formData.location && (
                  <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg inline-flex items-center">
                    <MapPin size={16} className="mr-2" />
                    <span>Selected: {formData.location.name}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Duration Section */}
          <div 
            className={`mb-8 pb-8 ${activeSection === 'duration' ? 'border-b border-gray-200' : ''}`}
            onClick={() => setActiveSection('duration')}
          >
            <div className="flex items-center mb-6 cursor-pointer">
              <div className={`flex items-center justify-center h-10 w-10 rounded-full ${formData.noOfDays ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'} mr-4`}>
                <Calendar size={20} />
              </div>
              <h2 className="text-[1.3rem] font-semibold text-gray-900">How many days?</h2>
              <ChevronDown className={`ml-auto transform ${activeSection === 'duration' ? 'rotate-180' : ''} transition-transform text-gray-400`} />
            </div>
            
            {activeSection === 'duration' && (
              <div className="pl-14 animate-fade-in">
                <div className="relative max-w-xs">
                  <input
                    type="number"
                    value={days}
                    onChange={handleDaysChange}
                    placeholder="Ex. 3 days"
                    className="w-full p-4 border border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1" 
                    max="5"
                  />
                  <span className="absolute right-4 top-4 text-gray-500">days</span>
                </div>
                {formData.noOfDays && (
                  <p className="mt-3 text-blue-600 font-medium">
                    Perfect! A {formData.noOfDays}-day trip coming up!
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Budget Section */}
          <div 
            className={`mb-8 pb-8 ${activeSection === 'budget' ? 'border-b border-gray-200' : ''}`}
            onClick={() => setActiveSection('budget')}
          >
            <div className="flex items-center mb-6 cursor-pointer">
              <div className={`flex items-center justify-center h-10 w-10 rounded-full ${formData.Budget ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'} mr-4`}>
                <DollarSign size={20} />
              </div>
              <h2 className="text-[1.3rem] font-semibold text-gray-900">What's your budget?</h2>
              <ChevronDown className={`ml-auto transform ${activeSection === 'budget' ? 'rotate-180' : ''} transition-transform text-gray-400`} />
            </div>
            
            {activeSection === 'budget' && (
              <div className="pl-14 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {SelectBudgetOptions.map((item,index)=>(
                    <div key={index} 
                      className={
                        `p-5 border-2 rounded-xl transition-all duration-300 hover:shadow-lg hover:border-blue-400 cursor-pointer flex flex-col items-center text-center
                        ${formData?.Budget===item.title ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200'}`}
                      onClick={()=>{handleInput('Budget',item.title)}}
                    >
                      <div className="text-4xl text-blue-500 mb-3">{item.icon}</div>
                      <h2 className="font-bold text-gray-800">{item.title}</h2>
                      <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Travelers Section */}
          <div onClick={() => setActiveSection('travelers')}>
            <div className="flex items-center mb-6 cursor-pointer">
              <div className={`flex items-center justify-center h-10 w-10 rounded-full ${formData.traveller ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'} mr-4`}>
                <Users size={20} />
              </div>
              <h2 className="text-[1.3rem] font-semibold text-gray-900">Who's traveling?</h2>
              <ChevronDown className={`ml-auto transform ${activeSection === 'travelers' ? 'rotate-180' : ''} transition-transform text-gray-400`} />
            </div>
            
            {activeSection === 'travelers' && (
              <div className="pl-14 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {SelectTravelerList.map((item, index) => (
                    <div key={index}
                      className={
                        `p-5 border-2 rounded-xl transition-all duration-300 hover:shadow-lg hover:border-blue-400 cursor-pointer flex flex-col items-center text-center
                        ${formData?.traveller===item.people ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200'}`}
                      onClick={()=>{handleInput('traveller',item.people)}}
                    >
                      <div className="text-4xl text-blue-500 mb-3">{item.icon}</div>
                      <h2 className="font-bold text-gray-800">{item.title}</h2>
                      <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Generate Button */}
        <div className="text-center">
          <Button 
            className="px-10 py-6 text-lg font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            disabled={loading || progress() < 100}
            onClick={onGenerateTrip}
          >
            {loading ? (
              <>
                <AiOutlineLoading3Quarters className="h-6 w-6 animate-spin mr-2"/>
                Creating your itinerary...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                Generate My Trip Plan
              </>
            )}
          </Button>
          
          {progress() < 100 && !loading && (
            <p className="mt-4 text-gray-500">
              Complete all sections above to generate your trip
            </p>
          )}
        </div>
      </div>

      <ToastContainer/>
      <Dialog open={openDialog}>
        <DialogContent className="bg-white rounded-2xl p-6 max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <img src="logo.svg" className="h-16 w-16" alt="TrekTailor Logo"/>
            </div>
            <DialogTitle className="text-2xl font-bold text-center text-gray-800">
              Sign In Required
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-center mt-2">
              Please sign in with Google to create your personalized trip itinerary
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6">
            <Button 
              onClick={login} 
              className="w-full py-3 rounded-xl font-semibold text-gray-800 bg-white border border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-3 shadow-md transition-all duration-300"
            >
              <FcGoogle className="h-6 w-6" />
              Sign in with Google
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default CreateTrip;