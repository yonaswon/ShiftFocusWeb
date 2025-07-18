'use client'
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface DisplayPlayListImagesProps {
  video1: string;
  video2: string;
  video3: string;
}

const getYouTubeThumbnail = (url: string): string | null => {
  if (!url) return null;
  
  try {
    // Extract video ID from various YouTube URL formats
    let videoId = '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
      videoId = match[2];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split(/[?&]/)[0];
    } else if (url.includes('v=')) {
      videoId = url.split('v=')[1].split(/[?&]/)[0];
    } else if (url.includes('embed/')) {
      videoId = url.split('embed/')[1].split(/[?&]/)[0];
    }

    if (!videoId) return null;

    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  } catch (error) {
    console.error('Error generating YouTube thumbnail URL:', error);
    return null;
  }
};

const DisplayPlayListImages: React.FC<DisplayPlayListImagesProps> = ({
  video1,
  video2,
  video3,
}) => {
  const thumbnails = [
    getYouTubeThumbnail(video1),
    getYouTubeThumbnail(video2),
    getYouTubeThumbnail(video3),
  ];

  return (
    <div className="relative w-full aspect-[16/9] group">
      {/* Bottom image (video3) */}
      {thumbnails[2] && (
        <div className="absolute right-0 top-0 w-[90%] h-[90%] z-10 transition-all duration-300 group-hover:right-1 group-hover:top-1">
          <Image
            src={thumbnails[2]}
            alt="Video 3 thumbnail"
            fill
            className="w-full aspect-[16/8] rounded-lg object-cover shadow-lg"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}
      
      {/* Middle image (video2) */}
      {thumbnails[1] && (
        <div className="absolute right-[8%] top-[8%] w-[90%] h-[90%] z-20 transition-all duration-300 group-hover:right-[6%] group-hover:top-[6%]">
          <Image
            src={thumbnails[1]}
            alt="Video 2 thumbnail"
            fill
            className="w-full aspect-[16/8] rounded-lg object-cover shadow-lg"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}
      
      {/* Top image (video1) */}
      {thumbnails[0] ? (
        <div className="absolute right-[16%] top-[16%] w-[90%] h-[90%] z-30 transition-all duration-300 group-hover:right-[12%] group-hover:top-[12%]">
          <Image
            src={thumbnails[0]}
            alt="Video 1 thumbnail"
            fill
            className="w-full aspect-[16/8] rounded-lg object-cover shadow-lg group-hover:shadow-xl"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          {/* <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-lg"></div> */}
        </div>
      ) : (
        <div className="absolute right-[16%] top-[16%] w-[90%] h-[90%] z-30 bg-gray-700 rounded-lg flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
      )}
    </div>
  );
};

const EachContent = ({ content }: any) => {
  const router = useRouter();

  const onClickHandler = () => {
    router.push(`/distract/?contentid=${content?.id}`);
  };

  return (
    <div 
      onClick={onClickHandler} 
      className="w-full max-w-[400px] flex flex-col gap-4 p-4 rounded-xl bg-gray-800 hover:bg-gray-700 cursor-pointer transition-all duration-300 shadow-md hover:shadow-lg"
    >
      <div>
        <DisplayPlayListImages
          video1={content?.video[0]?.url}
          video2={content?.video[1]?.url}
          video3={content?.video[2]?.url}
        />
      </div>
      <div className="mt-2 text-white font-medium text-lg line-clamp-2">
        {content?.title}
      </div>
      <p className="text-gray-400 text-sm line-clamp-3">
        {content?.description}
      </p>
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-gray-500">
          {content?.video?.length} videos
        </span>
        <span className="text-xs text-gray-500">
          {Math.floor(content?.played_hour / 24)} days
        </span>
      </div>
    </div>
  );
};

export default EachContent;