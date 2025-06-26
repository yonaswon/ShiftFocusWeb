'use client'
import React, { useState } from 'react'
import First from '@/Components/onboarding/First'
import Second from '@/Components/onboarding/Second'

const page = () => {
  const [onBoardingIndex,setOnBoardingIndex] = useState<any>(0)

  const component_list = [
    <First setOnBoardingIndex = {setOnBoardingIndex} />,
    <Second />
  ]

  return (
    <div className="bg-[url('/bg.jpg')] w-full h-[100vh] bg-cover bg-center">
      {component_list[onBoardingIndex]}
    </div>
  )
}

export default page
