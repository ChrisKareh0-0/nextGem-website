import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

// Helper to determine if we're in development mode
const isDevelopment = import.meta.env.MODE === 'development';

// Set the base URL for the API based on the environment
const BACKEND_URL = isDevelopment 
  ? 'http://localhost:5000' // Development: Use localhost
  : 'https://nextgem-website-backend.onrender.com'; // Production: Use the deployed backend URL

// Construct the full API URL for contacts
const API_URL = `${BACKEND_URL}/api/contacts`;

console.log('Contact Form API URL:', API_URL);

const ResizableInput = ({ placeholder, value, onChange }) => {
  const [fontSize, setFontSize] = useState(window.innerWidth <= 768 ? 16 : 14);

  const handleInput = (event) => {
    const input = event.target;
    const maxWidth = input.clientWidth;
    const textWidth = input.scrollWidth;

    if (textWidth > maxWidth) {
      setFontSize((prevSize) => Math.max(prevSize - 1, window.innerWidth <= 768 ? 12 : 8));
    } else {
      setFontSize(window.innerWidth <= 768 ? 16 : 14);
    }

    onChange(event);
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setFontSize(window.innerWidth <= 768 ? 16 : 14);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <input
      className="app-form-control"
      placeholder={placeholder}
      value={value}
      style={{ 
        fontSize: `${fontSize}px`, 
        transition: 'font-size 0.2s ease',
        padding: window.innerWidth <= 768 ? '15px 0' : '10px 0'
      }}
      onInput={handleInput}
      onChange={handleInput}
    />
  );
};

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { placeholder, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [placeholder.toLowerCase()]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      toast.success(data.message || 'Message sent successfully!');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(error.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-form">
      <div className="app-form-group">
        <ResizableInput
          placeholder="NAME"
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      <div className="app-form-group">
        <ResizableInput
          placeholder="EMAIL"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div className="app-form-group">
        <ResizableInput
          placeholder="PHONE"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>
      <div className="app-form-group message">
        <ResizableInput
          placeholder="MESSAGE"
          value={formData.message}
          onChange={handleChange}
        />
      </div>
      <div className="app-form-group buttons">
        <button
          className="app-form-button"
          onClick={() => setFormData({ name: '', email: '', phone: '', message: '' })}
        >
          CANCEL
        </button>
        <button
          className="app-form-button"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'SENDING...' : 'SEND'}
        </button>
      </div>
    </div>
  );
} 