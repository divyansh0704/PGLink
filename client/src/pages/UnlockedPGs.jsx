import React from 'react'
import API from '../utils/api';
import { useState, useEffect } from 'react';
import PGCard from '../components/PGCard';

const UnlockedPGs = () => {
    const [pgs, setPgs] = useState([]);
    const [user,setUser] = useState(null);

    useEffect(() => {
        const fetchUnlockedPGs = async () => {
            try {
                const res = await API.get('/pgs/unlocked');
                setPgs(res.data);

                API.get('/users/me') // this hits the protected route
                    .then(res => setUser(res.data))
                    .catch(err => console.error("User fetch error", err));


            } catch (err) {
                console.error("Failed to load unlocked PGs", err);
            }
        };

        fetchUnlockedPGs();
    }, []);
    return (
        // <div>UnlockedPGs</div>
        <div className="container">
            <div className="pg-grid">
                {pgs.length > 0 ? (
                    pgs.map(pg => (
                        <PGCard key={pg.id} pg={pg} user={user}  />
                    ))
                ) : (
                    <p style={{ textAlign: 'center' }}>You don't have unlocked PGs.</p>
                )}
            </div>

        </div>
    )
}

export default UnlockedPGs