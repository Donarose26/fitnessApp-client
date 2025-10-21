import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import 'remixicon/fonts/remixicon.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Workout from './pages/Workout';
import Register from './pages/Register';
import UserContext from './UserContext';

function App() {
  const [user, setUser] = useState({ id: null });
  const [loadingUser, setLoadingUser] = useState(true); // ✅ loading state

  const unsetUser = () => {
    localStorage.removeItem('token');
    setUser({ id: null });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoadingUser(false);
      return;
    }

    fetch('https://fitnessapi-agpalza-1.onrender.com/users/details', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Token invalid or expired');
        return res.json();
      })
      .then(data => {
        if (data.user) setUser({ id: data.user._id });
        else unsetUser();
      })
      .catch(err => {
        console.error(err);
        unsetUser();
      })
      .finally(() => setLoadingUser(false)); // ✅ done loading
  }, []);

  // ✅ Wait until user is loaded
  if (loadingUser) return null;

  return (
    <UserContext.Provider value={{ user, setUser, unsetUser }}>
      <Router>
    
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/homepage" element={<Homepage />} />
            <Route path="/workouts" element={<Workout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
   
      </Router>
    </UserContext.Provider>
  );
}

export default App;
