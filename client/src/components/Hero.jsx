// import React, { useState } from 'react'
// import { useSearchParams } from 'react-router-dom';
// import API from '../utils/api';
// import "../styles/hero.css"

// const Hero = () => {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const [searchText, setSearchText] = useState(searchParams.get('q') || '');

//   const [suggestions, setSuggestions] = useState([]);
// const [showSuggestions, setShowSuggestions] = useState(false);
// const [loadingSuggestions, setLoadingSuggestions] = useState(false);

//   const handleChange = (e) => {
//     setSearchText(e.target.value);
//   }

//   const handleSearch = (e) => {
//     e.preventDefault();
//     setSearchParams({ q: searchText });
//   }
//   const handleSelectSuggestion = (college) => {
//   setSearchParams({ collegeId: college.id, q: searchText });
//   setShowSuggestions(false);
// };


//   useEffect(() => {
//   if (!searchText || searchText.trim().length === 0) {
//     setSuggestions([]);
//     setShowSuggestions(false);
//     return;
//   }

//   const handler = setTimeout(async () => {
//     try {
//       setLoadingSuggestions(true);

//       const resp = await API.get('/pgs', {
//         params: { q: searchText }
//       });

//       // When backend finds matching colleges, it returns:
//       // { disambiguation: true, colleges: [...] }
//       if (resp.data?.disambiguation && Array.isArray(resp.data.colleges)) {
//         setSuggestions(resp.data.colleges);
//         setShowSuggestions(true);
//       } else {
//         // If backend returns normal results or no disambiguation,
//         // hide dropdown (you can change this behavior if you want)
//         setSuggestions([]);
//         setShowSuggestions(false);
//       }
//     } catch (e) {
//       console.error(e);
//       setSuggestions([]);
//       setShowSuggestions(false);
//     } finally {
//       setLoadingSuggestions(false);
//     }
//   }, 400); // debounce 400ms

//   return () => clearTimeout(handler);
// }, [searchText]);


//   return (
//     <div className='hero-container'>
//        <h1 className="hero-title">Find a PG Near Your College</h1> 
//       <form className="hero-search-bar" onSubmit={handleSearch}>
//         <input type="text" placeholder='Search by College or Organization' value={searchText} onChange={handleChange} />
//         <button type="submit">Search</button>
//       </form> 






//     </div>
//   )
// }

// export default Hero

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../utils/api';
import "../styles/hero.css";

const Hero = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(searchParams.get('q') || '');

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ q: searchText });
    setShowSuggestions(false);
  };

  const handleSelectSuggestion = (college) => {
    setSearchParams({ collegeId: college.id, q: searchText });
    setShowSuggestions(false);
  };

  useEffect(() => {
    if (!searchText || searchText.trim().length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const handler = setTimeout(async () => {
      try {
        setLoadingSuggestions(true);

        const resp = await API.get('/pgs', { params: { q: searchText } });

        if (resp.data?.disambiguation && Array.isArray(resp.data.colleges)) {
          setSuggestions(resp.data.colleges);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (e) {
        console.error(e);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 4);

    return () => clearTimeout(handler);
  }, [searchText]);

  return (
    <div className="hero-container">
      <h1 className="hero-title">Find a PG Near Your College</h1>

      <form
        className="hero-search-bar"
        onSubmit={handleSearch}
        style={{ position: 'relative' }}
      >
        <input
          type="text"
          placeholder="Search by college,company,city,state..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button type="submit">Search</button>

        {showSuggestions && (
          <div
            className="hero-suggestions"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: '100%',
              background: 'white',
              border: '1px solid #ddd',
              zIndex: 50,
              maxHeight: 260,
              overflowY: 'auto',
            }}
          >
            {loadingSuggestions ? (
              <div style={{ padding: 12 }}>Loading...</div>
            ) : suggestions.length === 0 ? (
              <div style={{ padding: 12 }}>No suggestions</div>
            ) : (
              suggestions.map((c) => (
                <div key={c.id} onClick={() => handleSelectSuggestion(c)} style={{padding: 12,cursor: 'pointer', borderBottom: '1px solid #f2f2f2',}} >
                  <div style={{ fontWeight: 600 }}>{c.name} </div>
                  <div style={{ fontSize: 13, color: '#555' }}>{c.city}, {c.district}, {c.state}</div>
                  </div>
                  ))
            )}
                </div>
              )} 
              </form>
    </div>
  );
};

export default Hero;
