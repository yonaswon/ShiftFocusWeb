'use client'
import React, { useState } from 'react'
import First from '@/Components/onboarding/First'
import Second from '@/Components/onboarding/Second'
import Thired from '@/Components/onboarding/Thired'
import { GoogleOAuthProvider } from '@react-oauth/google'

const page = () => {
  const [onBoardingIndex,setOnBoardingIndex] = useState<any>(0)

  const component_list = [
    <First setOnBoardingIndex = {setOnBoardingIndex} />,
    <Second setOnBoardingIndex = {setOnBoardingIndex} />,
    <Thired />
  ]

  return (
    
    <div className="bg-[url('/bg.jpg')] w-full h-[100vh] bg-cover bg-center flex justify-center items-center">
      {component_list[onBoardingIndex]}
    </div>
  )
}

export default page
