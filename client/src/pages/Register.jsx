import React from 'react'
import { useState } from "react";
import API from "../utils/api";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import "../styles/auth.css";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";


const Register = ({ onClose, openLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'viewer' })
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }
  const register = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      // console.log(formData);
      const res = await API.post("/users/register", formData);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.setItem('token', res.data.token);
      toast.success("Logged in successfully!", {
        position: "top-right",
        autoClose: 2000,
      });
      setTimeout(() => {
        onClose();
        navigate("/verify-otp");
      }, 2000);


    } catch (err) {

      toast.error(err.response?.data?.error || "Login failed", {
        position: "top-center",
      });
    } finally {
      setIsSubmitting(false);
    }


  }

  return (
    <div className="modal-overlay">
      <div className="modal-content auth-form">
        <div className="close-btn" onClick={onClose}>×</div>
        <h2>Register</h2>
        <form onSubmit={register} >
          <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
          <input type="text" name="email" placeholder='Email' onChange={handleChange} required />
          {/* <input type="text" name="password" placeholder='Password' onChange={handleChange} required /> */}
          <div style={{ position: 'relative',width: '84%'}} >
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              style={{ paddingRight: '2.5rem' }}
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              style={{
                position: 'absolute',
                right: '-20px',
                top: '36%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                lineHeight: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '1.5rem',
                width: '1.5rem',
              }}
            >
              {showPassword ? <EyeOff size={16} color='black' /> : <Eye size={16} color="black" />}
            </button>
          </div>
          <select name="role" onChange={handleChange} defaultValue=''>
            <option value="" disabled hidden> -- Select --</option>
            <option value="viewer">Student/Parent</option>
            <option value="owner">PG Owner</option>
          </select>
          <button type='submit' disabled={isSubmitting}>{isSubmitting ? 'Registering...' : 'Register'}</button>
        </form>
        <p className="switch-auth">
          Already have an account? <Link onClick={openLogin}>Login here</Link>
        </p>
      </div>
    </div>
  )
}

export default Register