import React from 'react'
import { useState } from 'react';
import "../styles/filter.css"

const PGFilter = ({ onFilter }) => {

   
    const [sortBy, setSortBy] = useState('college');

    const handleApplyFilters = () => {
        onFilter({sortBy });
    };
    return (

        <div className="filter-bar">
            

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