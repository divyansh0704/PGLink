import React from 'react'
import { useState } from 'react';
import "../styles/global.css"
import { Link } from 'react-router-dom';
import ProfileMenu from './ProfileMenu';

import loadRazorpay from '../utils/razorpay';
import "../styles/logout.css"

const Navbar = ({ isSidebarOpen,openLogin }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const isLoggedIn = !!localStorage.getItem("token");
    // const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const isSubscribe = !!user?.isSubscribed;
    // console.log("user:",user.isSubscribed);
    console.log("user:",isSubscribe);
    

    
   

    
    return (
        <div className={`navbar ${isSidebarOpen ? 'shifted' : ''}`}>

            <h1 className='logo'>PGLink</h1>
            <div
                className="menu-toggle"
                onClick={() => setMenuOpen((prev) => !prev)}
            >
                ☰
            </div>
            <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
                {isLoggedIn && !isSubscribe && (<button id='subscribeBtn' onClick={() => loadRazorpay('subscription', null, user.id)}>
                    Subscribe ₹10
                </button>)}


                {!isLoggedIn && <Link onClick={openLogin} >Login</Link>}
                {isLoggedIn && <ProfileMenu />}
               



            </nav>

        </div>
    )
}

export default Navbar