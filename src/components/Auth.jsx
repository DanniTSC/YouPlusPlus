import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';



const Auth = () => {
    const navigate = useNavigate(); // Pentru redirecționare
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };



    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isSignup ? 'http://localhost:5000/api/auth/signup' : 'http://localhost:5000/api/auth/login';

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(isSignup ? 'Înregistrare reușită!' : 'Autentificare reușită!');
                if (!isSignup) {
                    localStorage.setItem('token', data.token);
                    navigate('/home'); // Redirecționează spre Home
                }
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage('Eroare la conectare!');
        }
    };

    return (
        <div>
            <h2>{isSignup ? 'Înregistrare' : 'Autentificare'}</h2>
            <form onSubmit={handleSubmit}>
                {isSignup && <input type="text" name="name" placeholder="Nume" value={formData.name} onChange={handleChange} required />}
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <input type="password" name="password" placeholder="Parolă" value={formData.password} onChange={handleChange} required />
                <button type="submit">{isSignup ? 'Înregistrează-te' : 'Autentifică-te'}</button>
            </form>
            <p>{message}</p>
            <button onClick={() => setIsSignup(!isSignup)}>
                {isSignup ? 'Ai deja cont? Autentifică-te' : 'Nu ai cont? Înregistrează-te'}
            </button>
        </div>
    );
};

export default Auth;
