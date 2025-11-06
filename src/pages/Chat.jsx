import React, {useEffect, useState, useRef} from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import Categories from "./Categories";
import { Link } from "react-router-dom";

export default function Chat(){
  const [cats, setCats] = useState([]);
  const { categoryId } = useParams();
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const boxRef = useRef();

  const fetchMessages = async () => {
    try{
      const res = await api.get(`/messages/${categoryId}`);
      setMessages(res.data.messages);
    }catch(err){ console.error(err); }
  };

  const dataCategory = async () => {
    try{
      const res = await api.get(`/categories/${categoryId}`);
      setCategoryName(res.data.category.name);
    }catch(err){ 
      console.error(err);
      if (err.response?.status === 404) {
        setCategoryName('Category not found');
      }
    }
  };
  useEffect(()=>{
    const fetch = async () => {
      try{
        const res = await api.get('/categories');
        setCats(res.data.categories);
      }catch(err){
        console.error(err);
      }
    };
    fetch();
  },[]);
  useEffect(()=>{
    dataCategory();
  },[categoryId,]);

  useEffect(()=>{
    fetchMessages();
    // you can poll or implement websockets later
    // eslint-disable-next-line
  },[categoryId]);

  useEffect(() => {
    // auto-scroll to bottom
    if(boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [messages]);

  const send = async (e) => {
    e.preventDefault();
    if(!content.trim()) return;
    try{
      const user = JSON.parse(localStorage.getItem('user'));
      await api.post('/messages', { 
        category_id: categoryId, 
        content,
        user_id: user.id 
      });
      setContent('');
      await fetchMessages();
    }catch(err){ 
      console.error(err);
      if (err.response?.data?.errors) {
        // Display validation errors
        const errors = err.response.data.errors;
        const errorMessages = Object.values(errors).flat().join(', ');
        alert(`Validation Error: ${errorMessages}`);
      } else {
        alert(err?.response?.data?.message || 'Failed to send message');
      }
    }
  };

  
  return (
    <div className="chat-container">
    <div className="container-left">
    <h2>Select a Category</h2>
  
    <div className="categories-list">
        {cats.map(c => (
          <Link key={c.id} to={`/chat/${c.id}`} className="category-list">{c.name}</Link>
        ))}
      </div>
    </div>
    <div className="container-right">
      <h2>Chat Room - {categoryName}</h2>
      <div className="chat-box" ref={boxRef}>
        {messages.map((m, i) => {
          const user = JSON.parse(localStorage.getItem('user'));
          const currentDate = new Date(m.created_at).toDateString();
          // get the previous date check if it is the same as the current date or
          const prevDate = i > 0 ? new Date(messages[i-1].created_at).toDateString() : null;
          
          return (
            <div key={m.id}>
              {currentDate !== prevDate && <div style={{textAlign:'center',margin:'10px 0',color:'#666'}}>{currentDate}</div>}
              <div className={`message ${m.user_id === user.id ? 'own-message' : 'other-message'}`}>
                <strong>{m.user?.name || 'User'}:</strong> {m.content}
                <div style={{fontSize:12,color:'#666'}}>{new Date(m.created_at).toLocaleTimeString()}</div>
              </div>
            </div>
          );
        })}
      </div>

      <form className="chat-form" onSubmit={send}>
        <input
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
    </div>
  );
}
