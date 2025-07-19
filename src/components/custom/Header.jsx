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

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


function Header() {
  const users = JSON.parse(localStorage.getItem('user'));
  const [openDialog,setOpenDialog] = useState(false);

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

  
  return (
    <div className='p-3 shadow-sm flex justify-between items-center px-5'>
      <a href='/'><img src='./logo.svg'/></a>
      <div>
        {users?
        <div className="flex items-center gap-4">
          <a href='/create-trip'>
          <button className="bg-black cursor-pointer text-white font-semibold py-2 px-4 rounded-full hover:bg-gray-500">
            + Create Trip
          </button>
          </a>
          <a href='/my-trips'>
          <button className="bg-black cursor-pointer text-white font-semibold py-2 px-4 rounded-full hover:bg-gray-500">
            My Trips
          </button>
          </a>
          
          <Popover>
            <PopoverTrigger>
              <img
                className="h-[35px] w-[35px] rounded-full object-cover cursor-pointer"
                src={users?.picture}
                alt="Profile"
              />
            </PopoverTrigger>
            <PopoverContent className="bg-white shadow-md rounded p-2">
              <h3 className="text-black cursor-pointer" onClick={() => {
                googleLogout();
                localStorage.removeItem('user');
                window.location.reload();}}
              >Log Out</h3></PopoverContent>
          </Popover>
        </div>:
        <button onClick={()=>{setOpenDialog(true)}} className="bg-black cursor-pointer text-white font-semibold py-2 px-4 rounded hover:bg-gray-500">
          Sign In
        </button>
      }
      </div>
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
  )
}

export default Header
