import React from 'react'
import { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { googleLogout } from '@react-oauth/google';
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from '@react-oauth/google';
import { Button } from "@/components/ui/button"
import { Typewriter } from 'react-simple-typewriter';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  LogOut, 
  User, 
  PlusCircle, 
  MapPin, 
  Menu,
  X 
} from 'lucide-react';

function Header() {
  const users = JSON.parse(localStorage.getItem('user'));
  const [openDialog, setOpenDialog] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      window.location.reload();
    })
  }

  const handleLogout = () => {
    googleLogout();
    localStorage.removeItem('user');
    window.location.reload();
  }

  return (
    <div className='sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100 px-4 py-3 md:px-6 flex justify-between items-center'>
      {/* Logo */}
      <a href='/' className='flex items-center'>
        <div className='flex items-center'>
          <img src='./logo.svg' className='h-8 w-8 md:h-10 md:w-10' alt='TrekTailor Logo'/>
          <h2 className="ml-2 text-xl md:text-2xl font-bold bg-gradient-to-r from-[#00C897] to-[#f56551] bg-clip-text text-transparent">
            <Typewriter
              words={['TrekTailor', 'Your Travel Buddy', 'Plan with AI']}
              loop={true}
              cursor
              cursorStyle="|"
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={1000}
            />
          </h2>
        </div>
      </a>

      {/* Mobile Menu Button */}
      <button 
        className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-4">
        {users ? (
          <>
            <a href='/create-trip'>
              <Button className="bg-gradient-to-r from-[#00C897] to-[#00A8CC] hover:from-[#00A8CC] hover:to-[#00C897] text-white font-semibold py-2 px-4 rounded-full flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg">
                <PlusCircle size={18} />
                Create Trip
              </Button>
            </a>
            <a href='/my-trips'>
              <Button variant="outline" className="border-[#00C897] text-[#00C897] hover:bg-[#00C897] hover:text-white font-semibold py-2 px-4 rounded-full flex items-center gap-2 transition-colors duration-300">
                <MapPin size={18} />
                My Trips
              </Button>
            </a>
            
            <Popover>
              <PopoverTrigger className="focus:outline-none">
                <div className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
                  <img
                    className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm"
                    src={users?.picture}
                    alt="Profile"
                  />
                  <span className="text-sm font-medium text-gray-700 hidden lg:block">
                    {users?.name}
                  </span>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-3 bg-white rounded-xl shadow-lg border border-gray-200">
                <div className="flex items-center gap-3 p-2 border-b border-gray-100">
                  <img
                    className="h-10 w-10 rounded-full object-cover"
                    src={users?.picture}
                    alt="Profile"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{users?.name}</p>
                    <p className="text-xs text-gray-500">{users?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full mt-2 flex items-center gap-2 p-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <LogOut size={16} />
                  Log Out
                </button>
              </PopoverContent>
            </Popover>
          </>
        ) : (
          <Button 
            onClick={() => setOpenDialog(true)} 
            className="bg-gradient-to-r from-[#00C897] to-[#00A8CC] hover:from-[#00A8CC] hover:to-[#00C897] text-white font-semibold py-2 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Sign In
          </Button>
        )}
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-200 md:hidden p-4">
          {users ? (
            <div className="flex flex-col gap-3">
              <a 
                href='/create-trip' 
                className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 text-gray-800 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                <PlusCircle size={18} />
                Create Trip
              </a>
              <a 
                href='/my-trips' 
                className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 text-gray-800 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                <MapPin size={18} />
                My Trips
              </a>
              <div className="flex items-center gap-3 p-3 border-t border-gray-200 mt-2">
                <img
                  className="h-10 w-10 rounded-full object-cover"
                  src={users?.picture}
                  alt="Profile"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{users?.name}</p>
                  <p className="text-xs text-gray-500">{users?.email}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 p-3 text-red-600 font-medium rounded-lg bg-red-50 mt-2"
              >
                <LogOut size={18} />
                Log Out
              </button>
            </div>
          ) : (
            <Button 
              onClick={() => {
                setOpenDialog(true);
                setMobileMenuOpen(false);
              }} 
              className="w-full bg-gradient-to-r from-[#00C897] to-[#00A8CC] text-white font-semibold py-3"
            >
              Sign In
            </Button>
          )}
        </div>
      )}

      {/* Sign In Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="bg-white rounded-2xl p-6 max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <img src="./logo.svg" className="h-16 w-16" alt="TrekTailor Logo"/>
            </div>
            <DialogTitle className="text-2xl font-bold text-center text-gray-800">
              Welcome to TrekTailor
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-center mt-2">
              Sign in with Google to create personalized travel itineraries
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
          <p className="text-xs text-gray-500 text-center mt-4">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Header