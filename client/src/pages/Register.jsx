import React from 'react'
import { useState } from "react";
import API from "../utils/api";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import "../styles/auth.css";
import { Link } from "react-router-dom";


const Register = ({ onClose, openLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'viewer' })
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }
  const register = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/users/register", formData);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.setItem('token', res.data.token);
      toast.success("Logged in successfully!", {
        position: "top-right",
        autoClose: 2000,
        className:"my-toast",
      });
      setTimeout(() => {
        // navigate('/');
        //  window.location.reload();
        window.location.href = "/";
      }, 2000);


    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed", {
        position: "top-center",
      });
    }


  }

  return (
    <div className="modal-overlay">
      <div className="modal-content auth-form">
        <div className="close-btn" onClick={onClose}>×</div>
        <h2>Register</h2>
        <form onSubmit={register}>
          <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
          <input type="text" name="email" placeholder='Email' onChange={handleChange} required />
          <input type="text" name="password" placeholder='Password' onChange={handleChange} required />
          <select name="role" onChange={handleChange} defaultValue=''>
            <option value="" disabled hidden> -- Select --</option>
            <option value="viewer">Student/Parent</option>
            <option value="owner">PG Owner</option>
          </select>
          <button type='submit'>Register</button>
        </form>
        <p className="switch-auth">
          Already have an account? <Link onClick={openLogin}>Login here</Link>
        </p>
      </div>
    </div>
  )
}

export default Register