import React from 'react'
import { useState } from 'react';
import "../styles/filter.css"

const PGFilter = ({ onFilter }) => {

    const [college, setCollege] = useState('');
    const [maxRent, setMaxRent] = useState('');
    const [sortBy, setSortBy] = useState('college');

    const handleApplyFilters = () => {
        onFilter({ college, maxRent, sortBy });
    };
    return (

        <div className="filter-bar">
            <div className="filter-group">
                <label>Filters:</label>
                <input
                    type="text"
                    placeholder="College name"
                    value={college}
                    onChange={e => setCollege(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Max Rent"
                    value={maxRent}
                    onChange={e => setMaxRent(e.target.value)}
                />
            </div>

            <div className="sort-group">
                <label>Sort by:</label>
                <select
                    value={sortBy}
                    onChange={e => {
                        setSortBy(e.target.value);
                        handleApplyFilters();
                    }}
                >
                    <option value="college">College</option>
                    <option value="city">City</option>
                    <option value="rentAsc">Rent: Low to High</option>
                    <option value="rentDesc">Rent: High to Low</option>
                </select>
                <button className="apply-btn" onClick={handleApplyFilters}>
                    Apply
                </button>
            </div>


        </div>
    )
}

export default PGFilter