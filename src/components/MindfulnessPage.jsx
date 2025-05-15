import React, { useState } from 'react';
import MoodForm from '../components/MoodForm';
import MindfulnessTimer from '../components/MindfulnessTimer';
import BoxBreathing from '../components/BoxBreathing';
import { toast } from 'react-hot-toast';

const durations = [
  { label: '5 min', sec: 300 },
  { label: '10 min', sec: 600 },
  { label: '20 min', sec: 1200 },
  { label: '10 sec', sec: 10 },

];

const MindfulnessPage = () => {
  const [mode, setMode] = useState(null); // "timer" sau "box"
  const [step, setStep] = useState('selectMode');
  const [duration, setDuration] = useState(0);
  const [customMinutes, setCustomMinutes] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const token = localStorage.getItem('token');

  // ➤ Selectare mod (timer sau box)
  const chooseMode = (selected) => {
    setMode(selected);
    setStep('selectDuration');
  };

  const pickDuration = sec => {
    setDuration(sec);
    setStep('beforeMood');
  };

  const handleCustomTime = e => {
    e.preventDefault();
    const minutes = parseInt(customMinutes);
    if (!minutes || minutes <= 0 || minutes > 120) {
      toast.error('Timpul trebuie să fie între 1 și 120 minute');
      return;
    }
    pickDuration(minutes * 60);
  };

  const handleMoodBefore = async mb => {
    const res = await fetch('http://localhost:5000/api/meditation/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
      body: JSON.stringify({
        type: mode,
        duration,
        moodBefore: mb
      })
    });
    const data = await res.json();
    setSessionId(data.sessionId);
    setStep('meditating');
  };

  const handleMoodAfter = async ma => {
    await fetch('http://localhost:5000/api/meditation/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
      body: JSON.stringify({
        sessionId,
        endedAt: new Date(),
        moodAfter: ma
      })
    });
    toast.success('🧘‍♀️ Sesiunea a fost salvată!');
    setStep('recommendation');

    // 👉 Poți adăuga aici un GET către `/api/meditation/recommendations` dacă ai recomandări dinamice
  };

  const handleTimerComplete = () => {
    setStep('afterMood');
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 bg-white rounded-lg shadow-md p-8 text-[#333]">
      {/* Step 0 – Alegere mod */}
      {step === 'selectMode' && (
        <>
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-[#8E1C3B]">🧘 Alege tipul meditației</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <button
              onClick={() => chooseMode('timer')}
              className="bg-[#E4F7ED] hover:bg-[#cef0e0] p-6 rounded-lg text-xl shadow text-left"
            >
              ⏱️ Mindfulness Timer<br /><span className="text-sm">Cronometru simplu, fără audio</span>
            </button>
            <button
              onClick={() => chooseMode('box')}
              className="bg-[#FFF4E5] hover:bg-[#ffe5c0] p-6 rounded-lg text-xl shadow text-left"
            >
              🔲 Box Breathing<br /><span className="text-sm">Respirație ghidată 4-4-4-4</span>
            </button>
          </div>
        </>
      )}

      {/* Step 1 – Selectare durată */}
      {step === 'selectDuration' && (
        <>
          <h2 className="text-2xl font-bold mb-4 mt-8 text-[#8E1C3B] text-center">Alege durata sesiunii</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {durations.map(d => (
              <button
                key={d.sec}
                onClick={() => pickDuration(d.sec)}
                className="py-3 bg-[#E8F0FE] text-xl rounded hover:bg-[#d0dffb] transition"
              >
                {d.label}
              </button>
            ))}
          </div>
          <form onSubmit={handleCustomTime}>
            <label className="block mb-2 text-lg font-medium">⏱️ Sau introdu timpul manual (minute):</label>
            <div className="flex gap-3 items-center">
              <input
                type="number"
                placeholder="Ex: 15"
                value={customMinutes}
                onChange={e => setCustomMinutes(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              <button
                type="submit"
                className="bg-[#8E1C3B] text-white px-5 py-3 rounded-md hover:bg-[#6e1a30]"
              >
                Continuă
              </button>
            </div>
          </form>
        </>
      )}

      {/* Step 2 – Mood Before */}
      {step === 'beforeMood' && (
        <MoodForm
          label="🌥️ Cum te simți înainte de meditație?"
          onSubmit={handleMoodBefore}
        />
      )}

      {/* Step 3 – Meditație în desfășurare */}
      {step === 'meditating' && (
        <div className="flex flex-col items-center space-y-6">
          <p className="text-xl text-[#8E1C3B] font-semibold">Respiră adânc... 🧘</p>
          {mode === 'timer' ? (
            <MindfulnessTimer duration={duration} onComplete={handleTimerComplete} />
          ) : (
            <BoxBreathing duration={duration} onComplete={handleTimerComplete} />
          )}
        </div>
      )}

      {/* Step 4 – Mood After */}
      {step === 'afterMood' && (
        <MoodForm
          label="🌤️ Cum te simți după meditație?"
          onSubmit={handleMoodAfter}
        />
      )}

      {/* Step 5 – Recomandare simplă */}
      {step === 'recommendation' && (
        <div className="text-center mt-10">
          <h2 className="text-2xl font-bold text-[#8E1C3B] mb-4">✨ Recomandare</h2>
          <p className="text-lg text-gray-700">
            Pe baza sesiunilor tale, <strong>10 minute</strong> pare să aibă cel mai mare impact pozitiv. 🎯
          </p>
          <button
            onClick={() => setStep('selectMode')}
            className="mt-6 bg-[#8E1C3B] text-white px-6 py-3 rounded hover:bg-[#6e1a30]"
          >
            Începe o nouă sesiune
          </button>
        </div>
      )}
    </div>
  );
};

export default MindfulnessPage;
