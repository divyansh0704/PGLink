import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../styles/otpVerification.css';
import API from '../utils/api';

const OTP_RESEND_DELAY = 5 * 60; 

const OtpVerification = () => {
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(OTP_RESEND_DELAY);
    const [canResend, setCanResend] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const timerRef = useRef(null);
    const user = JSON.parse(localStorage.getItem('user'));



    useEffect(() => {
        // Start the timer countdown
        timerRef.current = setInterval(() => {
            setTimer((prevTimer) => {
                if (prevTimer <= 1) {
                    clearInterval(timerRef.current);
                    setCanResend(true);
                    return 0;
                }
                return prevTimer - 1;
            });
        }, 1000);

        // Clear interval on component unmount
        return () => clearInterval(timerRef.current);
    }, []);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleOtpChange = (e) => {
        const value = e.target.value;

        if (/^\d*$/.test(value) && value.length <= 6) {
            setOtp(value);
        }
    };

    const handleVerifyOtp = async () => {
        if (otp.length !== 6) {
            toast.error('Please enter a 6-digit OTP.');
            return;
        }

        console.log('Verifying OTP:', otp, 'for email:', user.email);
        try {
            const res = await API.post("/users/verify-otp", { otp });

            if (user) {
                localStorage.setItem('user', JSON.stringify({ ...user, isVerified: true }));
            }
            toast.success(res.data?.message || 'OTP verified successfully!');
            navigate('/dashboard');



        } catch (error) {
            console.error('Error verifying OTP:', error);
            toast.error('An error occurred during OTP verification.');
        }
    };

    const handleResendOtp = async () => {
        if (!canResend) {
            toast.info(`Please wait ${formatTime(timer)} before resending.`);
            return;
        }

        console.log('Resending OTP to:', user.email);
        try {

            const res = await API.post("/users/send-otp");



            toast.success(res.data?.message || 'New OTP sent!');
            
            setTimer(OTP_RESEND_DELAY);
            setCanResend(false);
            clearInterval(timerRef.current);
            timerRef.current = setInterval(() => {
                setTimer((prevTimer) => {
                    if (prevTimer <= 1) {
                        clearInterval(timerRef.current);
                        setCanResend(true);
                        return 0;
                    }
                    return prevTimer - 1;
                });
            }, 1000);




        } catch (error) {
            console.error('Error resending OTP:', error);
            toast.error('An error occurred during OTP resend.');
        }
    };

    return (
        <div className="otp-verification-container">
            <div className="otp-verification-box">
                <h2>Verify Your Account</h2>
                <p>A 6-digit OTP has been sent to your email: <strong>{user.email}</strong></p>
                <div className="otp-input-group">
                    <input
                        type="text"
                        value={otp}
                        onChange={handleOtpChange}
                        maxLength="6"
                        placeholder="Enter OTP"
                        className="otp-input"
                        inputMode="numeric"
                        pattern="[0-9]*"
                    />
                </div>
                <button
                    onClick={handleVerifyOtp}
                    className="verify-button"
                    disabled={otp.length !== 6}
                >
                    Verify OTP
                </button>
                <div className="resend-section">
                    {canResend ? (
                        <button onClick={handleResendOtp} className="resend-button">
                            Resend OTP
                        </button>
                    ) : (
                        <p>Resend OTP in: {formatTime(timer)}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OtpVerification;
