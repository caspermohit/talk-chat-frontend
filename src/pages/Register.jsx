import React, {useState} from "react";
import api, { setAuthToken } from "../api";
import { useNavigate } from "react-router-dom";

export default function Register(){
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    
    try{
      const res = await api.post('/register',{name,email,password});
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setAuthToken(token);
      
      // Dispatch custom event to notify App component of token change
      window.dispatchEvent(new Event('tokenUpdated'));
      
      navigate('/');
    }catch(err){
      if (err?.response?.status === 422) {
        // Handle validation errors
        setErrors(err.response.data.errors || {});
        alert(err.response.data.message || 'Validation failed');
      } else {
        alert(err?.response?.data?.message || 'Register failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>Register</h2>
      <div>
        <input 
          value={name} 
          onChange={e=>setName(e.target.value)} 
          placeholder="Name" 
          autoComplete="name" 
          required
          className={errors.name ? 'error' : ''}
        />
        {errors.name && <span className="error-message">{errors.name[0]}</span>}
      </div>
      <div>
        <input 
          value={email} 
          onChange={e=>setEmail(e.target.value)} 
          type="email" 
          placeholder="Email" 
          autoComplete="email" 
          required
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <span className="error-message">{errors.email[0]}</span>}
      </div>
      <div>
        <input 
          value={password} 
          onChange={e=>setPassword(e.target.value)} 
          type="password" 
          placeholder="Password" 
          autoComplete="new-password" 
          required
          className={errors.password ? 'error' : ''}
        />
        {errors.password && <span className="error-message">{errors.password[0]}</span>}
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}