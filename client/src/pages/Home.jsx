import React from 'react'
import "../styles/global.css"
import API from '../utils/api';
import { useState } from 'react';
import { useEffect } from 'react';
import Hero from '../components/Hero';
import PgResults from '../components/PgResults';
import PGFilter from '../components/PGFilter';
import Footer from '../components/Footer';
import AdBanner from '../components/AdBanner';
import Login from './Login';
import { useNavigate } from 'react-router-dom';
const Home = ({ setShowLogin }) => {

  const [user, setUser] = useState(null);
  const [currentSort, setCurrentSort] = useState('');
  const navigate = useNavigate();

  useEffect(() => {

    
    
    const token = localStorage.getItem('token');
    if (token) {

      API.get('/users/me').then(r => setUser(r.data))
        .catch(e => {
          console.error(e);
          localStorage.clear();
        });
    } else {
      setShowLogin(true);

    }
  }, []);

  const handleFilter = ({ sortBy }) => {
    setCurrentSort(sortBy);
  };

  return (
    <>
      <Hero />
      <PGFilter onFilter={handleFilter} />
      <div className="container">
        <PgResults user={user} setShowLogin={setShowLogin} sortBy={currentSort} />
      </div>
      <AdBanner />
      <Footer />
    </>
  )
}

export default Home