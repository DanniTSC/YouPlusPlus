import React, { useState } from 'react';
import botIcon from '../assets/images/chatbot-icon.png';


<button
  onClick={() => setIsOpen(!isOpen)}
  className="fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-xl transition focus:outline-none focus:ring-0"
>
  <img
    src={botIcon}
    alt="Chatbot"
    className="w-full h-full rounded-full object-cover"
  />
</button>

const ChatbotCoach = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Salut! Cu ce te pot ajuta azi?' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer TAIE_CHEIA_TA_AICI`, // 🔑 schimbă cu cheia ta
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: newMessages,
        }),
      });

      const data = await response.json();
      const reply = data.choices[0].message;
      setMessages([...newMessages, reply]);
    } catch (error) {
      setMessages([...newMessages, { role: 'assistant', content: 'Eroare la comunicarea cu AI.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Buton plutitor */}
      <button
  onClick={() => setIsOpen(!isOpen)}
  className="fixed bottom-6 right-6 p-0 bg-transparent border-none shadow-none hover:scale-105 transition focus:outline-none focus:ring-0"
>
  <img
    src={botIcon}
    alt="Chatbot"
    className="w-15 h-20 object-cover rounded-full"
  />
</button>



      {/* Fereastră chatbot */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 bg-white border border-gray-300 shadow-lg rounded-md overflow-hidden z-50 flex flex-col h-[400px]">
          <div className="bg-[#F47174] text-white px-4 py-2 font-semibold">Chatbot Coach</div>
          <div className="flex-1 p-3 overflow-y-auto text-sm space-y-2">
            {messages.map((msg, index) => (
              <div key={index} className={`p-2 rounded ${msg.role === 'user' ? 'bg-[#EEE]' : 'bg-[#FFD045]'}`}>
                {msg.content}
              </div>
            ))}
          </div>
          <div className="flex p-2 border-t border-gray-200">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 px-2 py-1 border border-gray-300 rounded mr-2 text-sm"
              placeholder="Scrie un mesaj..."
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-[#8E1C3B] text-white px-3 rounded text-sm"
            >
              Trimite
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotCoach;
