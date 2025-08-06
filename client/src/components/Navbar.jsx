import React from 'react'
import { useState } from 'react';
import "../styles/global.css"
import { Link } from 'react-router-dom';
import {LayoutPanelLeft } from 'lucide-react';
import ProfileMenu from './ProfileMenu';

import loadRazorpay from '../utils/razorpay';
import "../styles/logout.css"

const Navbar = ({ isSidebarOpen,openLogin,setIsOpen }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const isLoggedIn = !!localStorage.getItem("token");
    // const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const isSubscribe = !!user?.isSubscribed;
    // console.log("user:",user.isSubscribed);
    console.log("user:",isSubscribe);
    

    
   

    
    return (
        <div className={`navbar ${isSidebarOpen ? 'shifted' : ''}`}>
            <div
                className="menu-toggle"
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <LayoutPanelLeft size={24} />
            </div>

            <h1 className='logo'>PGLink</h1>
            
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