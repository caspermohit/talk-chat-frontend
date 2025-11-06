import { useState, useEffect } from 'react'
import React from 'react'
import { BrowserRouter, Routes, Route, Navigate ,Link} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register' 
import Categories from './pages/Categories'
import Chat from './pages/Chat'
import { setAuthToken } from './api'

import './App.css'
import Navbar from './components/navbar'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  
  useEffect(() => {
    // Set auth token when app loads
    if (token) {
      setAuthToken(token);
    }
  }, [token]);

  // Listen for storage changes to update token state
  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = localStorage.getItem('token');
      setToken(newToken);
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events for same-tab updates
    window.addEventListener('tokenUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('tokenUpdated', handleStorageChange);
    };
  }, []);
  return (
    <div>
    
    <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={token ? <Categories /> : <Navigate to="/login" />} />
          <Route path="/chat/:categoryId" element={token ? <Chat /> : <Navigate to="/login" />} />
          <Route path="/categories" element={token ? <Categories /> : <Navigate to="/login" />} />
          <Route path="/login" element={token ? <Navigate to="/categories" /> : <Login />} />      
          <Route path="/register" element={token ? <Navigate to="/categories" /> : <Register />} />
        </Routes>
      </div>
    </div>


  
  )
}

export default App
