import React, { useState, useEffect, useRef } from 'react';
import StreakChart from '../components/StreakChart';
import { toast } from 'react-hot-toast';

const Home = () => {
  const [user, setUser] = useState(null);
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState('');
  const [streak, setStreak] = useState(0);
  const [badges, setBadges] = useState([]);
  const [weeklyData, setWeeklyData] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [quote, setQuote] = useState('');

  const toastFiredRef = useRef(false);

  useEffect(() => {
    const fetchEverything = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      const headers = { Authorization: token };

      try {
        const [userRes, habitsRes, quoteRes, evalRes] = await Promise.all([
          fetch('http://localhost:5000/api/auth/home', { headers }),
          fetch('http://localhost:5000/api/habits', { headers }),
          fetch('http://localhost:5000/api/quote', { headers }),
          fetch('http://localhost:5000/api/habits/evaluate', { headers }),
        ]);

        const userData = await userRes.json();
        const habitsData = await habitsRes.json();
        const quoteData = await quoteRes.json();
        const evalData = await evalRes.json();

        setUser(userData);
        setHabits(habitsData);
        setQuote(quoteData.quote);
        setStreak(evalData.streak);
        setBadges(evalData.badges);
        setWeeklyData(evalData.weeklyData);

      } catch (err) {
        console.error('Eroare fetch:', err);
      }
    };

    fetchEverything();
  }, []);

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
    const res = await fetch('http://localhost:5000/api/habits', { headers: { Authorization: token } });
    const freshHabits = await res.json();
    setHabits(freshHabits);
  };

  const toggleHabit = async (id, current) => {
    const token = localStorage.getItem('token');

    await fetch(`http://localhost:5000/api/habits/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({ completed: !current }),
    });

    const res = await fetch('http://localhost:5000/api/habits', { headers: { Authorization: token } });
    const updated = await res.json();
    setHabits(updated);

    const completed = updated.filter(h => h.completed).length;
    const total = updated.length;
    const reached50 = total > 0 && completed >= Math.floor(total / 2);

    if (reached50 && !toastFiredRef.current) {
      toast.success(' Bravo! Ai bifat cel puțin jumătate dintre obiceiurile zilnice. Streak-ul tău e salvat!');
      toastFiredRef.current = true;
    }

    // Actualizare streak & badge-uri fără blocaje
    const evalRes = await fetch('http://localhost:5000/api/habits/evaluate', { headers: { Authorization: token } });
    const evalData = await evalRes.json();

    setStreak(evalData.streak);
    setBadges(evalData.badges);
    setWeeklyData(evalData.weeklyData);
  };

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
          Bun venit, {user?.name || 'Utilizator'}! 
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
                habit.completed ? 'bg-green-50 border-green-300' : 'border-gray-300'
              }`}
            >
              <span className={`text-lg ${habit.completed ? 'line-through text-green-700' : ''}`}>
                {habit.name}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleHabit(habit._id, habit.completed)}
                  className={`px-3 py-1 rounded-md text-white font-medium transition ${
                    habit.completed ? 'bg-green-500 hover:bg-green-600' : 'bg-[#EE5249] hover:bg-red-600'
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
