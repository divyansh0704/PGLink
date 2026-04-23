import React, { useState, useEffect } from 'react';
import '../styles/admin.css';
import { MapPin } from 'lucide-react';
import API from '../utils/api';
import { toast } from 'react-toastify';

const Admin = () => {
    const [form, setForm] = useState({
        name: '',
        city: '',
        district: '',
        state: '',
        longitude: '',
        latitude: ''
    })
    const [colleges,setColleges] = useState([]);
    const handleChange = (e) => {
        // console.log(e);
        const { name, value } = e.target;
        setForm({ ...form, [name]: value })
    }
    const handleLocation = () => {
        // console.log(form);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setForm(prev => ({ ...prev, latitude: position.coords.latitude, longitude: position.coords.longitude }));
            },
            (error) => {
                console.log("Error:", error.message);
            }
        );
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post("/college/create", form);
            toast.success("College posted successfully!", {
                position: "top-right",
                autoClose: 2000,
            });
            setForm({
                name: '',
                city: '',
                district: '',
                state: '',
                longitude: '',
                latitude: ''
            })
            fetchListings();


        } catch (err) {
            console.error(err);
            toast.error("Error posting college");

        }

    }
    const handleDeleteCollege = async(id)=>{
        try{
            const res = await API.delete(`/college/${id}`);
            toast.success("College deleted successfully!", {
                position: "top-right",
                autoClose: 2000,
            });
            fetchListings();

        }catch(err){
            
            toast.error("Error deleting college");
        }
    }
    const fetchListings = async()=>{
            try{
                const res = await API.get("/college");
                // console.log(res.data);
                setColleges(res.data);
    
            }catch(err){
                console.error('Error fetching listings:', err);
            }
        }
    useEffect(() => {
        
        fetchListings();

    }, [])
    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
                <p>Manage college listings and track new submissions.</p>
            </div>

            <div className="admin-layout">
                {/* Post College Section */}
                <section className="admin-card post-section">
                    <h2 className="section-title">Post New College</h2>
                    <form className="admin-form" onSubmit={handleSubmit}>
                        <div className="location-helper">
                            <button type="button" onClick={handleLocation} className="location-btn">
                                <MapPin size={18} /> Fetch Location
                            </button>
                            {form.latitude && form.longitude && (
                                <span className="location-status">
                                    {/* {Number(form.latitude).toFixed(4)}, {Number(form.longitude).toFixed(4)} */}
                                    Location Fetched!
                                </span>
                            )}
                        </div>

                        <div className="form-grid">
                            <div className="input-group">
                                <label>College Name</label>
                                <input name="name" value={form.name} onChange={handleChange} type="text" placeholder="e.g. IIT Delhi" />
                            </div>
                            <div className="input-group">
                                <label>City</label>
                                <input name="city" value={form.city} onChange={handleChange} type="text" placeholder="e.g. New Delhi" />
                            </div>
                            <div className="input-group">
                                <label>District</label>
                                <input name="district" value={form.district} onChange={handleChange} type="text" placeholder="e.g. South Delhi" />
                            </div>
                            <div className="input-group">
                                <label>State</label>
                                <input name="state" value={form.state} onChange={handleChange} type="text" placeholder="e.g. Delhi" />
                            </div>
                            {/* <div className="input-group full-width">
                <label>Description</label>
                <textarea placeholder="Write a brief overview of the college..."></textarea>
              </div> */}
                        </div>
                        <button type="submit" className="admin-submit-btn">Post College</button>
                    </form>
                </section>

                {/* Show Colleges Section */}
                <section className="admin-listings">
                    <h2 className="section-title">College Listings</h2>
                    <div className="admin-college-grid">
                        {/* Dummy Colleges for UI demonstration */}
                        {colleges.map((item) => (
                            
                            <div key={item.id} className="college-item-card">
                                <div className="college-details">
                                    <h3>{item.name}</h3>
                                    <p className="college-loc">{item.city}, {item.district}, {item.state}</p>
                                    {/* <p className="college-desc-short">
                                        A leading institute known for its excellence in engineering and research facilities.
                                    </p> */}
                                    <div className="admin-actions">
                                        <button className="action-btn edit">Edit</button>
                                        <button className="action-btn delete" onClick={()=>{handleDeleteCollege(item.id)}}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Admin;