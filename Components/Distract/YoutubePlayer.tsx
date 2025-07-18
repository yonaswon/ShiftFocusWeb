'use client'
import React from 'react';

interface YoutubePlayerProps {
  url: string;
  width?: string | number;
  height?: string | number;
  autoplay?: boolean;
  controls?: boolean;
}

const YoutubePlayer: React.FC<YoutubePlayerProps> = ({
  url,
  width = '40vw',
  height = '22vw',
  autoplay = true,
  controls = true,
}) => {
  // Function to extract YouTube ID from URL
  const getYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeId(url);

  if (!videoId) {
    return <div>Invalid YouTube URL</div>;
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&controls=${controls ? 1 : 0}`;

  return (
    <div style={{ width, height }}>
      <iframe
        width="100%"
        height="100%"
        src={embedUrl}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="YouTube video player"
      />
    </div>
  );
};

export default YoutubePlayer;