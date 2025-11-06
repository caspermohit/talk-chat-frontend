import React from 'react';
import logo from '../assets/talk-chat.png';
import '../App.css';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="home-page">
      <div className="home-content">
        <div className="home-left">
          <h1>Welcome to <span>TalkChat</span></h1>
          <p>
            Connect, chat, and share with people around the world — instantly and freely.
          </p>
          <button className="get-started-btn" onClick={()=>{
            navigate('/categories');
          }}>Get Started</button>
        </div>

        <div className="home-right">
          <img src={logo} alt="TalkChat Logo" className="home-logo" />
        </div>
      </div>

      <div className="background-overlay"></div>
    </div>
  );
}