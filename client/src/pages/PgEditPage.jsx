import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, Save } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import "../styles/pgEditPage.css";
import API from '../utils/api';

const PgEditPage = () => {
  const { pgId } = useParams();
  const [form, setForm] = useState({
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
  })
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState({ lat: null, lng: null });

  useEffect(() => {
    const fetchPGDetails = async () => {
      try {
        const res = await API.get(`/pgs/${pgId}`);
        const data = res.data;

        console.log("Fetched PG Object:", data); 

        if (data) {
          
          let parsedAmenities = data.amenities;
          if (typeof data.amenities === 'string') {
            parsedAmenities = JSON.parse(data.amenities);
          }

         
          const displayContact = data.contactNumber?.includes('-')
            ? data.contactNumber.split('-')[1]
            : data.contactNumber;

          setForm(prev => ({
            ...prev,
            ...data,
            contactNumber: displayContact || '',
            amenities: { ...prev.amenities, ...parsedAmenities }
          }));
        }

        if (data.latitude && data.longitude) {
          setLocation({ lat: res.data.latitude, lng: res.data.longitude });
        }
      } catch (err) {
        console.error("Error fetching PG details:", err);
      }
    };
    if (pgId) fetchPGDetails();
  }, [pgId]);

  const handleChange = (e) => {
    console.log(form)
    console.log(pgId);
    // console.log(e);
    const { name, value, type, checked } = e.target;
    // console.log(name,value,type,checked);
    if (name in form.amenities) {
      setForm({ ...form, amenities: { ...form.amenities, [name]: checked } })

    } else {
      setForm({ ...form, [name]: type === 'number' ? Number(value) : value })
    }

  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(form);
    try {
      const contact = `+91-${form.contactNumber}`

      const formData = new FormData();

      formData.append('title', form.title);
      formData.append('district', form.district);
      formData.append('pincode', form.pincode);
      formData.append('state', form.state);
      formData.append('city', form.city);
      formData.append('address', form.address);
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

    
      // console.log("FormData contents:");
      // for (let [key, value] of formData.entries()) {
      //   console.log(`${key}:`, value);
      // }
      

      await API.put(`/pgs/${pgId}`, formData);
      toast.success("PG updated successfully!", {
        position: "top-right",
        autoClose: 2000,
      });
      setTimeout(() => {
        
        window.location.href = "/my-listings";
        
      }, 2000);

    } catch (err) {
      console.error("Update failed", err);
    }
  }

  return (
    <div className="edit-pg-container">
      <div className="edit-pg-header">
        <Link to="/my-listings" className="back-link">
          <ArrowLeft size={20} /> Back to Listings
        </Link>
        <h2>Edit PG Listing</h2>
      </div>

      <form className="edit-pg-form" onSubmit={handleSubmit}>
        {/* Basic Information Section */}
        <section className="form-section">
          <div className="section-title">Basic Information</div>
          <div className="input-grid">
            <div className="input-field">
              <label>PG Title</label>
              <input type="text" name='title' value={form.title} onChange={handleChange} placeholder="e.g. Luxury Stay Boys PG" required />
            </div>
            <div className="input-field">
              <label>Monthly Rent (₹)</label>
              <input type="number" name='rent' value={form.rent} onChange={handleChange} placeholder="5000" required />
            </div>
            <div className="input-field">
              <label>Contact Number</label>
              <input type="text" name='contactNumber' value={form.contactNumber} onChange={handleChange} placeholder="10-digit mobile number" required />
            </div>
          </div>
        </section>

        {/* Location Section */}
        <section className="form-section">
          <div className="section-title">Location Details</div>
          <div className="input-field full-width">
            <label>Full Address</label>
            <textarea name='address' value={form.address} onChange={handleChange} rows="2" placeholder="Street, Landmark, Area..." required></textarea>
          </div>
          <div className="input-grid">
            <div className="input-field">
              <label>City</label>
              <input type="text" name='city' value={form.city} onChange={handleChange} placeholder="City" required />
            </div>
            <div className="input-field">
              <label>Pincode</label>
              <input type="text" name='pincode' value={form.pincode} onChange={handleChange} placeholder="6-digit code" required />
            </div>
            <div className="input-field">
              <label>State</label>
              <input type="text" name='state' value={form.state} onChange={handleChange} placeholder="State" required />
            </div>
          </div>
        </section>

        {/* Amenities Section */}
        <section className="form-section">
          <div className="section-title">Amenities</div>
          <div className="amenities-checkbox-grid">
            {["WiFi", "Laundry", "Food", "AC", "Water Cooler", "Study Table"].map((item) => (
              <label key={item} className="checkbox-item">
                <input
                  type="checkbox"
                  name={item.toLowerCase().replace(" ", "")}
                  checked={form.amenities[item.toLowerCase().replace(" ", "")] || false}
                  onChange={handleChange}
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Media Section */}
        <section className="form-section">
          <div className="section-title">Media</div>
          <div className="image-upload-area">
            <div className="current-preview">
              <p>Current Image:</p>
              {form.imageUrl ? (
                <img src={form.imageUrl} alt="Current" className="img-preview-box" style={{ width: '100px', borderRadius: '8px' }} />
              ) : (
                <div className="img-placeholder">
                  <span>No Image Selected</span>
                </div>
              )}

            </div>
            <div className="upload-input">
              <label htmlFor="file-upload" className="custom-upload-btn">
                <Upload size={18} /> Change Photo
              </label>
              <input id="file-upload" name='imageUrl' type="file" onChange={(e) => setPhoto(e.target.files[0])} style={{ display: 'none' }} />
              <p className="upload-hint">Upload high-quality images to attract more views.</p>
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="form-actions">
          {/* <button type="button" className="btn-cancel">Cancel</button> */}
          <button type="submit" className="btn-save">
            <Save size={18} /> Update Listing
          </button>
        </div>
      </form>
    </div>
  );
};

export default PgEditPage