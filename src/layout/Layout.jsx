import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatbotCoach from '../components/ChatbotCoach';

const Layout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex">
      <Sidebar isOpen={isOpen} toggleSidebar={() => setIsOpen(!isOpen)} />
      <div
        className={`flex-1 transition-all duration-300 ${
          isOpen ? 'ml-64' : 'ml-20'
        } px-6 py-10 bg-[#FFFDF9] min-h-screen`}
      >
        {children}
        <ChatbotCoach />
      </div>
    </div>
  );
};

export default Layout;
