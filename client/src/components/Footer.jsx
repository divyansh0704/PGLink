
import React from 'react';
import '../styles/footer.css'; // assuming you store styles here
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-sections">
        <div className="footer-sectionb footer-section">
          <h4>PGLink</h4>
          <p>Find verified PGs near your college.</p>
        </div>

        <div className="footer-section footer-sectiona">
          <h4>Useful Links</h4>
          <ul>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/feedback">Feedback</Link></li>
          </ul>
        </div>

        <div className="footer-sectiona footer-section">
          <h4>Legal</h4>
          <ul>
            <li><Link to="/terms">Terms & Conditions</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            
            
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 PGLink. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
