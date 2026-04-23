import { Routes, Route } from "react-router-dom"
import { useState,lazy,Suspense } from "react"
import Navbar from "./components/Navbar"
const Home =lazy(()=>import( "./pages/Home"));
const Register =lazy(()=>import( "./pages/Register"));
const Login =lazy(()=>import( "./pages/Login"));
import "./styles/variable.css"
const Dashboard =lazy(()=>import( "./pages/Dashboard"));
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from "./components/Sidebar"
const MyListings =lazy(()=>import( "./pages/MyListings"));
const UnlockedPGs =lazy(()=>import( "./pages/UnlockedPGs"));
const Description =lazy(()=>import( "./pages/Description"));
const SettingsForm =lazy(()=>import( "./pages/SettingForm"));
const Terms =lazy(()=>import( "./pages/Terms"));
const Services =lazy(()=>import( "./pages/Services"));
const Privacy =lazy(()=>import( "./pages/Privacy"));
const Contact =lazy(()=>import( "./pages/Contact"));
const PgEditPage =lazy(()=>import( "./pages/PgEditPage"));
const Admin =lazy(()=>import( "./pages/Admin"));
import Spinner from "./components/Spinner";



function App() {
  const [isSidebarOpen, setIsSidebaropen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  // const [showSettings, setShowSettings] = useState(false);




  return (
    <div className="app-layout">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebaropen} />
      <div className={`main-content ${isSidebarOpen ? 'shifted' : ''}`}>
        <Navbar isSidebarOpen={isSidebarOpen} openLogin={() => setShowLogin(true)} setIsOpen={setIsSidebaropen} 
           />
          <Suspense fallback={<Spinner />}>
          
        <Routes>
          <Route path="/" element={<Home setShowLogin={() => setShowLogin(true)} isSidebarOpen={isSidebarOpen} />} />
          <Route path="/my-listings"  element={<MyListings />} />
          <Route path="/dashboard"   element={<Dashboard />} />
          <Route path="/pg/:id" element={ <Description/> } />
          <Route path="/unlocked" element={<UnlockedPGs />} />
          <Route path="/setting" element={<SettingsForm/>} />
          <Route path="/terms" element={<Terms/>} />
          <Route path="/services" element={<Services/>} />
          <Route path="/privacy" element={<Privacy/>} />
          <Route path="/contact" element={<Contact/>} />
          <Route path="/edit/:pgId" element={<PgEditPage />} />
          <Route path="/admin" element={<Admin />} />"
          


        </Routes>
        </Suspense>
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