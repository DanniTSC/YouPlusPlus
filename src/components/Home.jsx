import React, { useState, useEffect } from 'react';
import StreakChart from '../components/StreakChart';

const Home = () => {
  const [user, setUser] = useState(null);
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState('');
  const [streak, setStreak] = useState(0);
  const [badges, setBadges] = useState([]);
  const [weeklyData, setWeeklyData] = useState([0, 0, 0, 0, 0, 0, 0]); // inițial
  const [quote, setQuote] = useState('');

  // Fetch user + habits + evaluare streak
  useEffect(() => {
    const fetchEverything = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
  
      const headers = { Authorization: token };
  
      try {
        // 1️⃣ User info
        const userRes = await fetch('http://localhost:5000/api/auth/home', { headers });
        const userData = await userRes.json();
        setUser(userData);
  
        // 2️⃣ Habits pentru azi
        const habitsRes = await fetch('http://localhost:5000/api/habits', { headers });
        const habitsData = await habitsRes.json();
        setHabits(habitsData);
  
        // 3️⃣ Quote motivațional
        const quoteRes = await fetch('http://localhost:5000/api/quote', { headers });
        const quoteData = await quoteRes.json();
        setQuote(quoteData.quote);
  
        // 4️⃣ Streak, badge-uri, progres săptămânal
        const evalRes = await fetch('http://localhost:5000/api/habits/evaluate', { headers });
        const evalData = await evalRes.json();
        setStreak(evalData.streak);
        setBadges(evalData.badges);
        setWeeklyData(evalData.weeklyData);
  
      } catch (err) {
        console.error('❌ Eroare la fetch:', err);
      }
    };
  
    fetchEverything();
  }, []);

  // Add new habit (POST)
  const addHabit = async () => {
    const token = localStorage.getItem('token');
    if (!newHabit.trim()) return;
  
    await fetch('http://localhost:5000/api/habits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({ name: newHabit }),
    });
  
    setNewHabit('');
  
    // ⬇️ Refacem fetchul complet după adăugare
    const res = await fetch('http://localhost:5000/api/habits', {
      headers: { Authorization: token },
    });
    const freshHabits = await res.json();
    setHabits(freshHabits);
  };

  // Toggle habit completion (PATCH)
  const toggleHabit = async (id, current) => {
    const token = localStorage.getItem('token');

    const response = await fetch(`http://localhost:5000/api/habits/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({ completed: !current }),
    });

    const updated = await response.json();
    setHabits((prev) => prev.map((h) => (h._id === id ? updated : h)));
  };

  // Delete habit (DELETE)
  const deleteHabit = async (id) => {
    const token = localStorage.getItem('token');

    await fetch(`http://localhost:5000/api/habits/${id}`, {
      method: 'DELETE',
      headers: { Authorization: token },
    });

    setHabits((prev) => prev.filter((h) => h._id !== id));
  };

  return (
    <div className="text-[#555352] max-w-5xl mx-auto pb-28 mt-16">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-[#8E1C3B] mb-2">
          Bun venit, {user?.name || 'Utilizator'}! 👋
        </h1>
        <p className="text-xl text-gray-700 italic">
        {quote || "Citat motivațional..."}
        </p>
      </div>

      {/* Habit Tracker */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-[#EE5249]">Obiceiurile tale de azi</h2>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <input
            type="text"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            placeholder="Ex: Citește 10 pagini"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFD045]"
          />
          <button
            onClick={addHabit}
            className="px-4 py-2 bg-[#56C0BC] hover:bg-[#48ada9] text-white rounded-md transition"
          >
            Adaugă obicei
          </button>
        </div>

        <ul className="space-y-4">
          {habits.length === 0 && (
            <p className="text-sm text-gray-500 italic">Nu ai adăugat încă obiceiuri.</p>
          )}
          {habits.map((habit) => (
            <li
              key={habit._id}
              className={`flex items-center justify-between border p-3 rounded-md transition ${
                habit.completed
                  ? 'bg-green-50 border-green-300'
                  : 'border-gray-300'
              }`}
            >
              <span className={`text-lg ${habit.completed ? 'line-through text-green-700' : ''}`}>
                {habit.name}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleHabit(habit._id, habit.completed)}
                  className={`px-3 py-1 rounded-md text-white font-medium transition ${
                    habit.completed
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-[#EE5249] hover:bg-red-600'
                  }`}
                >
                  {habit.completed ? 'Completat' : 'Bifează'}
                </button>
                <button
                  onClick={() => deleteHabit(habit._id)}
                  className="text-red-400 hover:text-red-600 text-xl"
                  title="Șterge"
                >
                  ✖
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <StreakChart data={weeklyData} />

      <div className="mt-12 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-[#8E1C3B] mb-4">Streak și Badge-uri</h2>

        <div className="mb-6">
          <p className="text-lg">
            🔥 <span className="font-bold text-[#EE5249]">{streak}</span> zile consecutive cu progres!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {badges.length === 0 && (
            <p className="text-sm text-gray-500 italic">Încă nu ai obținut badge-uri.</p>
          )}
          {badges.map((badge, index) => (
            <div
              key={index}
              className="p-4 border border-yellow-300 rounded-lg text-center bg-yellow-50 shadow-sm hover:shadow-md transition"
            >
              <span className="text-xl font-medium text-[#8E1C3B]">{badge}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
