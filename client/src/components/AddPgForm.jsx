import React from 'react'
import { useState } from 'react'
import "../styles/addPgForm.css"
import API from '../utils/api'
import { toast } from 'react-toastify'
import { MapPin, Upload, PlusCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
// import LocationPicker from './LocationPicker'
const AddPgForm = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: '',
        // collegeName: '',
        district: '',
        pincode: '',
        state: '',
        city: '',
        address: '',
        rent: '',
        contactNumber: '',
        amenities: {
            wifi: false,
            laundry: false,
            food: false,
            ac: false,
            waterCooler: false,
            studyTable: false,
        },
    })
    const [location, setLocation] = useState({ lat: null, lng: null });
    const [photo, setPhoto] = useState(null)
    const [isFetchingLocation, setIsFetchingLocation] = useState(false);
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name in form.amenities) {
            setForm({
                ...form,
                amenities: { ...form.amenities, [name]: checked },
            });
        } else {
            setForm({ ...form, [name]: type === 'number' ? Number(value) : value });
        }

    }
    const handlePhotoChange = e => {
        setPhoto(e.target.files[0]);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
       

        try {
            const token = localStorage.getItem('token');
            if(!token){
                toast.error("Please login to list PG", {
                    position: "top-right",
                    autoClose: 2000,
                });
                setTimeout(() => {
                    // navigate("/login");
                    navigate("/")
                    
                }, 2000);
                return
            }
            const contact = `+91-${form.contactNumber}`

            const formData = new FormData();

            formData.append('title', form.title);
            // formData.append('collegeName', form.collegeName);
            formData.append('district', form.district);
            formData.append('pincode', form.pincode);
            formData.append('state', form.state);
            formData.append('city', form.city);
            formData.append('address', form.address);
            // formData.append('distanceKm', form.distanceKm);
            formData.append('rent', form.rent);
            formData.append('contactNumber', contact);
            if (location.lat && location.lng) {
                formData.append('latitude', location.lat);
                formData.append('longitude', location.lng);

            }



            formData.append('amenities', JSON.stringify(form.amenities));


            if (photo) {
                formData.append('photo', photo);
            }
            await API.post('/pgs', formData);

            toast.success("PG listed successfully!'", {
                position: "top-right",
                autoClose: 2000,
            });
            setTimeout(() => {
                window.location.href = "/"
            }, 2000);

            setForm({
                title: '',
                district: '',
                pincode: '',
                state: '',
                city: '',
                address: '',
                rent: '',
                contactNumber: '',
                amenities: {
                    wifi: false,
                    laundry: false,
                    food: false,
                    ac: false,
                    waterCooler: false,
                    studyTable: false,
                },
            });
            setPhoto(null);
            setLocation({ lat: null, lng: null });
        } catch (err) {
            console.error(err);
            alert('Error listing PG');
        }
    };
    // const handleLocationChange = (loc) => {
    //     setLocation(loc);
    // }
    const handleFetchLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser.");
            return;
        }

        setIsFetchingLocation(true);
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ lat: latitude, lng: longitude });


            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                const data = await response.json();
                if (data && data.address) {
                    setForm(prevForm => ({
                        ...prevForm,
                        address: data.display_name || prevForm.address,
                        city: data.address.city || data.address.town || prevForm.city,
                        state: data.address.state || prevForm.state,
                        pincode: data.address.postcode || prevForm.pincode,
                        district: data.address.county || prevForm.district,
                    }));
                    toast.success("Location fetched and address fields populated!");
                }
            } catch (error) {
                toast.error("Could not fetch address details for the location.");
                console.error("Reverse geocoding error:", error);
            } finally {
                setIsFetchingLocation(false);
            }
        }, (error) => {
            toast.error("Unable to retrieve your location. Please grant permission or enter manually.");
            console.error("Geolocation error:", error);
            setIsFetchingLocation(false);
        });
    }
    return (
        <div className="addpg-form-wrapper">
            <div className="add-pg-container">
                <div className="add-pg-header">
                    <h2>List Your PG</h2>
                    <p>Fill in the details to reach thousands of students</p>
                </div>

                <form className="add-pg-form" onSubmit={handleSubmit}>
                    {/* Basic Information Section */}
                    <section className="form-section">
                        <div className="section-title">Basic Information</div>
                        <div className="input-grid">
                            <div className="input-field">
                                <label>PG Title</label>
                                <input type="text" name="title" placeholder="e.g. Luxury Stay Boys PG" value={form.title} onChange={handleChange} required />
                            </div>
                            <div className="input-field">
                                <label>Monthly Rent (₹)</label>
                                <input type="number" name="rent" placeholder="5000" value={form.rent} onChange={handleChange} required />
                            </div>
                            <div className="input-field">
                                <label>Contact Number</label>
                                <input type="text" name="contactNumber" placeholder="10-digit mobile number" maxLength={10} pattern="[0-9]{10}" value={form.contactNumber} onChange={handleChange} required />
                            </div>
                        </div>
                    </section>

                    {/* Location Section */}
                    <section className="form-section">
                        <div className="section-title">Location Details</div>
                        
                        <div className="location-helper">
                            <button type="button" onClick={handleFetchLocation} disabled={isFetchingLocation} className="location-btn">
                                <MapPin size={18} /> {isFetchingLocation ? 'Fetching...' : 'Use My Current Location'}
                            </button>
                            {location.lat && (
                                <span className="location-status">Coordinates set successfully!</span>
                            )}
                        </div>

                        <div className="input-field full-width">
                            <label>Full Address</label>
                            <textarea name="address" rows="2" placeholder="Street, Landmark, Area..." value={form.address} onChange={handleChange} required />
                        </div>
                        
                        <div className="input-grid">
                            <div className="input-field">
                                <label>City</label>
                                <input type="text" name="city" placeholder="City" value={form.city} onChange={handleChange} required />
                            </div>
                            <div className="input-field">
                                <label>Pincode</label>
                                <input type="number" name="pincode" placeholder="6-digit code" value={form.pincode} onChange={handleChange} required />
                            </div>
                            <div className="input-field">
                                <label>District</label>
                                <input type="text" name="district" placeholder="District" value={form.district} onChange={handleChange} required />
                            </div>
                            <div className="input-field">
                                <label>State</label>
                                <input type="text" name="state" placeholder="State" value={form.state} onChange={handleChange} required />
                            </div>
                        </div>
                    </section>

                    {/* Amenities Section */}
                    <section className="form-section">
                        <div className="section-title">Amenities</div>
                        <div className="amenities-checkbox-grid">
                            {Object.keys(form.amenities).map((amenity) => (
                                <label key={amenity} className="checkbox-item">
                                    <input
                                        type="checkbox"
                                        name={amenity}
                                        checked={form.amenities[amenity]}
                                        onChange={handleChange}
                                    />
                                    <span>{amenity.toUpperCase()}</span>
                                </label>
                            ))}
                        </div>
                    </section>

                    {/* Media Section */}
                    <section className="form-section">
                        <div className="section-title">Media</div>
                        <div className="image-upload-area">
                            <div className="upload-input">
                                <label htmlFor="photo-upload" className="custom-upload-btn">
                                    <Upload size={18} /> Choose PG Photo
                                </label>
                                <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
                                <p className="upload-hint">Supported formats: JPG, PNG. Max size: 5MB.</p>
                            </div>
                            
                            {photo && (
                                <div className="current-preview">
                                    <p>Selected Image:</p>
                                    <img
                                        src={URL.createObjectURL(photo)}
                                        alt="Preview"
                                        className="img-preview-box"
                                    />
                                </div>
                            )}
                        </div>
                    </section>

                    <div className="form-actions">
                        <button type="submit" className="btn-submit">
                            <PlusCircle size={20} /> Submit PG Listing
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddPgForm