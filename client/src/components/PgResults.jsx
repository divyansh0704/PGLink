import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../utils/api';
import PGCard from './PGCard';

const PgResults = () => {
    const [pgs, setPgs] = useState([]);
    const [disambiguation, setDisambiguation] = useState({
        needed: false,
        colleges: []
    });
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const fetchResults = async () => {
            const query = searchParams.get('q');
            if (!query) return;

            // Reset states on new search
            setPgs([]);
            setDisambiguation({ needed: false, colleges: [] });

            const response = await API.get(`/pgs?q=${query}`);

            // Check if the backend is asking for clarification
            if (response.data.disambiguation) {
                setDisambiguation({ needed: true, colleges: response.data.colleges });
            } else {
                setPgs(response.data.pgs || []);
            }
        };

        fetchResults();
    }, [searchParams]);

    // Function to handle user's choice
    const handleDisambiguationSelect = (collegeName) => {
        setSearchParams({ q: collegeName });
    };

    // Render the "Did you mean?" UI
    if (disambiguation.needed) {
        return (
            <div className="disambiguation-box">
                <h3>Did you mean?</h3>
                <ul>
                    {disambiguation.colleges.map(college => (
                        <li key={college.id}>
                            <button onClick={() => handleDisambiguationSelect(college.name)}>
                                {college.name} ({college.city}, {college.state})
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    // Render the PG results
    return (
        <div className="pg-grid">
            {pgs.map(pg => (
                <PGCard key={pg.id} pg={pg} /* other props */ />
            ))}
            {pgs.length === 0 && <p>No results found.</p>}
        </div>
    );
};

export default PgResults;
