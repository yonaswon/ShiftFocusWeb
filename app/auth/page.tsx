import React from 'react'
import GoogleAuth from '@/Components/Auth/GoogleAuth'
import api from '@/api'

const page = () => {
  const continueWithEmail = ()=>{
    try {
      
    } catch (error) {
      
    }
  }
  return (
    <div className='w-full h-[100vh] flex items-center justify-center'>
      <div>

      <input type="email" name="email_field" className='border-2 border-b-cyan-700' /><br></br>
      <button>Continue With Email</button>

      <GoogleAuth />
      </div>
    </div>
  )
}


export default page
