import React from 'react'
import "../styles/global.css"
import API from '../utils/api';
import PGCard from '../components/PGCard';
import bed from '../assets/bed.png';
import { useState } from 'react';
import { useEffect } from 'react';
import Hero from '../components/Hero';
import PGFilter from '../components/PGFilter';
import Footer from '../components/Footer';

const Home = ({ setShowLogin }) => {

  const [pgList, setPgList] = useState([]);
  const [user, setUser] = useState(null);
  const [filteredPgs, setFilteredPgs] = useState([]);
  const [allLoaded, setAllLoaded] = useState(false);


 
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {

      API.get('/pgs/limited')
        .then(res => {
          // console.log("First PG city:", res.data[0]?.city);
          setPgList(res.data);
          setFilteredPgs(res.data);
          setAllLoaded(false);
        })
        .catch(err => console.error("PG fetch error", err));

      API.get('/users/me')
        .then(res => setUser(res.data))
        .catch(err => console.error("User fetch error", err));


      API.get('/pgs/all')
        .then(res => {
          setPgList(res.data);
          //  setAllLoaded(true); 
        })
        .catch(err => console.error("All PGs fetch error", err));

    }else{
      fetchPGs();
    }


  }, []);
  const fetchPGs = () => {

    API.get('/pgs/')
      .then(res => {
        setPgList(res.data);
        setFilteredPgs(res.data);
        setAllLoaded(false);
      })
      .catch(err => console.error("PG fetch error", err));

  }
  const fetchAllPGs = () => {
    API.get('/pgs/all')
      .then(res => {
        setPgList(res.data);
        setFilteredPgs(res.data);
        setAllLoaded(true);
      })
      .catch(err => console.error("Fetch all PGs error", err));
  };

  



  const handleSearch = (searchText) => {
    const lowerCaseSearch = searchText.toLowerCase();
    const filtered = pgList.filter(pg =>
      pg.title?.toLowerCase().includes(lowerCaseSearch) ||
      pg.address?.toLowerCase().includes(lowerCaseSearch) ||
      pg.city?.toLowerCase().includes(lowerCaseSearch) ||
      pg.collegeName?.toLowerCase().includes(lowerCaseSearch)

    )

    setFilteredPgs(filtered);
  }

  const handleFilter = ({ college, maxRent, sortBy }) => {

    let results = [...pgList];
    // let results = filteredPgs.length ? [...filteredPgs] : [...pgList];


    if (college) {
      results = results.filter(pg =>
        pg.collegeName.toLowerCase().includes(college.toLowerCase())
      );
    }

    if (maxRent) {
      results = results.filter(pg => pg.rent <= Number(maxRent));
    }


    if (sortBy === 'college') {

      results.sort((a, b) => {
        const clgA = (a.collegeName || '').toLowerCase();
        const clgB = (b.collegeName || '').toLowerCase();
        return clgA.localeCompare(clgB)
      });
    } else if (sortBy === 'city') {
      results.sort((a, b) => {
        const cityA = (a.city || '').toLowerCase();
        const cityB = (b.city || '').toLowerCase();
        return cityA.localeCompare(cityB);
      });

    } else if (sortBy === 'rentAsc') {
      results.sort((a, b) => a.rent - b.rent);
    } else if (sortBy === 'rentDesc') {
      results.sort((a, b) => b.rent - a.rent);
    }

    setFilteredPgs(results);
  };

  return (
    <>

      <Hero onFilter={handleSearch} />
      <PGFilter onFilter={handleFilter} />
      <div className="container">
        <div className="pg-grid">
          {/* {filteredPgs.length > 0 ? (
            filteredPgs.map(pg => (
              <PGCard key={pg.id} pg={pg} user={user} setShowLogin={setShowLogin} />
            ))
          ) : (
            <p style={{ textAlign: 'center' }}>No PGs found.</p>
          )} */}
          {filteredPgs.map(pg => (
            <PGCard key={pg.id} pg={pg} user={user} setShowLogin={setShowLogin} />
          ))}

        </div>
        <div style={{ textAlign: 'center', marginTop: '20px' }} className='show-rect'>
          {!allLoaded && (
            <button onClick={fetchAllPGs} className="btn-show-all">
              Show all PGs
            </button>)}

        </div>

      </div>
      <Footer />

    </>
  )
}

export default Home