import React from 'react';

const TooltipInfo = ({ text }) => (
  <div className="relative group inline-block cursor-help">
    {/* Icon subtil */}
    <div className="w-5 h-5 bg-white border border-[#8E1C3B] text-[#8E1C3B] text-[13px] font-bold rounded-full flex items-center justify-center shadow-sm hover:bg-[#8E1C3B] hover:text-white transition-colors">
      i
    </div>

    {/* Tooltip-ul hover */}
    <div className="absolute z-10 hidden group-hover:block bg-white text-sm text-[#333] border border-gray-200 rounded-lg shadow-lg p-3 w-64 mt-2 left-1/2 -translate-x-1/2">
      {text}
    </div>
  </div>
);

export default TooltipInfo;
