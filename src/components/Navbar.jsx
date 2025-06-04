import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaBars, FaTimes } from 'react-icons/fa';
import LoginModal from './LoginModal';
import ContactModal from './ContactModal';

const Navbar = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <span>MORPH</span>
        </div>

        <div className="navbar-mobile-toggle" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </div>

        <ul className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <li className="navbar-item">
            <a href="#" className="navbar-link">Home</a>
          </li>
          <li className="navbar-item">
            <a href="#" className="navbar-link">Features</a>
          </li>
          <li className="navbar-item">
            <a href="#" className="navbar-link">Pricing</a>
          </li>
          <li className="navbar-item">
            <button 
              className="navbar-button contact-button"
              onClick={() => setShowContactModal(true)}
            >
              <FaEnvelope className="navbar-icon" />
              <span>Contact</span>
            </button>
          </li>
          <li className="navbar-item">
            <button 
              className="navbar-button login-button"
              onClick={() => setShowLoginModal(true)}
            >
              <FaUser className="navbar-icon" />
              <span>Login / Sign Up</span>
            </button>
          </li>
        </ul>
      </div>

      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}

      {showContactModal && (
        <ContactModal onClose={() => setShowContactModal(false)} />
      )}
    </nav>
  );
};

export default Navbar;
