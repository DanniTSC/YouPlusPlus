// src/components/BoxBreathing.jsx
import React, { useState, useEffect } from 'react';

const BoxBreathing = ({ duration, onComplete }) => {
  const phases = ['Inspiră', 'Ține', 'Expiră', 'Ține'];
  const [phase, setPhase] = useState(0);
  const [time, setTime] = useState(duration);

  useEffect(() => {
    if (time <= 0) {
      const next = (phase + 1) % 4;
      setPhase(next);
      setTime(duration);
      if (phase === 3 && next === 0) onComplete();
      return;
    }
    const t = setTimeout(() => setTime(time - 1), 1000);
    return () => clearTimeout(t);
  }, [time, phase]);

  const size = 50 + (time / duration) * 100; // for animate
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-2xl font-semibold text-[#8E1C3B]">{phases[phase]}</div>
      <div
        className="bg-[#56C0BC] rounded"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          transition: 'width 1s linear, height 1s linear'
        }}
      />
      <div className="text-lg">{time}s</div>
    </div>
  );
};

export default BoxBreathing;
