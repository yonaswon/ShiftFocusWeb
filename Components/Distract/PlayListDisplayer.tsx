'use client'
import React, { useEffect, useState } from 'react'
import YoutubePlayer from '@/Components/Distract/YoutubePlayer'
import { useSearchParams } from 'next/navigation'
import api from '@/api'
import Skeleton from '@/Components/Distract/Skeleton'

interface Thumbnails {
  default: { url: string; width: number; height: number }
  medium?: { url: string; width: number; height: number }
  high?: { url: string; width: number; height: number }
  standard?: { url: string; width: number; height: number }
  maxres?: { url: string; width: number; height: number }
}

interface Video {
  id: number
  url: string
  title: string
  description: string
  thumbnails: string
  date: string
}

interface Content {
  id: number
  video: Video[]
  category: {
    id: number
    name: string
    date: string
  }
  title: string
  bgimage: string | null
  played_hour: number
  description: string
  date: string
}

const PlayListDisplayer = () => {
  const searchParams = useSearchParams()
  const contentid = searchParams.get('contentid')
  const [content, setContent] = useState<Content | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isPlaylistExpanded, setIsPlaylistExpanded] = useState(true)

  const getContent = async () => {
    try {
      setLoading(true)
      const result = await api.post(`/content/distract`, {
        contentid:contentid ?? ""
      })
      if (result?.data) {
        setContent(result.data)
      }
    } catch (error) {
      console.error('Error fetching content:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
      getContent()
  }, [contentid])

  const handleVideoSelect = (index: number) => {
    setCurrentVideoIndex(index)
  }

  const togglePlaylist = () => {
    setIsPlaylistExpanded(!isPlaylistExpanded)
  }

  const getThumbnailUrl = (thumbnailsString: string): string => {
    try {
      const thumbnails: Thumbnails = JSON.parse(thumbnailsString)
      return (
        thumbnails.medium?.url ||
        thumbnails.high?.url ||
        thumbnails.standard?.url ||
        thumbnails.maxres?.url ||
        thumbnails.default.url
      )
    } catch (error) {
      console.error('Error parsing thumbnails:', error)
      return ''
    }
  }

  if (loading) {
    return (
      <div className="w-full max-w-[50vw] h-[100vh] mx-auto flex flex-col bg-gray-900 p-4">
        <div className="flex-1 relative">
          <Skeleton className="w-full h-full rounded-lg bg-gray-800" />
        </div>
        <div className="h-48 mt-4">
          <div className="flex justify-between items-center mb-2">
            <Skeleton className="w-32 h-6 bg-gray-800" />
            <Skeleton className="w-6 h-6 bg-gray-800" />
          </div>
          <div className="flex flex-col gap-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="w-full h-16 bg-gray-800 rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="w-full max-w-[50vw] h-[100vh] mx-auto flex items-center justify-center bg-gray-900">
        <p className="text-white">No content found</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-[50vw] h-[100vh] mx-auto flex flex-col bg-gray-900 p-4 overflow-hidden">
      {/* Main Player */}
      <div className="flex-1 relative">
        {content.video.length > 0 && (
          <YoutubePlayer 
            url={content.video[currentVideoIndex].url} 
            key={content.video[currentVideoIndex].id}
          />
        )}
      </div>

      {/* Playlist */}
      <div className={`mt-4 transition-all duration-300 ${isPlaylistExpanded ? 'h-[40vh]' : 'h-12'}`}>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-white font-semibold">Playlist ({content.video.length})</h2>
          <button 
            onClick={togglePlaylist}
            className="text-gray-400 hover:text-white"
          >
            {isPlaylistExpanded ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>
        </div>

        {isPlaylistExpanded && (
          <div className="flex flex-col gap-2 overflow-y-auto h-full pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 scrollbar-rounded">
            {content.video.map((video, index) => {
              const thumbnailUrl = getThumbnailUrl(video.thumbnails)
              
              return (
                <div 
                  key={video.id}
                  onClick={() => handleVideoSelect(index)}
                  className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-all ${currentVideoIndex === index ? 'bg-gray-700 ring-2 ring-blue-500' : 'bg-gray-800 hover:bg-gray-700'}`}
                >
                  {thumbnailUrl ? (
                    <div className="relative flex-shrink-0">
                      <img 
                        src={thumbnailUrl} 
                        alt={video.title}
                        className="w-24 h-14 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/default-thumbnail.jpg'
                        }}
                      />
                      {currentVideoIndex === index && (
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-24 h-14 bg-gray-700 flex items-center justify-center rounded flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <p className="text-white text-sm truncate flex-grow">{video.title}</p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default PlayListDisplayer