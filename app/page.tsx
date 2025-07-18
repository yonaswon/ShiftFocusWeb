"use client";
import React, { useEffect, useState } from "react";
import ContentDisplayer from "@/Components/Home/ContentDisplayer";
import Navigation from "@/Components/Navigation/Navigation";
import { useAuth, AuthProvider } from "@/Components/Auth/AuthProvider";
import { useRouter, usePathname } from "next/navigation";

type Video = {
  id: number;
  url: string | null;
  title: string | null;
  description: string | null;
  thumbnails: string | null;
  date: string | null;
};

type Category = {
  id: number;
  name: string;
  date: string;
};

type ResultItem = {
  id: number;
  video: Video[];
  category: Category;
  title: string;
  bgimage: string | null;
  played_hour: number;
  description: string | null;
  date: string | null;
};

type ContentType = {
  count: number;
  next: string | null;
  previous: string | null;
  results: ResultItem[];
};

const Page = () => {
  const { isAuthenticated, loading } = useAuth();
  const [content, setContent] = useState<ContentType>();

  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated != null && !isAuthenticated) {
      router.push("/onboarding");
    }
  }, [isAuthenticated]);

  return (
    <AuthProvider>
      <div className="w-full overflow-x-hidden">
        {/* {
          isAuthenticated &&  */}
        <>
          <Navigation setContent={setContent} />
          <ContentDisplayer content={content} setContent={setContent} />
        </>
        <button onClick={()=>router.push('/distract')} className="fixed  bottom-4 left-1/2 transform -translate-x-1/2 px-16 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg hover:from-blue-500 hover:to-purple-500 transition-all z-50 pointer-cursor">
          Distract me
        </button>

        {/* } */}

        {/* { loading && <div className = "w-full h-[100vh] bg-red">Loading ... </div>} */}
      </div>
    </AuthProvider>
  );
};

export default Page;
