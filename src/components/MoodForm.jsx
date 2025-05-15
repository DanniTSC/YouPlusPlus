// src/components/MoodForm.jsx
import React, { useState } from 'react';

const options = ['anxios','stresat','neutru','calm','fericit'];

const MoodForm = ({ label, onSubmit }) => {
  const [descriptor, setDescriptor] = useState('');
  const [score, setScore] = useState(5);

  const submit = e => {
    e.preventDefault();
    onSubmit({ descriptor, score });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <h2 className="text-2xl font-semibold text-[#8E1C3B]">{label}</h2>
      <select
        value={descriptor}
        onChange={e => setDescriptor(e.target.value)}
        className="w-full p-3 border rounded focus:ring-2 focus:ring-[#FFD045]"
        required
      >
        <option value="">— Alege starea —</option>
        {options.map(o=>(
          <option key={o} value={o}>
            {o.charAt(0).toUpperCase()+o.slice(1)}
          </option>
        ))}
      </select>
      <div>
        <label className="block mb-1">Nota (1–10)</label>
        <input
          type="range"
          min="1" max="10"
          value={score}
          onChange={e=>setScore(e.target.value)}
          className="w-full"
        />
        <div className="text-right font-semibold">{score}</div>
      </div>
      <button
        type="submit"
        disabled={!descriptor}
        className="w-full bg-[#8E1C3B] text-white py-3 rounded disabled:opacity-50 hover:bg-[#6e1a30] transition"
      >
        Continuă
      </button>
    </form>
  );
};

export default MoodForm;
