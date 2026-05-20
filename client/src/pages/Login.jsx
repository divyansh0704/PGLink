import React from 'react'
import API from '../utils/api'
import { useState } from 'react'
import "../styles/auth.css"
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

const Login = ({onClose,openRegister}) => {
    const [formData, setFormData] = useState({ email: '', password: '' })
    // const navigate = useNavigate();
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    const login = async (e) => {
        e.preventDefault();

        try {
            const res = await API.post('/users/login', formData);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            localStorage.setItem('token', res.data.token);
            toast.success("Logged in successfully!", {
                position: "top-right",
                autoClose: 2000,
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
                
                <h2>Login</h2>
                <form onSubmit={login}>
                    <input type="text" name='email' placeholder='Email' onChange={handleChange} required />
                    <input type="text" name='password' placeholder='Password' onChange={handleChange} required />
                    <button type='submit'>Login</button>
                </form>
                <p className="switch-auth">
                    Don’t have an account? <Link onClick={openRegister}>Register here</Link>
                </p>
            </div>
        </div>
    )
}

export default Login