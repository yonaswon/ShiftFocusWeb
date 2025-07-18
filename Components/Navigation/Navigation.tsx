'use client'
import React, { useEffect, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { FaRegUserCircle } from "react-icons/fa";
import api from "@/api";
import { useRouter } from "next/navigation";
import ProfileMenu from "./ProfileMenu";

const Navigation = ({setContent}:any) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading,setLoading] = useState<boolean>(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const router = useRouter();

  useEffect(()=>{
    console.log(searchQuery)
  },[searchQuery])


  const handleSearch = async ()=>{
    console.log('runing',searchQuery)
    try {
      setLoading(true)
      const result = await api.get(`content/?search=${searchQuery}`)
      if(result?.data){
        setContent(result?.data)
      }
      setLoading(false)
    } catch (error) {
      handleSearch()
    }
  }

 useEffect(() => {
  const handleKeyDown = (e:any) => {
    if (e.key === 'Enter') {
      console.log(searchQuery,'search query from handle search')
      handleSearch();
    }
  };

  document.addEventListener('keydown', handleKeyDown);

  return () => {
    document.removeEventListener('keydown', handleKeyDown);
  };
}, [searchQuery]);


  return (
    <nav className="w-full py-3 px-6 fixed top-0 flex items-center justify-between bg-gray-900 z-50 shadow-sm border-b border-gray-700">
      {/* Logo/Brand */}
      <div className="text-xl font-bold text-white cursor-pointer"
      onClick={()=>router.push('/')}
      >
        SHIFT FOCUS
      </div>

      {/* Search Bar */}
      <div className={`relative mx-4 transition-all duration-300 ${isSearchFocused ? 'w-1/2' : 'w-1/3'}`}>
        <div className="relative flex items-center">
          <FiSearch className="absolute left-3 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            placeholder="Search content..."
            className="w-full py-2 pl-10 pr-8 rounded-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 text-gray-500 hover:text-gray-300"
            >
              <FiX />
            </button>
          )}
        </div>
      </div>

      {/* User Profile */}
      {/* <div className="flex items-center space-x-4">
        <button className="p-2 text-gray-400 hover:text-white">
          <FaRegUserCircle className="text-2xl" />
        </button>
      </div> */}
      <ProfileMenu />
    </nav>
  );
};

export default Navigation;