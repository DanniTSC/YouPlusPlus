// src/components/RecommendationCard.jsx
import React from 'react';

const RecommendationCard = ({ text }) => (
  <div className="mt-6 bg-[#E8F0FE] p-4 rounded-lg shadow-inner">
    <h3 className="font-semibold text-[#2E7D32] mb-2">Recomandare personalizată</h3>
    <p className="text-gray-700">{text}</p>
  </div>
);

export default RecommendationCard;
