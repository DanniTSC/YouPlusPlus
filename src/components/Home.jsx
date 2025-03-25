import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch('http://localhost:5000/api/auth/home', {
                method: 'GET',
                headers: { 'Authorization': token }
            });

            const data = await response.json();
            if (response.ok) {
                setUser(data);
            }
        };

        fetchUserData();
    }, []);

    return (
        <div>
            <h1>Pagina Home</h1>
            {user ? (
                <p>Bun venit, {user.name}!</p>
            ) : (
                <p>Te rugăm să te autentifici.</p>
            )}
        </div>
    );
};

export default Home;
