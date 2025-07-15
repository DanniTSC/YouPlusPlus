import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const SettingsPage = () => {
  const [email, setEmail] = useState('');
  const [name, setName]   = useState('');
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('http://localhost:5000/api/auth/me', {
      headers: { Authorization: token }
    })
      .then(res => res.json())
      .then(u => {
        setEmail(u.email);
        setName(u.name);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Nu am putut încărca profilul.');
        setLoading(false);
      });
  }, []);

  const handleNameSave = () => {
    fetch('http://localhost:5000/api/auth/me', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
      body: JSON.stringify({ name })
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(u => {
        setName(u.name);
        toast.success('Numele a fost actualizat.');
      })
      .catch(() => toast.error('Eroare la salvarea numelui.'));
  };

  const handleDeleteJournal = () => {
    if (!window.confirm('Ești sigur că vrei să ștergi toate intrările din jurnal?'))
      return;
    fetch('http://localhost:5000/api/journal/all', {
      method: 'DELETE',
      headers: { Authorization: token }
    })
      .then(res => {
        if (!res.ok) throw new Error();
        toast.success('Jurnal șters.');
      })
      .catch(() => toast.error('Eroare la ștergerea jurnalului.'));
  };

  const handleDownloadJournal = () => {
    fetch('http://localhost:5000/api/journal/export', {
      headers: { Authorization: token }
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.blob();
      })
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const a   = document.createElement('a');
        a.href = url;
        a.download = 'journal.csv';
        document.body.append(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      })
      .catch(() => toast.error('Eroare la export jurnal.'));
  };

  if (loading) return <p>Se încarcă…</p>;

  return (
    <div className="max-w-3xl mx-auto mt-12 bg-white p-8 rounded-lg shadow-md text-[#333] space-y-8">
      <h1 className="text-3xl font-bold text-[#8E1C3B]">⚙️ Setările tale</h1>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          value={email}
          readOnly
          className="w-full p-3 border rounded bg-gray-100 cursor-not-allowed"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Nume</label>
        <div className="flex gap-4">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="flex-1 p-3 border rounded"
          />
          <button
            onClick={handleNameSave}
            className="bg-[#8E1C3B] text-white px-4 py-2 rounded hover:bg-[#6e1a30]"
          >
            Salvează
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <button
          onClick={handleDeleteJournal}
          className="bg-red-100 text-red-800 px-4 py-2 rounded hover:bg-red-200"
        >
          🗑️ Șterge toate intrările din jurnal
        </button>
        <button
          onClick={handleDownloadJournal}
          className="bg-[#E4F7ED] text-[#333] px-4 py-2 rounded hover:bg-[#cef0e0]"
        >
          📁 Descarcă jurnalul (CSV)
        </button>
      </div>

      <div className="pt-6 border-t text-sm text-gray-600">
        Pentru feedback: <a href="mailto:tascudanielvalentin@gmail.com" className="text-[#8E1C3B]">tascudanielvalentin@gmail.com</a>
      </div>
    </div>
  );
};

export default SettingsPage;
