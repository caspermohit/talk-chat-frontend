import React from 'react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { setAuthToken } from '../api';
import './navbar.css';

export default function Navbar(){
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(() => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    });
    
    useEffect(() => {
        if (token) {
            setAuthToken(token);
            const userStr = localStorage.getItem('user');
            setUser(userStr ? JSON.parse(userStr) : null);
        } else {
            setUser(null);
        }
    }, [token]);

    useEffect(() => {
        const handleStorageChange = () => {
            const newToken = localStorage.getItem('token');
            setToken(newToken);
            const userStr = localStorage.getItem('user');
            setUser(userStr ? JSON.parse(userStr) : null);
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('tokenUpdated', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('tokenUpdated', handleStorageChange);
        };
    }, []);
    return (
        <div className='wrapper'>
        <div className='navbar-left'>
        <h1>TalkChat</h1>
        </div>
        <div className='navbar-right'>
        <nav> 
            <a className='primary-button' href="/">Home</a>
        </nav>
        <nav>
            <a className='primary-button' href="/categories">Categories</a>
        </nav>

           
        <nav>
            {user ? (
                <>
                    
                    <a className='primary-button' onClick={()=>{
                        localStorage.clear();
                        setToken(null);
                        window.location.href = '/'
                    }} >Logout</a>
                    <a className='font-bold' >{user.name}</a>
                </>

            ) : (
                <>
                    <a className='primary-button' onClick={()=>{
                        window.location.href = '/login';
                    }}>Login</a>
                    <a className='primary-button' href="/register">Register</a>
                </>
            )   
            }
        </nav>
        </div>
        </div>
    );
}