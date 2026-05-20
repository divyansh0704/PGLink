import React from 'react'
import API from '../utils/api';
import { useState, useEffect } from 'react';
import PGCard from '../components/PGCard';
import ShimmerCard from '../components/ShimmerCard';

const UnlockedPGs = () => {
    const [pgs, setPgs] = useState([]);
    const [user,setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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
            }finally{
                setLoading(false);
            }
        };

        fetchUnlockedPGs();
    }, []);
    return (
        // <div>UnlockedPGs</div>
        <div className="container">
            <h2 id='UH'>Unlocked PGs</h2>
            <div className="pg-grid">
                {loading ?(
                    <>
                     <ShimmerCard/>
                     <ShimmerCard/>
                     <ShimmerCard/>
                    </>
                ): pgs.length > 0 ? (
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