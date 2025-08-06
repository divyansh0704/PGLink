import React, { useState } from 'react'

import { FaHome, FaPlus } from 'react-icons/fa'
import { LayoutPanelLeft, ChevronLeft, Building2 ,Unlock } from 'lucide-react'
import "../styles/sidebar.css"
import { Link } from 'react-router-dom'
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'

const Sidebar = ({ isOpen, setIsOpen, openDashboard }) => {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  console.log("role:", user.role)

  const navigate = useNavigate();
  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Logged out successfully!", {
      position: "top-center",
      autoClose: 2000,
    });

    setTimeout(() => {
      // navigate("/login");
      // window.location.reload();
      window.location.href = "/";

    }, 2000);



  }


  return (
    <div className="sidebar-container">
      <div className={`sidebar ${isOpen ? 'open' : 'collapsed'}`} >
        <div className={`toggle-icon ${isOpen ? 'shifted' : ''}`} onClick={() => setIsOpen(prev => !prev)}>

          {isOpen ? (
            <ChevronLeft size={24} />

          ) : (
            <LayoutPanelLeft size={24} />

          )}


        </div >
        <div className="opt">

          <Link to="/" className={`sidebar-item ${isOpen ? 'hifted' : ''}`}> <FaHome size={18} /> {isOpen && "Home"}</Link>
          {user?.role === 'owner' && (
            <>
              <Link to="/dashboard"  className={`sidebar-item ${isOpen ? 'hifted' : ''}`}> <FaPlus size={18} /> {isOpen && "Add PG"}</Link>
              <Link to="/my-listings" className={`sidebar-item ${isOpen ? 'hifted' : ''}`}> <Building2 size={19} /> {isOpen && "My Listings"}</Link>
            </>
          )}
          <Link to="/unlocked" className={`sidebar-item ${isOpen ? 'hifted' : ''}`}> <Unlock size={18} /> {isOpen && "Unlocked PGs"}</Link>
          


          {localStorage.getItem("token") && (
            <Link className={`sidebar-item log-color ${isOpen ? 'hifted' : ''}`} onClick={handleLogout}>
              <LogOut size={20} />{isOpen && "Logout"}
            </Link>
          )}

        </div>
        {/* </div> */}
        {/* {isOpen && <div className="overlay" onClick={toggleSidebar}></div>} */}
      </div>
    </div>
  )
}

export default Sidebar