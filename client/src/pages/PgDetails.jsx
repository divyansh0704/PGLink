import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/PropertyDetails.css';
import { ChevronLeft,Fan,Flame,Dumbbell, ChevronRight, Phone, MessageCircle, Wifi, Shirt, Utensils, AirVent, Snowflake, BookOpen } from "lucide-react";
import API from '../utils/api';
import defaultImage from '../assets/default.png';
import { capitalize } from '../utils/capitalize'
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';

export default function PropertyDetails() {
    const { id } = useParams();
    const [pg, setPg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [err, setErr] = useState(null);


    useEffect(() => {
        const fetchPG = async () => {
            setLoading(true);
            try {
                const res = await API.get(`/pgs/${id}`);
                // console.log(res.data); // Log the fetched data, not the old state
                // if (!mounted) return;
                setPg(res.data);
                setCurrentImageIndex(0); // Reset slider when new PG loads
                setErr(null);
            } catch (error) {
                setErr(error.response?.data?.message || error.message || "Failed to load");
            } finally {
                setLoading(false);
            }
        };
        fetchPG();
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

    // Ensure pg is not null before accessing its properties for image processing
    // This block runs only after loading is false and no error occurred.
    const parsedImageUrls = typeof pg.imageUrls === 'string'
        ? JSON.parse(pg.imageUrls)
        : (pg.imageUrls || []);

    const images = [...parsedImageUrls];
    if (pg.imageUrl && !images.includes(pg.imageUrl)) { // Include old singular imageUrl if it exists and isn't already in the array
        images.unshift(pg.imageUrl);
    }

    // Extract latitude and longitude from Sequelize GEOMETRY point [lng, lat]
    const pgLat = pg.location?.coordinates?.[1];
    const pgLng = pg.location?.coordinates?.[0];
    const sanitizedNumber = (pg.contactNumber || '').replace(/[^\d]/g, '');

    // Corrected: finalImages should always be an array for consistent indexing
    const finalImages = images.length > 0 ? images : [defaultImage];


    const nextImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % finalImages.length);
    };

    const prevImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + finalImages.length) % finalImages.length);
    };

    return (
        <div className="app-container">

            <div className="content-wrapper">

                {/* Title and Action Row */}
                <div className="title-row">
                    <div className="title-left">
                        <h1>{capitalize(pg.title)}</h1>
                        <p className="location-text">
                            {/* <span className="geo-icon">📍</span> */}
                            <span className="desktop-loc">{pg.city}, {pg.district}, {pg.state}</span>
                            <span className="mobile-loc">{pg.city}, {pg.district}, {pg.state}</span>
                        </p>
                    </div>
                    {/* <div className="title-right">
                        <div className="desktop-actions">
                            <button className="action-btn">🔗 Share</button>
                            <button className="action-btn">♥ Save</button>
                        </div>
                        <div className="mobile-rating">
                            <span className="star-icon">★</span> 4.8
                        </div>
                    </div> */}
                </div>


                <div className="gallery-grid">

                    <img className="pg-detail-image" src={finalImages[currentImageIndex]} alt={pg.title} />

                </div>
                {finalImages.length > 1 && ( // Only show buttons if there's more than one image
                    <div className="image-controls">
                        <button className='button-left' onClick={prevImage}><ChevronLeft size={24} /></button>
                        <button className='button-right' onClick={nextImage}><ChevronRight size={24} /></button>
                        <div className="image-counter">{currentImageIndex + 1} / {finalImages.length}</div>
                    </div>
                )}

                {/* Mobile Pricing Bar Placement */}
                <div className="mobile-price-tag">
                    <span className="price-label">STARTS FROM</span>
                    <span className="price-amount">{pg.rent} <small>/month</small></span>
                </div>

                <hr className="section-divider mobile-only" />

                {/* ================= TWO COLUMN LAYOUT ================= */}
                <div className="two-column-layout">

                    {/* Left Main Column */}
                    <div className="main-details-col">

                        {/* About Section */}
                        <section className="details-section">
                            <h2 className="desktop-only">Curated Comfort for Modern Professionals</h2>
                            <h3 className="mobile-only">About this space</h3>
                            <p className="description-p">
                                <span className="desktop-loc">
                                    {pg.description}

                                </span>
                                <span className="mobile-loc">
                                    {pg.description}

                                </span>
                            </p>
                        </section>

                        <hr className="section-divider" />

                        {/* Amenities Section */}
                        <section className="details-section">
                            <h3 className="section-title">Premium Amenities</h3>

                            <div className="amenities-container-grid">
                                {Object.entries(typeof pg.amenities === 'string' ? JSON.parse(pg.amenities) : (pg.amenities || {})).map(([k, v]) => {
                                    if (!v) return null;
                                    const labels = {
                                        wifi: 'WiFi',
                                        laundry: 'Laundry',
                                        food: 'Food',
                                        ac: 'AC',
                                        waterCooler: 'Water Cooler',
                                        studyTable: 'Study Table',
                                        airCooler: 'Air Cooler',
                                        waterHeater: 'Water Heater',
                                        gym: 'Gym',
                                        
                                    };
                                    const icons = {
                                        wifi: <Wifi size={18} />,
                                        laundry: <Shirt size={18} />,
                                        food: <Utensils size={18} />,
                                        ac: <AirVent size={18} />,
                                        waterCooler: <Snowflake size={18} />,
                                        studyTable: <BookOpen size={18} />,
                                        airCooler: <Fan size={18} />,
                                        waterHeater: <Flame size={18} />,
                                        gym: <Dumbbell size={18} />,

                                    };
                                    return <div className="amenity-card" key={k} ><span className="amenity-icon">{icons[k]}</span>{labels[k] || k}</div>;
                                })}
                            </div>
                        </section>

                        <hr className="section-divider" />

                        {/* Rules / Ethics Section */}
                        {/* <section className="details-section">
                            <h3 className="section-title">House Rules & Ethics</h3>
                            <div className="ethics-list">
                                <div className="ethics-item">
                                    <span className="check-icon">✓</span>
                                    <div>
                                        <strong>Professional Decorum / Gate Closing:</strong>
                                        <p>We maintain a quiet environment between 10 PM and 7 AM. Main entrance closes strictly at 11:00 PM.</p>
                                    </div>
                                </div>
                                <div className="ethics-item">
                                    <span className="check-icon">✓</span>
                                    <div>
                                        <strong>Guest Policy:</strong>
                                        <p>Daytime guests are welcome in common areas until 8:00 PM; overnight stays require prior notice.</p>
                                    </div>
                                </div>
                                <div className="ethics-item">
                                    <span className="check-icon">✓</span>
                                    <div>
                                        <strong>No Smoking & Sustainability:</strong>
                                        <p>Smoking is strictly prohibited inside the premises. We encourage mindful power saving.</p>
                                    </div>
                                </div>
                            </div>
                        </section> */}

                        <hr className="section-divider" />

                        {/* Location Section */}
                        <section className="details-section">
                            <h3 className="section-title">The Neighborhood</h3>
                            <div className="map-view-box">
                                {pgLat && pgLng ? (
                                    <MapContainer
                                        center={[pgLat, pgLng]}
                                        zoom={15}
                                        scrollWheelZoom={false}
                                        style={{ height: '100%', width: '100%', zIndex: 0 }}
                                    >
                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                        {/* <Marker position={[pgLat, pgLng]} /> */}
                                        <Marker
                                            position={[pgLat, pgLng]}
                                            icon={
                                                L.divIcon({
                                                    className: "custom-pg-marker",
                                                    html: `
        <div style="
          transform: translate(-50%, -100%);
          display:flex;
          align-items:center;
          justify-content:center;
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 21s-6-4.35-6-10a6 6 0 0 1 12 0c0 5.65-6 10-6 10z"></path>
            <circle cx="12" cy="11" r="2.5"></circle>
          </svg>
        </div>
      `,
                                                    iconSize: [88, 88],
                                                    iconAnchor: [14, 28],
                                                })
                                            }
                                        />

                                    </MapContainer>
                                ) : (
                                    <div className="no-map"><span className="map-pin">📍</span> Map View Not Available</div>
                                )}
                            </div>
                            {pgLat && pgLng && (
                                <p className="map-link-desktop desktop-only" onClick={() => window.open(`https://www.google.com/maps?q=${pgLat},${pgLng}`, '_blank')}>
                                    📍 Open in Google Maps
                                </p>
                            )}

                            <div className="neighborhood-specs desktop-only">
                                {/* <div>🚇 Metro Station <span>• 5 mins walk</span></div>
                                <div>🛒 Supermarket <span>• 2 mins walk</span></div> */}
                                <div className="address-box ">
                                    <strong>Address</strong>
                                    <p>{pg.address}</p>
                                </div>
                                <div className="address-box ">
                                    <strong>Pincode</strong>
                                    <p>{pg.pincode}</p>
                                </div>
                            </div>

                            <div className="address-box mobile-only">
                                <strong>Address</strong>
                                <p>{pg.address}</p>
                            </div>
                            <div className="address-box mobile-only">
                                <strong>Pincode</strong>
                                <p>{pg.pincode}</p>
                            </div>
                            <footer className="mobile-actions-footer">
                                <button className="mobile-btn-secondary" onClick={() => window.open(`https://wa.me/${sanitizedNumber}`, '_blank')}><span><MessageCircle size={24} /></span>Whatsapp</button>
                                <button className="mobile-btn-primary" onClick={() => { window.location.href = `tel:${sanitizedNumber}`; }}><span><Phone size={24} /></span>Call</button>
                            </footer>
                        </section>
                    </div>

                    {/* Right Sidebar Column (Desktop Booking Widget) */}
                    <div className="sidebar-booking-col">
                        <div className="booking-card">
                            <div className="booking-price">
                                <h3>₹{pg.rent} <small>/ month</small></h3>
                            </div>

                            {/* <div className="form-group">
                                <label>OCCUPANCY TYPE</label>
                                <select defaultValue="single">
                                    <option value="single">Single Occupancy - Luxury</option>
                                    <option value="twin">Twin Sharing - Executive</option>
                                    <option value="triple">Triple Sharing - Standard</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>MOVE-IN DATE</label>
                                <input type="date" defaultValue="2024-11-01" />
                            </div> */}

                            <button className="reserve-btn" onClick={() => { window.location.href = `tel:${sanitizedNumber}`; }}>Call</button>
                            <button className="visit-btn" onClick={() => window.open(`https://wa.me/${sanitizedNumber}`, '_blank')}>Whatsapp</button>

                            {/* <p className="brokerage-note">* No brokerage. Secure payment via LuxeLiving.</p> */}

                            {/* <div className="verified-badge">
                                <span className="badge-icon">🛡️</span>
                                <div>
                                    <strong>LuxeLiving Verified</strong>
                                    <p>Professional management & transparent billing guaranteed.</p>
                                </div>
                            </div> */}
                        </div>
                    </div>

                </div>
            </div>

            {/* ================= STICKY MOBILE ACTION FOOTER ================= */}
            {/* <footer className="mobile-actions-footer">
                <button className="mobile-btn-secondary">Schedule Visit</button>
                <button className="mobile-btn-primary">Book Now</button>
            </footer> */}



        </div>
    );
}