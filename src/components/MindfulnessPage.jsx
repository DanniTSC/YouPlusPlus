import React, { useState } from 'react';
import MoodForm from '../components/MoodForm';
import MindfulnessTimer from '../components/MindfulnessTimer';
import BoxBreathing from '../components/BoxBreathing';
import RecommendationCard from '../components/RecommendationCard';
import SoundPlayer from '../components/SoundPlayer';
import { toast } from 'react-hot-toast';

const durations = [
  { label: '5 min', sec: 300 },
  { label: '10 min', sec: 600 },
  { label: '20 min', sec: 1200 },
  { label: '10 sec', sec: 10 },
];

const MindfulnessPage = () => {
  const [mode, setMode] = useState(null);
  const [duration, setDuration] = useState(0);
  const [customMinutes, setCustomMinutes] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [step, setStep] = useState(0);
  const [moodBefore, setMoodBefore] = useState(null);
  const [recommendationText, setRecommendationText] = useState('');
  const token = localStorage.getItem('token');

  const handleCustomTime = (e) => {
    e.preventDefault();
    const min = parseInt(customMinutes);
    if (!min || min < 1 || min > 120) {
      toast.error('Introdu un timp între 1 și 120 minute.');
      return;
    }
    setDuration(min * 60);
  };

  const handleStartSession = async (mb) => {
    setMoodBefore(mb);
    const res = await fetch('http://localhost:5000/api/meditation/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({
        type: mode === 'timer' ? 'mindfulness' : 'box-breathing',
        duration,
        moodBefore: mb,
      }),
    });
    const data = await res.json();
    setSessionId(data.sessionId);
    setStep(1); // Start meditație
  };

  const handleEndSession = async (ma) => {
    await fetch('http://localhost:5000/api/meditation/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({
        sessionId,
        endedAt: new Date(),
        moodAfter: ma,
      }),
    });

    toast.success('Sesiune salvată ✅');

    // Fetch recomandare
    const res = await fetch('http://localhost:5000/api/meditation/recommendations', {
      headers: { Authorization: token },
    });
    const data = await res.json();
    setRecommendationText(data.message);
    setStep(3); // Trecem la recomandare

    setTimeout(() => {
      setStep(0);
      setSessionId(null);
      setMode(null);
      setDuration(0);
      setMoodBefore(null);
      setRecommendationText('');
      setCustomMinutes('');
    }, 15000);
  };

  return (
    <div className="max-w-5xl mx-auto mt-12 bg-white rounded-lg shadow-md p-8 text-[#333] space-y-12">

      {/* 1️⃣ Selectare tip */}
      <section>
        <h1 className="text-3xl font-bold text-[#8E1C3B] mb-4">🧘 Alege tipul meditației</h1>
        <div className="grid sm:grid-cols-2 gap-6">
          {['box-breathing', 'timer'].map(opt => (
            <button
              key={opt}
              onClick={() => setMode(opt)}
              className={`p-6 border rounded-lg text-left transition ${
                mode === opt ? 'bg-[#FFD045]/40 border-[#8E1C3B]' : 'bg-gray-50'
              }`}
            >
              <h2 className="text-xl font-semibold">
                {opt === 'box-breathing' ? '🔲 Box Breathing' : '⏱ Mindfulness Timer'}
              </h2>
              <p className="text-sm mt-1">
                {opt === 'box-breathing'
                  ? 'Respirație ghidată 4-4-4-4 pentru calm instantaneu'
                  : 'Timer cu focus pe respirație conștientă'}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* 2️⃣ Selectare durată */}
      <section className={mode ? '' : 'opacity-50 pointer-events-none'}>
        <h2 className="text-xl font-bold text-[#8E1C3B] mb-2">⏱️ Alege durata</h2>
        <div className="grid sm:grid-cols-4 gap-4 mb-4">
          {durations.map(d => (
            <button
              key={d.sec}
              onClick={() => setDuration(d.sec)}
              className={`py-2 rounded ${
                duration === d.sec ? 'bg-[#8E1C3B] text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
        <form onSubmit={handleCustomTime} className="flex gap-4 items-center">
          <input
            type="number"
            value={customMinutes}
            onChange={(e) => setCustomMinutes(e.target.value)}
            className="p-2 w-40 border rounded"
            placeholder="Minute"
          />
          <button type="submit" className="bg-[#FFD045] px-4 py-2 rounded font-medium">
            Setează timp
          </button>
        </form>
      </section>

      {/* 3️⃣ Mood Before */}
      {mode && duration > 0 && !sessionId && step === 0 && (
        <section>
          <MoodForm label="🌥️ Cum te simți înainte?" onSubmit={handleStartSession} />
          {moodBefore?.descriptor && <SoundPlayer mood={moodBefore.descriptor} />}
        </section>
      )}

      {/* 4️⃣ Meditație */}
     {sessionId && step === 1 && (
  <section className="space-y-6">
    <h2 className="text-xl text-[#8E1C3B] font-semibold">🎧 Meditează...</h2>

    {/* Timer sau box breathing */}
    {mode === 'box-breathing' ? (
      <>
        <BoxBreathing duration={4} onComplete={() => setStep(2)} />
        <div className="bg-yellow-100 p-3 rounded text-sm">
          <p>Tutorial: Inspiră 4s → Ține 4s → Expiră 4s → Pauză 4s</p>
          
        </div>
      </>
    ) : (
      <MindfulnessTimer duration={duration} onComplete={() => setStep(2)} />
    )}

    {/* Player audio */}
    {moodBefore?.descriptor && (
      <SoundPlayer mood={moodBefore.descriptor} />
    )}

    {/* Dovezi științifice afișate în funcție de tipul ales */}
    <div className="grid md:grid-cols-2 gap-4 mt-6">
      {mode === 'box-breathing' && (
        <div className="bg-[#FFF4E5] border-l-4 border-[#FFD045] p-4 rounded shadow">
          <h3 className="font-semibold text-[#8E1C3B] mb-1">📘 De ce funcționează Box Breathing?</h3>
          <p className="text-sm text-gray-700">
            Box breathing poate reduce semnificativ stresul și activarea sistemului nervos simpatic în doar câteva minute.
          </p>
          <a
            href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5455070/"
            className="text-sm text-blue-600 underline mt-2 inline-block"
            target="_blank" rel="noreferrer"
          >
            Vezi studiu (PMC5455070)
          </a>
        </div>
      )}

      {mode === 'timer' && (
        <div className="bg-[#E4F7ED] border-l-4 border-[#56C0BC] p-4 rounded shadow">
          <h3 className="font-semibold text-[#1C6F5D] mb-1">🧠 Beneficiile Mindfulness</h3>
          <p className="text-sm text-gray-700">
            Mindfulness susținut îmbunătățește reglarea emoțională și reduce anxietatea prin modificări neuronale măsurabile.
          </p>
          <a
            href="https://doi.org/10.1038/s41598-017-06020-0"
            className="text-sm text-blue-600 underline mt-2 inline-block"
            target="_blank" rel="noreferrer"
          >
            Vezi studiu (Nature Scientific Reports)
          </a>
        </div>
      )}
    </div>
  </section>
)}


      {/* 5️⃣ Mood After */}
      {sessionId && step === 2 && (
        <section>
          <MoodForm label="🌤️ Cum te simți după?" onSubmit={handleEndSession} />
        </section>
      )}

      {/* 6️⃣ Recomandare finală */}
      {step === 3 && recommendationText && (
        <section>
          <RecommendationCard text={recommendationText} />
        </section>
      )}
    </div>
  );
};

export default MindfulnessPage;
