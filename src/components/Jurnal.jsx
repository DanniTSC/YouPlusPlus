import React, { useState, useEffect } from 'react';

const Journal = () => {
  const [entries, setEntries] = useState([]);
  const [content, setContent] = useState('');
  const [prompt, setPrompt] = useState('');

  const token = localStorage.getItem('token');

  const fetchEntries = async () => {
    const res = await fetch('http://localhost:5000/api/journal', {
      headers: { Authorization: token }
    });
    const data = await res.json();
    setEntries(data);
  };

  const saveEntry = async () => {
    if (!content.trim()) return;
    await fetch('http://localhost:5000/api/journal', {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content })
    });
    setContent('');
    fetchEntries();
  };

  const getPrompt = async () => {
    const res = await fetch('http://localhost:5000/api/journal/prompt');
    const data = await res.json();
    setPrompt(data.prompt);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-semibold mb-4 text-[#8E1C3B]">📝 Jurnalul Meu</h1>

      {prompt && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-300 rounded">
          <strong>Exercițiu propus:</strong> {prompt}
        </div>
      )}

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={5}
        placeholder="Scrie ce simți azi..."
        className="w-full border border-gray-300 rounded p-3 mb-4"
      />

      <div className="flex gap-3">
        <button onClick={saveEntry} className="bg-[#8E1C3B] text-white px-4 py-2 rounded">
          Salvează
        </button>
        <button onClick={getPrompt} className="bg-[#FFD045] text-black px-4 py-2 rounded">
          Arată un exercițiu
        </button>
      </div>

      <hr className="my-6" />

      <h2 className="text-lg font-medium mb-2">⏳ Înregistrările tale recente</h2>
      <ul className="space-y-3 text-sm">
        {entries.map((entry) => (
          <li key={entry._id} className="border p-3 rounded bg-gray-50">
            <div className="text-gray-600 text-xs mb-1">{new Date(entry.createdAt).toLocaleString()}</div>
            <div>{entry.content.slice(0, 200)}{entry.content.length > 200 && '...'}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Journal;
