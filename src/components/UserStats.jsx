import React, { useEffect, useState } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend,
} from 'chart.js';

Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const moodLabels = {
  anxios: '😰 Anxios',
  stresat: '😓 Stresat',
  neutru: '😐 Neutru',
  calm: '😌 Calm',
  fericit: '😊 Fericit',
};

const UserStats = ({ refresh }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      const res = await fetch('http://localhost:5000/api/meditation/sessions', {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });
      const data = await res.json();
      setSessions(data);
      setLoading(false);
    };
    fetchSessions();
  }, [refresh]);

  const moodCount = { before: {}, after: {} };
  const progress = { Îmbunătățire: 0, 'Fără schimbare': 0, Scădere: 0 };

  sessions.forEach(s => {
    const b = s.moodBefore?.descriptor;
    const a = s.moodAfter?.descriptor;
    const bs = s.moodBefore?.score;
    const as = s.moodAfter?.score;

    if (b) moodCount.before[b] = (moodCount.before[b] || 0) + 1;
    if (a) moodCount.after[a] = (moodCount.after[a] || 0) + 1;

    if (bs != null && as != null) {
      const delta = as - bs;
      if (delta > 0) progress['Îmbunătățire']++;
      else if (delta === 0) progress['Fără schimbare']++;
      else progress['Scădere']++;
    }
  });

  const getMoodLabels = (dataObj) =>
    Object.keys(dataObj).map(k => moodLabels[k] || k);

  if (loading) return <p className="text-gray-600 italic">Se încarcă sesiunile...</p>;
  if (!sessions.length) return <p className="text-gray-500">Nu ai încă date pentru rapoarte. Începe o sesiune!</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {/* Mood Before */}
      <div className="bg-white p-4 rounded shadow">
        <h4 className="font-bold text-[#8E1C3B] mb-4">📍 Stări inițiale (înainte de meditație)</h4>
        <Doughnut
          data={{
            labels: getMoodLabels(moodCount.before),
            datasets: [{
              data: Object.values(moodCount.before),
              backgroundColor: ['#f87171', '#fb923c', '#facc15', '#4ade80', '#60a5fa'],
              borderWidth: 1,
            }],
          }}
          options={{
            plugins: {
              legend: {
                position: 'bottom',
                labels: { boxWidth: 20 },
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.label || '';
                    const value = context.parsed || 0;
                    return `${label}: ${value} sesiuni`;
                  }
                }
              }
            }
          }}
        />
      </div>

      {/* Mood After */}
      <div className="bg-white p-4 rounded shadow">
        <h4 className="font-bold text-[#8E1C3B] mb-4">🎯 Stări finale (după meditație)</h4>
        <Doughnut
          data={{
            labels: getMoodLabels(moodCount.after),
            datasets: [{
              data: Object.values(moodCount.after),
              backgroundColor: ['#a78bfa', '#f472b6', '#fb923c', '#4ade80', '#60a5fa'],
              borderWidth: 1,
            }],
          }}
          options={{
            plugins: {
              legend: {
                position: 'bottom',
                labels: { boxWidth: 20 },
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.label || '';
                    const value = context.parsed || 0;
                    return `${label}: ${value} sesiuni`;
                  }
                }
              }
            }
          }}
        />
      </div>

      {/* Progress Chart */}
      <div className="bg-white p-4 rounded shadow col-span-1 md:col-span-2">
        <h4 className="font-bold text-[#8E1C3B] mb-4">📈 Evoluția stării emoționale după meditații</h4>
        <Bar
          data={{
            labels: Object.keys(progress),
            datasets: [{
              label: 'Număr sesiuni',
              data: Object.values(progress),
              backgroundColor: ['#4ade80', '#facc15', '#f87171'],
              borderRadius: 6,
              barThickness: 40,
            }],
          }}
          options={{
            scales: {
              y: { beginAtZero: true },
            },
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `${context.formattedValue} sesiuni`;
                  }
                }
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default UserStats;
