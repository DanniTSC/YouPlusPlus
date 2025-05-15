// src/components/SoundPlayer.jsx
import React, { useRef, useState, useEffect } from 'react';

const moodSounds = {
  anxios: 'assets\sounds\anxiety.mp3',
  stresat: 'assets\sounds\furious.mp3',
  neutru: 'assets\sounds\neutru.mp3',
  calm: 'assets\sounds\calm_mind.mp3',
  fericit: 'assets\sounds\happy_fav.mp3',
};

const SoundPlayer = ({ mood }) => {
  const audioRef = useRef();
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = moodSounds[mood] || '';
      audioRef.current.play();
    }
  }, [mood]);

  return (
    <div className="flex items-center gap-2 mt-4">
      <audio ref={audioRef} loop />
      <button
        onClick={() => {
          setMuted(!muted);
          if (audioRef.current) audioRef.current.muted = !muted;
        }}
        className="text-2xl"
      >
        {muted ? '🔇' : '🔊'}
      </button>
      <span className="text-sm italic">Sunet pentru starea <strong>{mood}</strong></span>
    </div>
  );
};

export default SoundPlayer;
