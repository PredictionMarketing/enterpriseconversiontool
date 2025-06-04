import React, { useState } from 'react';
import { FaTimes, FaUser, FaEnvelope, FaComment } from 'react-icons/fa';

const ContactModal = ({ onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would handle form submission
    console.log('Contact form submitted:', { name, email, message });
    
    // Show success message
    setSubmitted(true);
    
    // Close modal after delay
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Contact Us</h2>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        {submitted ? (
          <div className="success-message">
            <p>Thank you for your message!</p>
            <p>We'll get back to you soon.</p>
          </div>
        ) : (
          <form className="modal-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="contact-name">
                <FaUser className="form-icon" />
                <span>Name</span>
              </label>
              <input
                type="text"
                id="contact-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="contact-email">
                <FaEnvelope className="form-icon" />
                <span>Email</span>
              </label>
              <input
                type="email"
                id="contact-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="contact-message">
                <FaComment className="form-icon" />
                <span>Message</span>
              </label>
              <textarea
                id="contact-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help you?"
                rows="4"
                required
              />
            </div>
            
            <button type="submit" className="modal-submit">
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactModal;
