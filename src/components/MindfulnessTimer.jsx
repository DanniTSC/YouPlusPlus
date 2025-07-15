import React, { useState, useEffect } from 'react';

const MindfulnessTimer = ({ duration, onComplete }) => {
  const [left, setLeft] = useState(duration);

  useEffect(() => {
    if (left <= 0) { onComplete(); return; }
    const t = setTimeout(() => setLeft(left - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);

  const m = Math.floor(left/60), s = left%60;
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-6xl font-mono">{m}:{s<10?'0'+s:s}</div>
      <div className="w-64 h-2 bg-gray-300 rounded overflow-hidden">
        <div
          className="h-full bg-[#8E1C3B] transition-all"
          style={{ width: `${(left/duration)*100}%` }}
        />
      </div>
    </div>
  );
};

export default MindfulnessTimer;

// timer pentru meditație care pornește de la durata selectată și scade automat timpul, 
// actualizând UI-ul la fiecare secundă. Când timpul expiră, se apelează automat funcția de finalizare onComplete. 
