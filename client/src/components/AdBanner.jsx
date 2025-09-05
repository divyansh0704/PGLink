import React from 'react'
import { Unlock } from 'lucide-react'
import "../styles/banner.css"

const AdBanner = () => {
    return (
        <div className="ad-banner">
            <h2>Find PGs Closest to Your College</h2>
            <p>Unlock owner contacts in just 1 tap 🔓</p>
            <button onClick={() => window.scrollTo({ top: 260, behavior: "smooth" })}>
                Explore Now
            </button>
        </div>

    )
}

export default AdBanner