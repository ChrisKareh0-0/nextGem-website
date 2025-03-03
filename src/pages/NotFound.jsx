import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      textAlign: 'center',
      color: '#fff'
    }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>404</h1>
      <h2 style={{ marginBottom: '2rem' }}>Page Not Found</h2>
      <p style={{ marginBottom: '2rem' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link 
        to="/"
        style={{
          padding: '10px 20px',
          backgroundColor: '#f35a2f',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: '5px',
          transition: 'background-color 0.3s'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#d44d26'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#f35a2f'}
      >
        Go Home
      </Link>
    </div>
  );
} 