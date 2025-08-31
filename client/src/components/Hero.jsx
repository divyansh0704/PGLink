import React, { useState } from 'react'
import "../styles/hero.css"

const Hero = ({onFilter}) => {
  const [searchText,setSearchText] = useState('')

  const handleChange = (e) => {
    
     const value = e.target.value;
    setSearchText(value);
    onFilter(value); 

  }

  return (
    <div className='hero-container'>
      <h1 className="hero-title">Find a PG near your college</h1>
      <div className="hero-search-bar">
        <input type="text" placeholder='Search by College, City, Address, Title...' value={searchText} onChange={handleChange} />
        {/* <button onClick={() => onFilter(searchText)}>Search</button> */}
      </div>
    </div>
  )
}

export default Hero