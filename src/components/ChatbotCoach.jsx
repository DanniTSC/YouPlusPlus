import React, { useState, useEffect } from 'react';
import botIcon from '../assets/images/chatbot-icon.png';
import { FaSpinner } from 'react-icons/fa';

const ChatbotCoach = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', content: '👋 Hei! Sunt Echo – versiunea ta de peste 6 luni. Hai să construim împreună acea versiune, începând azi.' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   console.log("KEY:", import.meta.env.VITE_OPENAI_KEY);
  // }, []);
  

  const sendMessage = async () => {
    if (!input.trim()) return;
  
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
  
    try {
      const systemPrompt = {
        role: 'system',
        content: "Ești Echo – o versiune avansată a utilizatorului, un coach AI personal care vorbește din viitorul său. Ești pozitiv, empatic, strategic. Nu spui povești. Dai sfaturi reale pentru obiceiuri mai bune, echilibru și focus. Vorbește ca un coach motivațional din 2030."
      };
  
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_KEY}`, // cheia e din .env
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [systemPrompt, ...newMessages],
        }),
      });
  
      const data = await response.json();
      const reply = data.choices[0].message;
      setMessages([...newMessages, reply]);
    } catch (error) {
      setMessages([...newMessages, { role: 'assistant', content: '❌ Eroare la comunicarea cu Echo.' }]);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      {/* Buton plutitor */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 p-0 bg-transparent border-none hover:scale-105 transition focus:outline-none"
      >
        <img
          src={botIcon}
          alt="CoachBot"
          className="w-14 h-14 object-cover rounded-full shadow-lg border border-white"
        />
      </button>

      {/* Fereastra Chat */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 bg-white border border-gray-300 shadow-xl rounded-lg overflow-hidden z-50 flex flex-col h-[420px]">
          <div className="bg-[#8E1C3B] text-white px-4 py-2 font-semibold text-sm">
            🧠 CoachBot – Mentorul tău digital
          </div>

          <div className="flex-1 p-3 overflow-y-auto text-sm space-y-2 bg-[#FFF7F3]">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded max-w-[85%] ${
                  msg.role === 'user'
                    ? 'bg-gray-100 text-gray-800 self-end ml-auto'
                    : 'bg-[#FFD045] text-[#8E1C3B] self-start'
                }`}
              >
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="text-center text-gray-400 text-xs animate-pulse">CoachBot scrie...</div>
            )}
          </div>

          <div className="flex p-2 border-t border-gray-200">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
              placeholder="Scrie ceva motivațional..."
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-[#8E1C3B] text-white px-3 py-1 rounded text-sm ml-2"
            >
              {loading ? <FaSpinner className="animate-spin" /> : 'Trimite'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};


export default ChatbotCoach;
