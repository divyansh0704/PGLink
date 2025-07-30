import React, { useState, useEffect, useRef } from 'react'
import "../styles/profileMenu.css"
import { useNavigate } from 'react-router-dom';
import { getAvatarColor } from '../utils/getcolor';
import { toast } from 'react-toastify';




const ProfileMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const menuRef = useRef(null);
   

    const user = JSON.parse(localStorage.getItem('user'));
    const bgColor = getAvatarColor(user?.name || "default");
    const initials = user?.name
        ? user.name.split(' ').map((word) => word[0].toUpperCase()).join('').slice(0, 2) : 'U'

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        toast.success("Logged out successfully!", {
            position: "top-center",
            autoClose: 2000,
        });

        setTimeout(() => {
            // navigate("/login");
            window.location.reload();

        }, 2000);



    }
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    return (
        <div className="profile-container">
            <div className="avatar" style={{ backgroundColor: bgColor }} onClick={toggleMenu}>
                <span>{initials}</span>
            </div>
            {isOpen && (
                <div className="dropdown" ref={menuRef}>
                    <p className='name'>{user?.name}</p>
                    <p className='email'>{user?.email}</p>
                    <button className="logout" onClick={handleLogout}>Logout</button>
                    <button className="setting">Settings</button>
                </div>
            )}
        </div>
    )
}

export default ProfileMenu