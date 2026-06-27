import React from 'react'
import { useState } from 'react';
import "../styles/global.css"
import { Link } from 'react-router-dom';
import {Menu } from 'lucide-react';
import ProfileMenu from './ProfileMenu';

import loadRazorpay from '../utils/razorpay';
import "../styles/logout.css"

const Navbar = ({ isSidebarOpen,openLogin,setIsOpen,openSetting }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const isLoggedIn = !!localStorage.getItem("token");
    // const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const isSubscribe = !!user?.isSubscribed;
    // console.log("user:",user.isSubscribed);
    // console.log("user:",isSubscribe);
    

    
   

    
    return (
        <div className={`navbar ${isSidebarOpen ? 'shifted' : ''}`}>
            <div className="partition1">
            {/* <div
                className="menu-toggle"
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <Menu size={22} />
            </div> */}

            <h1 className='logo'>PGLink</h1>

            </div>

            <div className="partition2">
            
            <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
                 {/* for now contact details are not hidden , we will implement it later */}
                {/* {isLoggedIn && !isSubscribe && (<button id='subscribeBtn' onClick={() => loadRazorpay('subscription', null, user.id)}>
                    Subscribe ₹10
                </button>)} */}

                {/* <div id="profile"> */}
                {!isLoggedIn && <Link onClick={openLogin} style={{"font-weight": "600", "font-size": "16px"}}>Login</Link>}
  
                {isLoggedIn && <ProfileMenu openSetting={openSetting} />}
                {/* </div> */}
               



            </nav>
            </div>

        </div>
    )
}

export default Navbar