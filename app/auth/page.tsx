import React from 'react'
import GoogleAuth from '@/Components/Auth/GoogleAuth'
import api from '@/api'
import { GoogleOAuthProvider } from '@react-oauth/google'

const page = () => {

  const continueWithEmail = ()=>{
    try {
    } catch (error) {
    }
  } 

  return (
    <GoogleOAuthProvider clientId="746358510825-dsnnpvq8ev1bngfpcq8bjv47tueta775.apps.googleusercontent.com">

    <div className="bg-[url('/bg.jpg')]  bg-cover bg-center w-full h-[100vh] flex items-center justify-center">
      <div>

      <input type="email" name="email_field" className='border-2 border-b-cyan-700' /><br></br>
      <button>Continue With Email</button>

      <GoogleAuth />
      </div>
    </div>
    </GoogleOAuthProvider>
  )
}


export default page
