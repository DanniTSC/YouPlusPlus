import React, { useRef, useState, useEffect } from 'react';
import anxietySound from '../assets/sounds/anxiety.mp3';
import calmMindSound from '../assets/sounds/calm_mind.mp3';
import furiousSound from '../assets/sounds/furious.mp3';
import happyFavSound from '../assets/sounds/happy_fav.mp3';
import neutruSound from '../assets/sounds/neutru.mp3';

const moodSounds = {
  anxios: anxietySound,
  stresat: furiousSound,
  neutru: neutruSound,
  calm: calmMindSound,
  fericit: happyFavSound,
};

const SoundPlayer = ({ mood }) => {
  const audioRef = useRef(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !mood) return;

    const src = moodSounds[mood];
    if (!src) return;

    audio.pause(); // oprim sunetul anterior
    audio.src = src;
    audio.loop = true;
    audio.muted = muted;

    const handleCanPlay = async () => {
      try {
        await audio.play();
      } catch (err) {
        console.warn('🔇 Autoplay blocat:', err.message);
      }
    };

    audio.addEventListener('canplaythrough', handleCanPlay);
    audio.load(); // trigger la canplaythrough

    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlay);
      audio.pause();
    };
  }, [mood, muted]);

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !muted;
    setMuted(!muted);
  };

  return (
    <div className="flex items-center gap-3 mt-2">
      <audio ref={audioRef} />
      <button onClick={toggleMute} className="text-xl">
        {muted ? '🔇' : '🔊'}
      </button>
      <span className="text-sm italic text-gray-600">
        Sunet pentru <strong>{mood}</strong>
      </span>
    </div>
  );
};

export default SoundPlayer;
