import React from 'react'
import "../styles/global.css"
import ShimmerCard from '../components/ShimmerCard';
import API from '../utils/api';
import PGCard from '../components/PGCard';
import bed from '../assets/bed.png';
import { useState } from 'react';
import { useEffect } from 'react';
import Hero from '../components/Hero';
import PGFilter from '../components/PGFilter';
import Footer from '../components/Footer';
import SubscriptionBanner from '../components/SubscriptionBanner';
import AdBanner from '../components/AdBanner';

const Home = ({ setShowLogin, isSidebarOpen }) => {

  const [pgList, setPgList] = useState([]);
  const [user, setUser] = useState(null);
  const [filteredPgs, setFilteredPgs] = useState([]);
  // const [allLoaded, setAllLoaded] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [currentSearch, setCurrentSearch] = useState('');
  const [currentSort, setCurrentSort] = useState('');


  const tok = localStorage.getItem('token');
  const fetchPGs = (pageToLoad = 1, search = '', sortBy = '') => {
    setLoading(true);
    API.get(`/pgs/`, { params: { page: pageToLoad, limit, q: search, sortBy } })
      .then(res => {
        const { pgs, totalPages: tp } = res.data;

        setPgList(prev => pageToLoad === 1 ? pgs : [...prev, ...pgs]);
        setFilteredPgs(prev => pageToLoad === 1 ? pgs : [...prev, ...pgs]);
        setTotalPages(tp);
        setPage(pageToLoad);
      })
      .catch(err => console.error("All PGs fetch error", err))
      .finally(() => setLoading(false));
  }
  useEffect(() => {
    fetchPGs(1);


    const token = localStorage.getItem('token');
    if (token) {
      API.get('/users/me').then(r => setUser(r.data))
        .catch(e => console.error(e));
    }


  }, []);

  useEffect(() => {
    if (page > 1) {
      fetchPGs(page, currentSearch, currentSort);
    }
  }, [page, currentSearch, currentSort])

  useEffect(() => {
    const handleScroll = () => {

      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 200
      ) {

        if (!loading && page < totalPages) {
          setPage(prev => prev + 1);
        }
      }
    };


    window.addEventListener('scroll', handleScroll);


    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, page, totalPages]);






  const handleSearch = (searchText) => {

    setCurrentSearch(searchText);
    setPage(1);
    fetchPGs(1, searchText, currentSort);
  }

  const handleFilter = ({ sortBy }) => {

    setCurrentSort(sortBy);
    setPage(1);
    fetchPGs(1, currentSearch, sortBy);
  };

  return (
    <>

      <Hero onFilter={handleSearch} />

      <PGFilter onFilter={handleFilter} />
      <div className="container">
        <div className="pg-grid">


          {loading && filteredPgs.length === 0
            ? [...Array(6)].map((_, i) => <ShimmerCard key={i} />)
            : filteredPgs.map(pg => (
              <PGCard key={pg.id} pg={pg} user={user} setShowLogin={setShowLogin} />
            ))}

          {loading && filteredPgs.length > 0 && (
            [...Array(3)].map((_, i) => <ShimmerCard key={`loading-${i}`} />)
          )}

        </div>


      </div>
      <AdBanner />

      <Footer />

    </>
  )
}

export default Home