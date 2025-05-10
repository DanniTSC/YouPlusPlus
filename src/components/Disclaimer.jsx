import React from 'react';

const Disclaimer = () => {
  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-semibold text-[#8E1C3B] mb-4">📜 Termeni & Disclaimer</h1>
      <p className="text-gray-800 leading-relaxed">
        ⚠️ Informațiile oferite în această aplicație nu reprezintă sfaturi medicale, nutriționale sau psihologice
        profesionale. Scopul aplicației este educațional și motivațional.
        Consultați întotdeauna un medic sau specialist certificat înainte de a începe orice program de dietă sau exerciții.
      </p>
    </div>
  );
};

export default Disclaimer;