import React from 'react'
import "../styles/global.css"
import { Phone, MessageCircle } from "lucide-react"
import loadRazorpay from '../utils/razorpay'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

const PGCard = ({ pg, user, setShowLogin }) => {
    const sanitizedNumber = pg.contactNumber.replace(/[^\d]/g, '');
    const isUnlocked = user?.isSubscribed || user?.unlockedPGs?.includes(pg.id);
    const navigate = useNavigate();



  const handleCardClick = () => {
    navigate(`/pg/${pg.id}`);
  }

    const handleUnlock = () => {
        if (!user) {
            toast.success("Please login to unlock PG", {
                position: "top-right",
                autoClose: 2000,
            })
            setTimeout(() => {
                // navigate("/login");
                setShowLogin(true);

            }, 2000);
            return;
        }
        loadRazorpay('single', pg.id, user.id);
    }
    // console.log("Amenities Data:", pg.amenities);
    // console.log("PG Data:", pg);

    return (

        <div className="pg-card" onClick={handleCardClick}>
            
                <div className="updated-box">

                    <img src={`${pg.imageUrl}`} alt="noimage"
                    // onError={(e) => {e.target.src = '/uploads/default.png'}}
                    />

                    <div className="pg-card-content">

                        <h3>{pg.title}</h3>
                        <p>{pg.address},{pg.city}</p>
                        <div className="card-info">
                            <p>{pg.collegeName} ({pg.distanceKm} Km)</p>
                            <p> ₹{pg.rent}/month</p>
                        </div>
                        <div className="amenities">

                            {Object.entries(pg.amenities).map(([key, value]) => {
                                if (!value) return null;

                                const labels = {
                                    wifi: 'WiFi',
                                    laundry: 'Laundry',
                                    food: 'Food',
                                    ac: 'AC',
                                    waterCooler: 'Water Cooler',
                                    studyTable: 'Study Table',
                                };


                                return <span key={key} className="amenity">{labels[key] || key}</span>;
                            })}
                        </div>
                        <div className="contact-box">
                            {isUnlocked ? (
                                <p className="contact">  <Phone color="black" size={16} style={{ marginRight: '6px' }} /> {pg.contactNumber}</p>
                            ) : (
                                <>
                                    <p className="contact blurred"><Phone color="black" size={16} style={{ marginRight: '6px' }} /> +91-XXXXXXX</p>

                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="updated-box2">
                    {/* <button className="unlock-btn" onClick={handleUnlock}>Unlock ₹1</button> */}
                    {isUnlocked ? (
                        <div className="unlock-actions fade-in-split">
                            <button
                               
                                onClick={() => window.open(`https://wa.me/${sanitizedNumber}`, '_blank')}
                                className="half-button whatsapp"
                                type='button'
                            >
                                <MessageCircle size={20} />
                                WhatsApp
                            </button>
                            <button
                                
                                onClick={() => { window.location.href = `tel:${sanitizedNumber}`; }}
                                className="half-button call"
                                type='button'
                            >
                                <Phone size={20} />
                                Call
                            </button>
                        </div>
                    ) : (
                        <button className="unlock-btn fade-in" onClick={handleUnlock}>
                            Unlock ₹1
                        </button>
                    )}

                </div>

            
        </div>


    )
}

export default PGCard