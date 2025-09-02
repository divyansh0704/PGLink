import { Routes, Route } from "react-router-dom"
import { useState } from "react"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Register from "./pages/Register"
import Login from "./pages/Login"
import "./styles/variable.css"
import Dashboard from "./pages/Dashboard"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import Sidebar from "./components/Sidebar"
import MyListings from "./pages/MyListings"
import UnlockedPGs from "./pages/UnlockedPGs"
import Description from "./pages/Description"



function App() {
  const [isSidebarOpen, setIsSidebaropen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);



  return (
    <div className="app-layout">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebaropen} />
      <div className={`main-content ${isSidebarOpen ? 'shifted' : ''}`}>
        <Navbar isSidebarOpen={isSidebarOpen} openLogin={() => setShowLogin(true)} setIsOpen={setIsSidebaropen}
           />
        <Routes>
          <Route path="/" element={<Home setShowLogin={() => setShowLogin(true)} isSidebarOpen={isSidebarOpen} />} />
          <Route path="/my-listings"  element={<MyListings />} />
          <Route path="/dashboard"   element={<Dashboard />} />
          <Route path="/pg/:id" element={ <Description/> } />
          <Route path="/unlocked" element={<UnlockedPGs />} />
          


        </Routes>
        {showRegister && (
          <Register
            onClose={() => setShowRegister(false)}
            openLogin={() => {
              setShowLogin(true);
              setShowRegister(false);
            }}

          />
        )}
        
        {showLogin && (
          <Login
            onClose={() => setShowLogin(false)}
            openRegister={() => {
              setShowRegister(true)
              setShowLogin(false)
            }}

          />
        )}
        <ToastContainer />
      </div>
    </div>
  )
}

export default App;