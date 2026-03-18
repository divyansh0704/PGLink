import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom';
import "../styles/hero.css"

const Hero = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(searchParams.get('q') || '');

  const handleChange = (e) => {
    setSearchText(e.target.value);
  }

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ q: searchText });
  }

  return (
    <div className='hero-container'>
      <h1 className="hero-title">Find a PG Near Your College</h1>
      <form className="hero-search-bar" onSubmit={handleSearch}>
        <input type="text" placeholder='Search by College, City, Address, Title...' value={searchText} onChange={handleChange} />
        <button type="submit">Search</button>
      </form>
    </div>
  )
}

export default Hero