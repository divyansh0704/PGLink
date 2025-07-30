import React from 'react'
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const PGDescription = () => {
     const { id } = useParams();
  const [pg, setPg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     console.log("Fetching PG with id:", id);

    axios.get(`/pgs/${id}`)
      .then(res => {
        setPg(res.data);
        setLoading(false);
        console.log("PG data:", res.data.city);
        console.log("PG city:", res.city);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
    //   console.log("city",pg.city)
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!pg) return <p>PG not found</p>;

  return (
    <div className="pg-details-container">
      <h1>{pg.title}</h1>
      <img src={pg.imageUrl} alt={pg.title} style={{ maxWidth: "500px", borderRadius: "10px" }} />

      <div className="info">
        <p><strong>City:</strong> {pg.city}</p>
        <p><strong>District:</strong> {pg.district}</p>
        <p><strong>State:</strong> {pg.state}</p>
        <p><strong>Pincode:</strong> {pg.pincode}</p>
        <p><strong>College Name:</strong> {pg.collegeName}</p>
        <p><strong>Distance (KM):</strong> {pg.distanceKm} km</p>
        <p><strong>Rent:</strong> ₹{pg.rent}</p>
        <p><strong>Contact Number:</strong> {pg.contactNumber}</p>
        <p><strong>Address:</strong> {pg.address}</p>
        <p><strong>Amenities:</strong></p>
        <ul>
          {pg.amenities?.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
        <hr />
        <p><strong>Listed by:</strong> {pg.User?.name} ({pg.User?.email})</p>
      </div>
    </div>
  
  )
}

export default PGDescription