import React from 'react';

const Disclaimer = () => {
  return (
    <div className="max-w-2xl mx-auto mt-12 px-6 py-6 bg-[#FFF9E6] border-l-4 border-[#FFD045] rounded-md shadow-md">
      <div className="flex items-start gap-4">
        <div className="text-3xl">⚠️</div>
        <div>
          <h2 className="text-2xl font-bold text-[#8E1C3B] mb-2">Termeni & Disclaimer</h2>
          <p className="text-gray-700 leading-relaxed text-sm">
            Informațiile oferite în aplicația <strong>You++</strong> au scop <em>educațional și motivațional</em>.
            Ele nu constituie recomandări medicale, nutriționale sau psihologice profesioniste.
            Pentru orice schimbare majoră în stilul de viață, consultă un medic sau specialist certificat.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
