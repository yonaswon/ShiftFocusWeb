'use client'
import React from 'react'
import { motion } from "framer-motion"

const lines = [
  "Don't Think About White Lion",
  "You Just Did",
  "You Can't Quit Watching Porn and Masturbating by Deciding to Quit",
"Shift Your Focus When The Urge Hits ! "
]

const First = ({setOnBoardingIndex}:any) => {
  // Custom animation settings for each line
  const animationSettings = [
    { delay: 0.5, duration: 0.8 }, 
    { delay: 3, duration: 0.6 }, // Second line (appears later)
    { delay: 5, duration: 0.8 }, // Third line
    { delay: 8, duration: 0.9 }  // Fourth line
  ]

  return (
    <div className='w-full h-screen flex flex-col text-2xl font-bold gap-3 items-center justify-center text-white'>
      {lines.map((text, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: animationSettings[index].delay,
            duration: animationSettings[index].duration,
            ease: 'easeOut'
          }}
        >
          {text.includes("White Lion") ? (
            <div className='text-red-500'>Don't Think About <span className='text-white'>White Lion</span></div>
          ) : text}
        </motion.div>
      ))}

      <motion.button
        // className="mt-5 px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition"
        className={`mt-6 px-12 py-2 rounded-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transition-all  hover:from-blue-500 hover:to-purple-500 hover:shadow-xl`}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 8.5, duration: 0.6, ease: 'easeOut' }}

        onClick={()=>setOnBoardingIndex((prev:any)=>prev+1)}
      >
        Start
      </motion.button>
    </div>
  )
}

export default First