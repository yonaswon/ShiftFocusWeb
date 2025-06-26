'use client'
import React, { useEffect, useState } from 'react'
import api from '@/api'

const Second = () => {
    const [categories,setCategories] = useState<any>()
    const [error,setError] = useState<any>()

    const getCategories = async ()=>{
        try {
            const result = await api.get('content/category')
            if (result.data){
                setCategories(result.data)
            }
        } catch (error) {
            setError("can't found ")
        }
    }

    useEffect(()=>{
        getCategories()
    },[])
    
  return (
    <div className='w-full h-full flex items-center justify-center'>
      <h1 className='text-white'>Second page</h1>
      {categories && categories.map((l:any)=><div key={l.id} className='text-white'>{l.name}</div>)}
    </div>
  )
}

export default Second
