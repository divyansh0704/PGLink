// import React from 'react'
// import { useNavigate } from 'react-router-dom'
// import { LogOut } from 'lucide-react';
// import "../styles/logout.css"

// const Logout = ({isOpen}) => {
//     const navigate = useNavigate();

//     const handleLogout = () => {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         navigate('/login');
//         window.location.reload();
//     }
//     return (
//         <button onClick={handleLogout} className="logout-btn">
        
//             <LogOut size={18} style={{ marginRight: '8px' }} />{isOpen && "Log out"}
           
//         </button>
        
//     )
// }

// export default Logout