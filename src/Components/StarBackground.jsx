import React from 'react';
import './StarBackground.css';

export default function StarBackground() {
  return (
    <>
      <div className='container'>
        <div id="stars"></div>
        <div id="stars2"></div>
        <div id="stars3"></div>
        <div id="stars4"></div>
        <div id="stars5"></div>
        {/* NEW: Left side stars */}
        <div id="starsLeft"></div>
        </div>
    </>
  );
}