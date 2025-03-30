import React, { useState, useEffect } from 'react';
import StreakChart from '../components/StreakChart';

const Home = () => {
  // 🔐 State pentru utilizator
  const [user, setUser] = useState(null);

  // ✅ State pentru obiceiuri
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState('');

  // 🔥 State pentru streak și badge-uri
  const [streak, setStreak] = useState(0);
  const [badges, setBadges] = useState([]);

  // 📊 Datele săptămânale pentru grafic
  const [weeklyData, setWeeklyData] = useState([3, 5, 7, 2, 6, 4, 0]); // Simulat pentru acum

  // 🧠 Fetch user din API + încărcare obiceiuri din localStorage
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:5000/api/auth/home', {
        method: 'GET',
        headers: { Authorization: token },
      });

      const data = await response.json();
      if (response.ok) {
        setUser(data);

        const stored = localStorage.getItem(`habits-${data.email}`);
        if (stored) {
          setHabits(JSON.parse(stored));
        }
      }
    };

    fetchUserData();
  }, []);

  // 💾 Salvează obiceiurile local pentru utilizator
  useEffect(() => {
    if (user?.email) {
      localStorage.setItem(`habits-${user.email}`, JSON.stringify(habits));
    }
  }, [habits, user]);

  // 🎯 Logica pentru streak și badge-uri
  useEffect(() => {
    const completed = habits.filter((h) => h.completed).length;
    const total = habits.length;

    if (total > 0) {
      const percent = (completed / total) * 100;
      if (percent >= 60) {
        setStreak((prev) => prev + 1);
      } else {
        setStreak(0); // streak pierdut
      }
    }

    const newBadges = [];
    if (streak >= 3) newBadges.push('Un Nou Start 🚀');
    if (streak >= 7) newBadges.push('Voință de Fier 💪');
    if (streak >= 30) newBadges.push('Voință de Aur 🏅');
    setBadges(newBadges);
  }, [habits]);

  // ✅ Funcții obiceiuri
  const toggleHabit = (id) => {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === id ? { ...habit, completed: !habit.completed } : habit
      )
    );
  };

  const deleteHabit = (id) => {
    setHabits((prev) => prev.filter((habit) => habit.id !== id));
  };

  const addHabit = () => {
    if (!newHabit.trim()) return;

    const newHabitObj = {
      id: Date.now(),
      name: newHabit,
      completed: false,
    };
    setHabits((prev) => [...prev, newHabitObj]);
    setNewHabit('');
  };

  // 🔽 RETURN
  return (
    <div className="text-[#555352] max-w-5xl mx-auto pb-28 mt-16">  {/* <-- am pus mt-16 */}
    {/* ... restul codului */}
    <div className="mb-10">
      <h1 className="text-3xl md:text-4xl font-bold text-[#8E1C3B] mb-2">
        Bun venit, {user?.name || 'Utilizator'}! 👋
        </h1>
        <p className="text-xl text-gray-700 italic">
          "Nu aștepta momentul perfect – creează-l."
        </p>
      </div>

      {/* 📋 Habit Tracker */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-[#EE5249]">Obiceiurile tale de azi</h2>

        {/* ➕ Adaugă obicei */}
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

        {/* ✅ Listă obiceiuri */}
        <ul className="space-y-4">
          {habits.length === 0 && (
            <p className="text-sm text-gray-500 italic">Nu ai adăugat încă obiceiuri.</p>
          )}
          {habits.map((habit) => (
            <li
              key={habit.id}
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
                  onClick={() => toggleHabit(habit.id)}
                  className={`px-3 py-1 rounded-md text-white font-medium transition ${
                    habit.completed ? 'bg-green-500 hover:bg-green-600' : 'bg-[#EE5249] hover:bg-red-600'
                  }`}
                >
                  {habit.completed ? 'Completat' : 'Bifează'}
                </button>
                <button
                  onClick={() => deleteHabit(habit.id)}
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

      {/* 📊 Grafic progres săptămânal */}
      <StreakChart data={weeklyData} />

      {/* 🏅 Badge-uri & streak */}
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
