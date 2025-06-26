// PlayAudio.jsx
// This component provides a play button to generate and play a bot's voice for a given message using a backend TTS API.

import React, { useState,useEffect, useRef } from 'react';
import { IconLoader, IconPlayerPlayFilled } from '@tabler/icons-react';

// PlayAudio component: Plays the bot's voice for a given message
const PlayAudio = ({ text,bot_id }) => {
  // State to track if audio is currently playing
  const [isPlaying, setIsPlaying] = useState(false);
  // State to track if audio is being loaded/generated
  const [isLoading, setIsLoading] = useState(false);
  // (Unused) State for audio object
  const [audio, setAudio] = useState(null);

  // (Unused) State for voice id (for future use or mapping)
  const [voice_id, setVoiceId] = useState(null);
  // Ref to the audio element
  const audioRef = useRef(null);
  // State to store the generated audio URL (base64 WAV)
  const [audioUrl, setAudioUrl] = useState(null);

//  map voice id to bot id (example mapping, currently unused)
  /*
  const voiceIdMap = {
    'delhi_mentor_male': 'arvind',
    'delhi_mentor_female': 'meera',
    'delhi_friend_male': 'amol',
    'delhi_friend_female': 'pavithra',
    'delhi_romantic_male': 'neel',
    'delhi_romantic_female': 'maitreyi',
  };

  useEffect(() => {
    setVoiceId(voiceIdMap[bot_id]);
  }, [bot_id]);
  */

  // Handles the play button click: fetches and plays the bot's voice
  const handlePlay = async () => {
    console.log('Play button clicked', { text, bot_id });
    try {
      // Pause and reset if already playing
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlaying(false);
      setIsLoading(true);
      // Always fetch new audio for each click
      const response = await fetch('https://novi.aigurukul.dev/generate-audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcript: text, bot_id: bot_id }),
      });
      if (!response.ok) throw new Error('Failed to generate audio');
      const data = await response.json();
      const { audio_base64 } = data;
      // Create a base64 WAV audio URL
      const audioSrc = `data:audio/wav;base64,${audio_base64}`;
      setAudioUrl(audioSrc);
      setIsLoading(false);
      // Play the audio after the src is set (with a small delay)
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.src = audioSrc;
          audioRef.current.play();
          setIsPlaying(true);
        }
      }, 100);
    } catch (error) {
      console.error('Error handling audio:', error);
      setIsLoading(false);
    }
  };

  // Handle audio end event: reset playing state
  const handleEnded = () => {
    setIsPlaying(false);
  };

  // Cleanup function when component unmounts: reset audio state
  React.useEffect(() => {
    return () => {
      if (audioUrl) {
        setIsPlaying(false);
        setAudioUrl(null);
      }
    };
    // eslint-disable-next-line
  }, []);

  // Render the play button and (conditionally) the hidden audio element
  return (
    <span>
      <button 
        onClick={handlePlay}
        className="focus:outline-none"
        disabled={isLoading}
      >
        {/* Show loader while loading, play icon otherwise */}
        {isLoading ? (
          <IconLoader 
            size={22} 
            className="text-purple-400/100 mt-[-2px] animate-spin"
          />
        ) : isPlaying ? (
          <IconPlayerPlayFilled 
            size={22} 
            className="text-purple-400/100 mt-[-2px] cursor-pointer hover:scale-125 transition-transform"
          />
        ) : (
          <IconPlayerPlayFilled 
            size={22} 
            className="text-purple-400/100 mt-[-2px] cursor-pointer hover:scale-125 transition-transform"
          />
        )}
      </button>
      {/* Only render the audio element if audioUrl is set */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={handleEnded}
          style={{ display: 'none' }}
          onError={() => { console.error('Audio playback error'); }}
          onLoadedData={() => { console.log('Audio loaded and ready to play'); }}
        />
      )}
    </span>
  );
};

export default PlayAudio;