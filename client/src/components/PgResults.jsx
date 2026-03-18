import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../utils/api';
import PGCard from './PGCard';
import ShimmerCard from './ShimmerCard';
import '../styles/PgResults.css';

const PgResults = ({ user, setShowLogin, sortBy }) => {
    const [pgs, setPgs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 9;
    const [disambiguation, setDisambiguation] = useState({
        needed: false,
        colleges: []
    });
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        
        setPage(1);
        setPgs([]);
        fetchResults(1, true);
    }, [searchParams, sortBy]);

    useEffect(() => {
        
        if (page > 1) {
            fetchResults(page, false);
        }
    }, [page]);

    const fetchResults = async (pageToLoad, isReset) => {
        const query = searchParams.get('q');
        const collegeId = searchParams.get('collegeId');
        
        setLoading(true);
        try {
            const response = await API.get(`/pgs/`, { 
                params: { 
                    q: query, 
                    collegeId, 
                    page: pageToLoad, 
                    limit,
                    sortBy 
                } 
            });

            
            if (response.data.disambiguation) {
                setDisambiguation({ needed: true, colleges: response.data.colleges });
                setPgs([]); 
            } else {
                setDisambiguation({ needed: false, colleges: [] });
                const { pgs: newPgs, totalPages: tp } = response.data;
                setTotalPages(tp);
                setPgs(prev => isReset ? newPgs : [...prev, ...newPgs]);
            }
        } catch (error) {
            console.error("Error fetching PGs:", error);
        } finally {
            setLoading(false);
        }
    };

    
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >=
                document.body.offsetHeight - 200
            ) {
                if (!loading && page < totalPages && !disambiguation.needed) {
                    setPage(prev => prev + 1);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading, page, totalPages, disambiguation.needed]);

    
    const handleDisambiguationSelect = (college) => {
        setSearchParams({ collegeId: college.id });
    };

    if (loading && pgs.length === 0) {
        return (
            <div className="pg-grid">
                {[...Array(6)].map((_, i) => <ShimmerCard key={i} />)}
            </div>
        );
    }

   
    if (disambiguation.needed) {
        return (
            <div className="disambiguation-box">
                <h3>Did you mean?</h3>
                <ul>
                    {disambiguation.colleges.map(college => (
                        <li key={college.id}>
                            <button onClick={() => handleDisambiguationSelect(college)}>
                                {college.name} ({college.city}, {college.state})
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    
    return (
        <div className="pg-grid">
            {pgs.length > 0 ? (
                pgs.map(pg => (
                    <PGCard key={pg.id} pg={pg} user={user} setShowLogin={setShowLogin} />
                ))
            ) : (
                !loading && (
                    <div className="no-results-container">
                        <div className="no-results-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </div>
                        <h3>No Results Found</h3>
                        <p>We couldn't find any PGs matching your search criteria. Try adjusting your filters or search term.</p>
                    </div>
                )
            )}
            {loading && pgs.length > 0 && (
                [...Array(3)].map((_, i) => <ShimmerCard key={`loading-${i}`} />)
            )}
        </div>
    );
};

export default PgResults;
