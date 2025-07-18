'use client'
import React, { useEffect, useState } from 'react'
import api from '@/api'
import EachContent from './EachContent';
import { useRouter } from 'next/navigation';

// Skeleton Component
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`bg-gray-700 rounded animate-pulse ${className}`} />
);

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

const ContentDisplayer = ({content,setContent}:any) => {
    // const [content, setContent] = useState<ContentType>()
    const [loading, setLoading] = useState<boolean>(false)
    const [loadingMore, setLoadingMore] = useState<boolean>(false)
    const router = useRouter()

    const getContent = async (url: string | null | undefined) => {
        if (!url || url == null) return;
        try {
            const isInitialLoad = !content?.results;
            isInitialLoad ? setLoading(true) : setLoadingMore(true);
            
            const result: any = await api.get(url)
            if (content?.results && content?.results?.length > 0) {
                setContent((prev: any) => {
                    let new_data: ContentType = result?.data
                    let modified_results: any = [...prev.results, ...new_data?.results]
                    new_data.results = modified_results
                    return new_data
                })
            } else {
                setContent(result.data)
            }
        } catch (error) {
            console.error("Error fetching content:", error);
        } finally {
            setLoading(false)
            setLoadingMore(false)
        }
    }

    useEffect(() => {
        getContent("/content")
    }, [])

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-gray-900 pt-24 p-6">
                <div className="w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-gray-800 rounded-xl p-4">
                            <Skeleton className="w-full aspect-[16/9] rounded-lg" />
                            <Skeleton className="w-3/4 h-6 mt-4" />
                            <Skeleton className="w-full h-4 mt-2" />
                            <Skeleton className="w-full h-4 mt-1" />
                            <div className="flex justify-between mt-4">
                                <Skeleton className="w-16 h-4" />
                                <Skeleton className="w-16 h-4" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="w-full min-h-screen bg-gray-900 pt-24 p-6">
            <div className="w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {content?.results?.map((c: ResultItem, i: number) => (
                    <EachContent key={i} content={c} />
                ))}
                {content?.results?.map((c: ResultItem, i: number) => (
                    <EachContent key={i} content={c} />
                ))}
                {content?.results?.map((c: ResultItem, i: number) => (
                    <EachContent key={i} content={c} />
                ))}
                {content?.results?.map((c: ResultItem, i: number) => (
                    <EachContent key={i} content={c} />
                ))}
            </div>

            {content?.next && (
                <div className="w-full flex justify-center mt-8">
                    <button
                        onClick={() => getContent(content.next)}
                        disabled={loadingMore}
                        className={`px-6 py-3 rounded-lg transition-colors duration-300 flex items-center 
                            ${loadingMore 
                                ? 'bg-gray-800 text-gray-500' 
                                : 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700'
                            }`}
                    >
                        {loadingMore ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Loading...
                            </>
                        ) : (
                            'Load More'
                        )}
                    </button>
                </div>
            )}
        </div>
    )
}

export default ContentDisplayer