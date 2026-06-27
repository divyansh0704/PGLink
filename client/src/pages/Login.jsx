import React from 'react'
import API from '../utils/api'
import { useState } from 'react'
import "../styles/auth.css"
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Eye, EyeOff } from 'lucide-react';


const Login = ({ onClose, openRegister }) => {
    const [showPassword, setShowPassword] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' })
    // const navigate = useNavigate();
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    const login = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);

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
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="modal-overlay">

            <div className="modal-content auth-form">
                <div className="close-btn" onClick={onClose}>×</div>

                <h2>Login</h2>
                <form onSubmit={login}>
                    <input type="text" name='email' placeholder='Email' onChange={handleChange} required />
                    {/* <input type="text" type={showPassword ? 'text' : 'password'} name='password' placeholder='Password' onChange={handleChange} required /> */}
                    <div style={{ position: 'relative' }} >
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
                            {showPassword ?  <EyeOff size={16} color='black' />:<Eye size={16} color="black" /> }
                        </button>
                    </div>


                    <button type='submit' disabled={isSubmitting}>
                        {isSubmitting ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p className="switch-auth">
                    Don’t have an account? <Link onClick={openRegister}>Register here</Link>
                </p>
            </div>
        </div>
    )
}

export default Login