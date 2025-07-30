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
import PGDescription from "./pages/PGDescription"


function App() {
  const [isSidebarOpen, setIsSidebaropen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  // const [showEdit,setShowEdit]=useState(false)


  return (
    <div className="app-layout">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebaropen}
        openDashboard={() => {
          setShowDashboard(true);
        }} />
      <div className={`main-content ${isSidebarOpen ? 'shifted' : ''}`}>
        <Navbar isSidebarOpen={isSidebarOpen} openLogin={() => setShowLogin(true)} />
        <Routes>
          <Route path="/" element={<Home setShowLogin={() => setShowLogin(true)} />} />
          <Route path="/my-listings" element={<MyListings
           openDashboard={() => {setShowDashboard(true);}} />} />
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          {/* <Route path="/edit/:id" element={<Dashboard   />} /> */}
           <Route path="/unlocked" element={<UnlockedPGs/>} />
           <Route path="/pg/:id" element={<PGDescription />}/>
          

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
        {showDashboard && (
          <Dashboard
            onClosePg={() => setShowDashboard(false)}



          />

        )


        }
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