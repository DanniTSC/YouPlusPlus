// src/components/Nutrition.jsx
import React, { useState } from 'react';
import Disclaimer from './Disclaimer';
import BMICalculator from './BMICalculator';


const Nutrition = () => {
  const [sex, setSex] = useState('');
  const [goal, setGoal] = useState('');
  const [level, setLevel] = useState('');
  const [plan, setPlan] = useState(null);
  const [openWorkouts, setOpenWorkouts] = useState(false);
  const [openMeals, setOpenMeals] = useState(false);
  const [openTips, setOpenTips] = useState(false);
  const token = localStorage.getItem('token');

  const fetchPlan = async () => {
    const res = await fetch('http://localhost:5000/api/nutrition/plan', {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sex, goal, level }),
    });
    const data = await res.json();
    if (res.ok) {
      setPlan(data);
      setOpenWorkouts(false);
      setOpenMeals(false);
      setOpenTips(false);
    } else {
      alert(data.message);
    }
  };

  return (
   <div className="flex flex-col lg:flex-row w-full gap-8 px-4 mt-10">
    
    {/* LEFT: Plan Nutriție + Disclaimer */}
     <div className="flex-grow basis-2/3 min-w-0 bg-[#FFFDF9] p-8 shadow-lg rounded-lg text-[#333] text-base leading-relaxed">
      <h1 className="text-4xl font-bold text-[#8E1C3B] mb-8">
        🍏 Planul Tău Nutrițional & Fitness
      </h1>

      {/* Form Select */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <select
          value={sex}
          onChange={e => setSex(e.target.value)}
          className="p-4 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-[#FFD045]"
        >
          <option value="">Sex</option>
          <option value="masculin">Masculin</option>
          <option value="feminin">Feminin</option>
        </select>

        <select
          value={goal}
          onChange={e => setGoal(e.target.value)}
          className="p-4 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-[#FFD045]"
        >
          <option value="">Obiectiv</option>
          <option value="slăbit">Slăbit</option>
          <option value="masă musculară">Masă musculară</option>
          <option value="menținere">Menținere</option>
        </select>

        <select
          value={level}
          onChange={e => setLevel(e.target.value)}
          className="p-4 text-base rounded-md border border-gray-300 focus:ring-2 focus:ring-[#FFD045]"
        >
          <option value="">Nivel</option>
          <option value="începător">Începător</option>
          <option value="intermediar">Intermediar</option>
          <option value="avansat">Avansat</option>
        </select>
      </div>

      {/* Generate Button */}
      <button
        onClick={fetchPlan}
        disabled={!sex || !goal || !level}
        className="mb-8 bg-[#8E1C3B] text-white text-base px-8 py-3 rounded-md hover:bg-[#6e1a30] transition disabled:opacity-50"
      >
        Generează planul personalizat
      </button>

      {/* Planul generat */}
      {plan && (
        <div className="space-y-6">
          {/* Accordion: Antrenamente */}
          <div className="border rounded-lg overflow-hidden">
            <button
              onClick={() => setOpenWorkouts(!openWorkouts)}
              className="w-full flex justify-between items-center bg-[#FFF4E5] px-6 py-4 text-2xl font-semibold hover:bg-[#ffe5c0] transition"
            >
              <span>🔥 Antrenamente</span>
              <span>{openWorkouts ? '−' : '+'}</span>
            </button>
            {openWorkouts && (
              <ul className="bg-white px-8 py-6 space-y-3 list-disc list-inside text-base">
                {plan.workouts.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            )}
          </div>

          {/* Accordion: Mese */}
          <div className="border rounded-lg overflow-hidden">
            <button
              onClick={() => setOpenMeals(!openMeals)}
              className="w-full flex justify-between items-center bg-[#E4F7ED] px-6 py-4 text-2xl font-semibold hover:bg-[#cef0e0] transition"
            >
              <span>🥗 Mese</span>
              <span>{openMeals ? '−' : '+'}</span>
            </button>
            {openMeals && (
              <ul className="bg-white px-8 py-6 space-y-3 list-disc list-inside text-base">
                {plan.meals.map((m, i) => <li key={i}>{m}</li>)}
              </ul>
            )}
          </div>

          {/* Accordion: Tips */}
          <div className="border rounded-lg overflow-hidden">
            <button
              onClick={() => setOpenTips(!openTips)}
              className="w-full flex justify-between items-center bg-[#E8F0FE] px-6 py-4 text-2xl font-semibold hover:bg-[#d0dffb] transition"
            >
              <span>💡 Tips & Recomandări</span>
              <span>{openTips ? '−' : '+'}</span>
            </button>
            {openTips && (
              <ul className="bg-white px-8 py-6 space-y-3 list-disc list-inside text-base">
                {plan.tips.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-12">
        <Disclaimer />
      </div>
    </div>

    {/* RIGHT: BMI Calculator */}
    <div className="w-full lg:max-w-sm mt-6 lg:mt-0">
      <BMICalculator />
    </div>
  </div>
);

};

export default Nutrition;
