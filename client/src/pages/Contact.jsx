import React from 'react'
import { Mail, Phone, MessageSquare } from 'lucide-react'
import "../styles/contact.css"
const Contact = () => {
    return (
        <div className='contact-container'>
            <h2>Contact Us</h2>
            <p>
                <Mail size={20} /> Email:{" "}
                <a href="mailto:pglink.app@gmail.com?subject=PGLink%20Support&body=Hello%20Team,">
                    pglink.app@gmail.com
                </a>
            </p>
            <p>
                <Phone size={20} /> Phone:{" "}
                <a href="tel:8295583149">
                    8295583149
                </a>
            </p>
            <p>
                <MessageSquare size={20} /> Feedback:{" "}
                <a href="mailto:pglink.app@gmail.com?subject=Feedback%20for%20PGLink">
                    Send Feedback
                </a>
            </p></div>
    )
}

export default Contact