import React, {useEffect, useState} from "react";
import api from "../api";
import { Link } from "react-router-dom";

export default function Categories(){
  const [cats,setCats] = useState([]);

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

  return (
    <div className="container">
      <h2>Categories</h2>
      <div className="categories-container">
        {cats.map(c => (
          <Link key={c.id} to={`/chat/${c.id}`} className="category-item">{c.name}</Link>
        ))}
      </div>
    </div>
  );
}