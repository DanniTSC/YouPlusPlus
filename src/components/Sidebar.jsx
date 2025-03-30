import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiSettings, FiLogOut, FiMenu } from 'react-icons/fi';
import { GiMeditation } from 'react-icons/gi';
import { BsJournalText, BsQuote } from 'react-icons/bs';
import { FaAppleAlt } from 'react-icons/fa';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const menuItems = [
    { label: 'Home', icon: <FiHome />, path: '/home' },
    { label: 'Nutriție', icon: <FaAppleAlt />, path: '/nutrition' },
    { label: 'Meditație', icon: <GiMeditation />, path: '/meditation' },
    { label: 'Jurnal', icon: <BsJournalText />, path: '/journal' },
    { label: 'Setări', icon: <FiSettings />, path: '/settings' },
  ];

  return (
    <div className={`h-screen bg-[#F7CBA4] text-[#8E1C3B] shadow-lg p-4 transition-all duration-300
      ${isOpen ? 'w-64' : 'w-20'} fixed top-0 left-0 z-40 flex flex-col`}>
      {/* Toggle */}
      <div className="flex justify-between items-center mb-8 z-50 bg-[#F7CBA4]">
        <h1 className={`text-2xl font-bold transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
          You++
        </h1>
        <button onClick={toggleSidebar} className="text-xl">
          <FiMenu />
        </button>
      </div>

      {/* Menu */}
      <nav className="flex flex-col space-y-4">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className="flex items-center gap-3 hover:underline"
          >
            <span className="text-xl">{item.icon}</span>
            {isOpen && <span className="text-md">{item.label}</span>}
          </NavLink>
        ))}
        <button
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/auth';
          }}
          className="flex items-center gap-3 text-red-600 hover:underline mt-8"
        >
          <FiLogOut className="text-xl" />
          {isOpen && <span>Logout</span>}
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
