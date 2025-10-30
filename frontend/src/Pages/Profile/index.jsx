import React, { useState } from 'react'
import '../Profile/index.css'
import { apiClient } from '../../api-client.js'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../Store';
import { IoArrowBack } from 'react-icons/io5';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { colors, getColor } from '../../utils/utils';
import { useEffect } from 'react';
import { useRef } from 'react';
import { HOST_ } from '../../Constants.js';
import Avatar from '@mui/material/Avatar';
const Profile = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const [firstname, setFirstname] = useState("")
  const [lastname, setLastname] = useState("")
  const [image, setImage] = useState(null)
  const [hovered, setHovered] = useState(false) 
  const [selectedColor, setSelectedColor] = useState(0)
  const fileInputRef = useRef(null)
  const navigate = useNavigate();
  useEffect(()=>{
    if(userInfo.profilesetup){
      setFirstname(userInfo.firstname)
      setLastname(userInfo.lastname)
      setSelectedColor(userInfo.color)
    }
    if(userInfo.image){
      setImage(`${HOST_}/${userInfo.image}`)
    }
  },[userInfo])
  const showToast = (message, type = 'error') => {
    toast(message, { type, position: 'top-center' });
  };
  const showToastsucc = (message, type = 'success') => {
    toast(message, { type, position: 'top-center' });
  };
  const validate = () =>{
    if(!firstname){
      toast.error("Please Enter First Name")
      return false
    }
    if(!lastname){
      toast.error("Please Enter Last Name")
      return false
    }
    return true
  }
  const saveChanges = async () => {
    if(validate){
      try {
      const response = await apiClient.post('/profilesetup', { firstname, lastname, color:selectedColor }, { withCredentials: true })
      console.log(response.status)
      if (response.status == 200) {
        const updatedUserInfo = {
          ...userInfo,

          firstname:firstname,
          lastname:lastname,
          color:selectedColor,
          profilesetup:true,
        }
        setUserInfo(updatedUserInfo)
        navigate('/chat')
      }
    } catch (error) {
      showToast(error.message)
    }
    }
  }
  const backToChat = ()=>{
    navigate("/chat")
  }
  const handleFileInputClick = () =>{
    fileInputRef.current.click()
  }
  const handleImageChange = async (event)=>{
    const file = event.target.files[0]
    console.log({file})
    if(file){
      const formData = new FormData()
      formData.append("profile-image",file)
      const response = await apiClient.post("/addprofileimg",formData,{withCredentials: true})
      if(response.status === 200 && response.data.image){
        setUserInfo({...userInfo, image:response.data.image})
        toast.success("Image Updated Successfully")
      }
    }
  }
  const handleDeleteImage = async ()=>{
    try {
      const response = await apiClient.delete("/removeprofileimage",{withCredentials:true})
      if(response.status===200){
        setUserInfo({...userInfo , image:null})
        toast.success("Image removed successfully")
        setImage(null)
      }
    } catch (error) {
      console.log(error);
      
    }
  }
  return (
    <div className='flex items-center justify-center flex-col gap-10 h-[100vh] bg-[#1b1c24] w-[100vw]'>
     
      <div className="flex flex-col gap-10 w-[90vw] md:w-max">
        <div>
          <IoArrowBack className='text-4xl lg:text-6xl text-white cursor-pointer' onClick={backToChat}/>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          
          <div 
            className="h-32 w-32 md:w-48 md:h-48 relative flex items-center justify-center mx-auto" 
            onClick={() => setHovered(!hovered)} 
          >
            <div className='h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden flex items-center justify-center' >
              
              {image ? (
                <Avatar src={image} className='w-100 h-100'/>
              ) : (
                <div className={`uppercase h-32 w-32 md:w-48 md:h-48 text-7xl border-[1px] flex items-center justify-center rounded-full  ${getColor(selectedColor)}`} >
                  {firstname
                    ? firstname.split("").shift()
                    : userInfo.email.split("").shift()
                  }
                </div>
              )}
              
            </div>
            {hovered && (
              <div 
                className='absolute inset-0 flex items-center justify-center rounded-full bg-black/50 cursor-pointer'

                onClick={(e) => {
                  e.stopPropagation(); 
                  if (image) {
                    handleDeleteImage();
                  } else {
                    handleFileInputClick();
                  }
                  setHovered(false); 
                }} 
              >
                {image ?
                  <FaTrash className='text-white text-3xl cursor-pointer ' /> :
                  <FaPlus className='text-white text-3xl cursor-pointer ' />}
              </div>
            )}
            <input type="file" ref={fileInputRef} className='hidden' onChange={handleImageChange} name = "profile-image" accept='.png ,.jpg, .jpeg, .svg ,.webp' />
          </div>

          <div className='w-full flex-col gap-5 text-white items-center justify-center'>
            <div className="w-full mb-1">

              <input type="email" disabled value={userInfo.email} className='rounded-lg p-6 bg-[#2c2e3b] border-none w-full' />
            </div>
            <div className="w-full mb-1">
              <input type="name" 
              value={firstname} 
              className='rounded-lg p-6 bg-[#2c2e3b] border-none w-full'
              placeholder='First Name'
              onChange={(e)=> setFirstname(e.target.value)}
              maxLength={8}
              />
            </div>
            <div className="w-full mb-3">

              <input type="text" 
              value={lastname} 
              className='rounded-lg p-6 bg-[#2c2e3b] border-none w-full'
              placeholder='Last Name'
              onChange={(e)=> setLastname(e.target.value)}
              maxLength={10}
              />
            </div>
            <div className="w-full flex gap-4">
                {
                  colors.map((color,index)=>
                     (<div
                     className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300
                     ${
                      setSelectedColor === index
                        ? "outline-5 outline-white"
                        : ""
                     }
                     `}
                     key={index} 
                     onClick={()=> setSelectedColor(index)}
                     ></div>
                    ))}
            </div>
          </div>
        </div>
      <button className='bg-purple-700 hover:bg-purple-900 w-full h-16 rounded-3 transition-all duration-300 text-white' 
      onClick={saveChanges}
      >Save Changes</button>
      </div>
    </div>
  )
}

export default Profile