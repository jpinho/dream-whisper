
import React, { useRef, useEffect } from 'react';

interface AudioPlayerProps {
  src: string | null;
  isPlaying: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, isPlaying }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && src) {
        if(audioRef.current.src !== src) {
          audioRef.current.src = src;
        }
        audioRef.current.play().catch(error => console.error("Audio play failed:", error));
        audioRef.current.volume = 0.3; 
        audioRef.current.loop = true;
      } else {
        audioRef.current.pause();
      }
    }
  }, [src, isPlaying]);

  return <audio ref={audioRef} />;
};

export default AudioPlayer;
