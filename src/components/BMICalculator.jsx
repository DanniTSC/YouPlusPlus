import React, { useState } from 'react';

const BMICalculator = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState('');

  const calculateBMI = () => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);

    if (!h || !w || h <= 0 || w <= 0) return;

    const result = w / (h * h);
    setBmi(result.toFixed(1));

    if (result < 18.5) {
      setCategory('Subponderal 🦴');
    } else if (result < 25) {
      setCategory('Normal 💪');
    } else if (result < 30) {
      setCategory('Supraponderal 🍔');
    } else {
      setCategory('Obez ⚠️');
    }
  };

  const getBarColor = () => {
    if (!bmi) return 'w-0';
    if (bmi < 18.5) return 'bg-blue-400 w-1/4';
    if (bmi < 25) return 'bg-green-400 w-2/4';
    if (bmi < 30) return 'bg-yellow-400 w-3/4';
    return 'bg-red-400 w-full';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg text-center text-[#333] w-full">
      <h2 className="text-xl font-bold text-[#8E1C3B] mb-4 flex items-center justify-center gap-2">
        ⚖️ Calculator BMI
      </h2>

      <div className="text-left">
        <label className="text-sm font-medium block mb-1">Greutate (kg)</label>
        <input
          type="number"
          value={weight}
          onChange={e => setWeight(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:ring-2 focus:ring-[#FFD045]"
          placeholder="Ex: 68"
        />

        <label className="text-sm font-medium block mb-1">Înălțime (cm)</label>
        <input
          type="number"
          value={height}
          onChange={e => setHeight(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:ring-2 focus:ring-[#FFD045]"
          placeholder="Ex: 172"
        />
      </div>

      <button
        onClick={calculateBMI}
        className="bg-[#56C0BC] text-white py-2 px-4 rounded hover:bg-[#48ada9] transition w-full"
      >
        Calculează
      </button>

      {bmi && (
        <div className="mt-6">
          <p className="text-lg font-semibold">
            BMI-ul tău: <span className="text-[#8E1C3B]">{bmi}</span>
          </p>
          <p className="mt-2 text-sm italic">{category}</p>

          {/* Bară progres vizuală */}
          <div className="mt-4 h-3 w-full bg-gray-200 rounded-full overflow-hidden">
            <div className={`h-full transition-all duration-500 ${getBarColor()}`} />
          </div>
        </div>
      )}
    </div>
  );
};

export default BMICalculator;
