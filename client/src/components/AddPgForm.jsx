import React from 'react'
import { useState } from 'react'
import "../styles/addPgForm.css"
import API from '../utils/api'
import { toast } from 'react-toastify'
// import LocationPicker from './LocationPicker'
const AddPgForm = () => {
    const [form, setForm] = useState({
        title: '',
        // collegeName: '',
        district: '',
        pincode: '',
        state: '',
        city: '',
        address: '',
        // distanceKm: '',
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
                // navigate('/');
                // window.location.reload();
                window.location.href = "/"
            }, 2000);
            // alert('PG listed successfully!');
            setForm({
                title: '',
                // collegeName: '',
                district: '',
                pincode: '',
                state: '',
                city: '',
                address: '',
                // distanceKm: '',
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
            <form className="addpg-form addbox-content" onSubmit={handleSubmit}>
                
                <h2>List Your PG</h2>
                <div>
                    <input
                        type="text"
                        name="title"
                        placeholder="PG Title"
                        value={form.title}
                        onChange={handleChange}
                        required
                    />

                    
                    <input
                        type="number"
                        name="rent"
                        placeholder="Monthly Rent (₹)"
                        value={form.rent}
                        onChange={handleChange}
                        required
                    />


                    <input
                        type="text"
                        name="contactNumber"

                        placeholder="Enter 10-digit number"
                        maxLength={10}
                        pattern="[0-9]{10}"
                        value={form.contactNumber}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="location-group">
                    <button type="button" onClick={handleFetchLocation} disabled={isFetchingLocation} className="location-btn">
                        {isFetchingLocation ? 'Fetching...' : ' Use My Current Location'}
                    </button>
                    <p className="location-info">
                        {location.lat ? `Coordinates set: Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}` : 'Or, fill in the address manually below.'}
                    </p>
                </div>
                <div>
                    <textarea
                        placeholder="Address"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        rows="3"
                        required
                    />
                    <div id='spl'>
                        <input
                            type="text"
                            name="city"
                            placeholder="City"
                            value={form.city}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="number"
                            name="pincode"
                            placeholder="e.g:134204"
                            value={form.pincode}
                            maxLength={6}
                            onChange={handleChange}
                            required
                        />


                    </div>
                    <div id='spl'>
                        <input
                            type="text"
                            name="district"

                            placeholder="Distt."

                            // pattern="[0-9]{10}"
                            value={form.district}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="state"

                            placeholder="State"


                            value={form.state}
                            onChange={handleChange}
                            required
                        />


                    </div>
                </div>

                
               
                <div>
                   
                    <label>
                        Upload PG Photo:
                        <input type="file" accept="image/*" onChange={handlePhotoChange} />
                    </label>
                    {photo && (
                        <div className="preview-container">
                            <img
                                src={URL.createObjectURL(photo)}
                                alt="Preview"
                                style={{
                                    width: "80px",
                                    height: "75px",
                                    objectFit: "cover",
                                    marginTop: "10px",
                                    borderRadius: "10px",
                                    border: "2px solid #ddd"
                                }}
                            />
                        </div>
                    )}
                </div>
                <div>
                    <fieldset id='amen'>
                        <legend>Amenities:</legend>
                        {Object.keys(form.amenities).map((amenity) => (
                            <label key={amenity}>
                                <input
                                    type="checkbox"
                                    name={amenity}
                                    checked={form.amenities[amenity]}
                                    onChange={handleChange}
                                />
                                {amenity.toUpperCase()}
                            </label>
                        ))}
                    </fieldset>
                </div>


                <button type="submit"> Submit PG</button>
            </form>
        </div>
    )
}

export default AddPgForm