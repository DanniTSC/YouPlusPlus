import React, { useState, useEffect, useRef } from 'react';
import { FaTrash } from 'react-icons/fa';
import Modal from '../components/Modal';

const Journal = () => {
  const [entries, setEntries] = useState([]);
  const [content, setContent] = useState('');
  const [prompt, setPrompt] = useState('');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const autoSaveTimer = useRef(null);
  const token = localStorage.getItem('token');

  // iau continutul decriptat
  const fetchEntries = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/journal', {
        headers: { Authorization: token }
      });
      if (!res.ok) {
        console.error('Eroare la fetch entries:', await res.json());
        return;
      }
      const data = await res.json();
      setEntries(data);
    } catch (err) {
      console.error('Fetch entries error:', err);
    }
  };

  // salvez continut nou ce va fi criptat eventual
  const saveEntry = async () => {
    if (!content.trim()) return;
    try {
      const res = await fetch('http://localhost:5000/api/journal', {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
      });
      if (res.ok) {
        setContent('');
        fetchEntries();
      } else {
        console.error('Eroare la salvare entry:', await res.json());
      }
    } catch (err) {
      console.error('Save entry error:', err);
    }
  };


  const deleteEntry = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/journal/${id}`, {
        method: 'DELETE',
        headers: { Authorization: token }
      });
      if (res.ok) {
        fetchEntries();
      } else {
        console.error('Eroare la ștergere entry:', await res.json());
      }
    } catch (err) {
      console.error('Delete entry error:', err);
    }
  };

  // Update 
  const updateEntry = async () => {
    if (!selectedEntry?.content.trim()) return;
    try {
      const res = await fetch(`http://localhost:5000/api/journal/${selectedEntry._id}`, {
        method: 'PATCH',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: selectedEntry.content })
      });
      if (res.ok) {
        setShowModal(false);
        fetchEntries();
      } else {
        console.error('Eroare la actualizare entry:', await res.json());
      }
    } catch (err) {
      console.error('Update entry error:', err);
    }
  };

  // random exercise
  const getPrompt = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/journal/prompt', {
        headers: { Authorization: token }
      });
      if (res.ok) {
        const data = await res.json();
        setPrompt(data.prompt);
      } else {
        console.error('Eroare la generare prompt:', await res.json());
      }
    } catch (err) {
      console.error('Get prompt error:', err);
    }
  };

  // deschis modal pentru editare 
  const handleEntryClick = (entry) => {
    setSelectedEntry(entry);
    setShowModal(true);
  };

 
  useEffect(() => {
    fetchEntries();
  }, []);

  // Auto-save la fiecare 30s
  useEffect(() => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      if (content.trim()) saveEntry();
    }, 30000);
    return () => clearTimeout(autoSaveTimer.current);
  }, [content]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 text-[#555352]">
  <h1 className="text-3xl font-bold text-[#8E1C3B] mb-6">📓 Jurnalul Tău</h1>

  {prompt && (
    <div className="bg-yellow-100 text-[#8E1C3B] p-4 rounded-lg mb-6 shadow">
      <p className="font-semibold">Exercițiu recomandat:</p>
      <p className="italic mt-1">{prompt}</p>
    </div>
  )}

  <textarea
    value={content}
    onChange={(e) => setContent(e.target.value)}
    rows={6}
    placeholder="Scrie liber despre ce simți azi..."
    className="w-full border border-gray-300 rounded-md p-4 mb-4 focus:outline-none focus:ring-2 focus:ring-[#FFD045] transition"
  />

  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
    <div className="flex gap-3">
      <button
        onClick={saveEntry}
        className="px-4 py-2 bg-[#8E1C3B] text-white rounded-md hover:bg-[#75162f] transition"
      >
        Salvează
      </button>
      <button
        onClick={getPrompt}
        className="px-4 py-2 bg-[#FFD045] text-black rounded-md hover:bg-[#e5c03d] transition"
      >
        Arată un exercițiu
      </button>
    </div>
    <p className="text-sm text-gray-500">(Se salvează automat la 30s)</p>
  </div>

  <h2 className="text-xl font-semibold text-[#8E1C3B] mb-4">📅 Înregistrări recente</h2>

  <ul className="space-y-4">
    {entries.length === 0 && (
      <p className="text-gray-500 italic">Nu ai înregistrări salvate încă.</p>
    )}
    {entries.map((entry) => (
      <li
        key={entry._id}
        className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition flex justify-between items-start"
      >
        <div onClick={() => handleEntryClick(entry)} className="cursor-pointer w-full pr-4">
          <div className="text-xs text-gray-400 mb-1">
            {new Date(entry.createdAt).toLocaleString()}
          </div>
          <p className="text-sm line-clamp-3">
            {entry.content.length > 200
              ? `${entry.content.slice(0, 200)}...`
              : entry.content}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteEntry(entry._id);
          }}
          className="text-red-400 hover:text-red-600 mt-1"
        >
          <FaTrash />
        </button>
      </li>
    ))}
  </ul>

  {showModal && selectedEntry && (
    <Modal onClose={() => setShowModal(false)}>
      <h3 className="text-lg font-bold mb-2 text-[#8E1C3B]">✏️ Editează înregistrarea</h3>
      <textarea
        value={selectedEntry.content}
        onChange={(e) =>
          setSelectedEntry({ ...selectedEntry, content: e.target.value })
        }
        className="w-full border p-3 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD045]"
        rows={6}
      />
      <button
        onClick={updateEntry}
        className="mt-4 bg-[#8E1C3B] text-white px-4 py-2 rounded-md hover:bg-[#75162f] transition"
      >
        Salvează modificarea
      </button>
    </Modal>
  )}
</div>

  );
};

export default Journal;
