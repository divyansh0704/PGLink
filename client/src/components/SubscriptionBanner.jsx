import React from 'react'
import "../styles/subs.css"
import loadRazorpay from '../utils/razorpay';
const SubscriptionBanner = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return (
        <div className='subscription-banner'>
            <h2>🔥 Subscribe Now – Just ₹10 Only! 🔥</h2>
            <p>Unlock all PG owner contacts instantly and never miss the best deals.</p>
            <button
               
                onClick={() => loadRazorpay('subscription', null, user.id)}
                className="subscribe-btn"
            >
                Subscribe for ₹10
            </button></div>
    )
}

export default SubscriptionBanner