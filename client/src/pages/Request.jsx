import React from 'react';
import '../styles/request.css';
import API from '../utils/api';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const Request = () => {
    const [form, setForm] = useState({
        name: "",
        city: "",
        district: "",
        state: ""
    })
    const [requests, setRequests] = useState([]);

    const fetchRequests = async () => {
        try {
            const res = await API.get("/request/my-requests");
            setRequests(res.data);
        } catch (err) {
            console.error("Error fetching requests:", err);
        }
    }

    useEffect(() => {
        fetchRequests();
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post("/request/create", form);
            // alert("Request submitted successfully");
            setForm({
                name: "",
                city: "",
                district: "",
                state: ""
            })
            toast.success("Request submitted successfully", {
                position: "top-right",
                autoClose: 2000,
            });
            fetchRequests();

        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="request-page-wrapper">
            <div className="request-container">
                <div className="request-box">
                    <h2>Submit a Request to Add an Institution</h2>
                    <p>Please fill out the form below to request the addition of an organization or college to our platform.</p>
                    <form className="request-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="institutionName">Organization/College Name:</label>
                            <input type="text" id="institutionName" name="name" value={form.name} onChange={handleChange} placeholder="e.g., IIT Delhi" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="city">City:</label>
                            <input type="text" id="city" name="city" value={form.city} onChange={handleChange} placeholder="e.g., New Delhi" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="district">District:</label>
                            <input type="text" id="district" name="district" value={form.district} onChange={handleChange} placeholder="e.g., South Delhi" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="state">State:</label>
                            <input type="text" id="state" name="state" value={form.state} onChange={handleChange} placeholder="e.g., Delhi" required />
                        </div>

                        <button type="submit" className="submit-button">Submit Request</button>
                    </form>
                </div>
            </div>

            <div className="requests-history">
                <div className="history-header">
                    <h2>Your Request History</h2>
                    <p>Track the status of institutions you've asked to add.</p>
                </div>
                
                {requests.length === 0 ? (
                    <div className="no-requests">
                        <p>You haven't submitted any requests yet.</p>
                    </div>
                ) : (
                    <div className="requests-table-container">
                        <table className="requests-table">
                            <thead>
                                <tr>
                                    <th>Institution Name</th>
                                    <th>Location</th>
                                    <th>Submitted On</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map((req) => (
                                    <tr key={req.id}>
                                        <td><strong>{req.name}</strong></td>
                                        <td>{req.city}, {req.state}</td>
                                        <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`status-badge ${req.status}`}>
                                                {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Request;