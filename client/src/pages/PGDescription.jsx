// src/pages/PGDescription.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../utils/api";
import "../styles/pgDescription.css";

const PGDescription = () => {
  const { id } = useParams();
  const [pg, setPg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchPG = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/pgs/${id}`);
        if (!mounted) return;
        setPg(res.data);
        setErr(null);
      } catch (error) {
        setErr(error.response?.data?.message || error.message || "Failed to load");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchPG();
    return () => { mounted = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="pg-desc container">
        <div className="pg-skeleton">
          <div className="skeleton-image" />
          <div className="skeleton-lines">
            <div className="skeleton-line short" />
            <div className="skeleton-line long" />
            <div className="skeleton-line medium" />
            <div className="skeleton-line medium" />
          </div>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="pg-desc container">
        <p style={{ textAlign: "center", color: "var(--small-text)" }}>{err}</p>
        <div style={{ textAlign: "center", marginTop: 12 }}>
          <Link to="/">← Back to home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pg-descD containerD">
      <div className="pg-detailD">
        <img className="pg-detail-image" src={pg.imageUrl} alt={pg.title} onError={(e)=>{e.target.src='/uploads/default.png'}} />
        <div className="pg-detail-info">
          <h1>{pg.title}</h1>
           <div className="card-infoD">
            <p> {pg.distanceKm}Km from {pg.collegeName}</p>
            <p><span>Rent: </span>₹{pg.rent}/month</p>
          </div>
          <p className="muted"><span>State: </span>{pg.state}</p>
          <p className="muted"><span>District: </span>{pg.district}</p>
          <p className="muted"><span>City: </span>{pg.city}</p>
          <p className="muted"><span>Pincode: </span>{pg.pincode}</p>
          <p className="muted"><span>Address: </span>{pg.address}</p>
         
          <h3>Amenities</h3>
          <div className="amenitiesD">
            {Object.entries(pg.amenities || {}).map(([k, v]) => v ? <span key={k} className="amenityDS">{k}</span> : null)}
          </div>
          <div style={{ marginTop: 16 }}>
            <Link to="/">← Back</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PGDescription;
