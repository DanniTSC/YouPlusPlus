import React, { useState } from 'react';

const Nutrition = () => {
  const [goal, setGoal] = useState('');
  const [level, setLevel] = useState('');
  const [plan, setPlan] = useState(null);

  const token = localStorage.getItem('token');

  const fetchPlan = async () => {
    const res = await fetch('http://localhost:5000/api/nutrition/plan', {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ goal, level }),
    });

    const data = await res.json();
    setPlan(data);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-[#8E1C3B]">🍏 Plan Nutriție & Fitness</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <select
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="border rounded p-2"
        >
          <option value="">Selectează obiectiv</option>
          <option value="slăbit">Slăbit</option>
          <option value="masă musculară">Masă musculară</option>
          <option value="menținere">Menținere</option>
        </select>

        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="border rounded p-2"
        >
          <option value="">Nivel antrenament</option>
          <option value="începător">Începător</option>
          <option value="intermediar">Intermediar</option>
          <option value="avansat">Avansat</option>
        </select>
      </div>

      <button
        onClick={fetchPlan}
        disabled={!goal || !level}
        className="bg-[#8E1C3B] text-white px-4 py-2 rounded"
      >
        Generează plan
      </button>

      {plan && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">🔥 Antrenamente:</h2>
          <ul className="list-disc pl-5 mb-4 text-sm">
            {plan.workouts.map((w, i) => <li key={i}>{w}</li>)}
          </ul>

          <h2 className="text-lg font-semibold mb-2">🥗 Mese:</h2>
          <ul className="list-disc pl-5 text-sm">
            {plan.meals.map((m, i) => <li key={i}>{m}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Nutrition;
