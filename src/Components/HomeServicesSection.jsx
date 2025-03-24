import React, { useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
import styles from "./HomeServicesSection.module.css";
import { presetColors } from "../constants/PresetColors";
import { ServicePage } from "./ServicePage";

export const HomeServicesSection = () => {
  const [hoveredBoxIndex, setHoveredBoxIndex] = useState(null);
  const [boxColors, setBoxColors] = useState({});
  const [lastUsedIndexes, setLastUsedIndexes] = useState([]);
  const [expandingBox, setExpandingBox] = useState(null);
  const [expandedBox, setExpandedBox] = useState(null);
  const [collapsingBox, setCollapsingBox] = useState(null);
  const [activeService, setActiveService] = useState(null);
  const containerRef = useRef(null);

//   const navigate = useNavigate();

  const handleMouseEnter = (index) => {
    let randomIndex;

    do {
      randomIndex = Math.floor(Math.random() * presetColors.length);
    } while (lastUsedIndexes.includes(randomIndex));

    const randomColor = presetColors[randomIndex];

    setBoxColors((prevColors) => ({
      ...prevColors,
      [index]: randomColor,
    }));

    setHoveredBoxIndex(index);

    setLastUsedIndexes((prevIndexes) => {
      const updatedIndexes = [...prevIndexes, randomIndex];
      if (updatedIndexes.length > 2) {
        updatedIndexes.shift();
      }
      return updatedIndexes;
    });
  };

  const handleMouseLeave = () => {
    setHoveredBoxIndex(null);
  };

  const handleBoxClick = (index, service, event) => {
    const box = event.currentTarget;
    const boxRect = box.getBoundingClientRect();
    const originalY = boxRect.top;
    const originalScale = boxRect.width / window.innerWidth;

    // Set CSS variables for the animation
    box.style.setProperty('--original-y', `${originalY}px`);
    box.style.setProperty('--original-scale', originalScale);
    
    setExpandingBox(index);
    
    // After animation completes, set the expanded state and show the service page
    setTimeout(() => {
      setExpandedBox(index);
      setExpandingBox(null);
      setActiveService(service);
    }, 500);
  };

  const handleExitClick = (index, event) => {
    event.stopPropagation();
    const box = event.currentTarget.closest(`.${styles.box}`);
    const boxRect = box.getBoundingClientRect();
    
    // Set CSS variables for the collapse animation
    box.style.setProperty('--original-y', `${boxRect.top}px`);
    box.style.setProperty('--original-scale', boxRect.width / window.innerWidth);
    
    setCollapsingBox(index);
    setExpandedBox(null);
    setActiveService(null);
    
    // After collapse animation completes
    setTimeout(() => {
      setCollapsingBox(null);
    }, 500);
  };

  const services = [
    "Branding",
    "Advertising",
    "Media Buying",
    "3D & CGI",
    "Development - UI/UX",
    "Photography - Videography",
  ];

  return (
    <div className={styles.main}>
      <div className={styles["title-container"]}>
        {/* <h2 style={{color:"#fff"}}>Our Services</h2> */}
      </div>

      <div className={styles.container} ref={containerRef}>
        {services.map((service, index) => (
          <div
            key={index}
            className={`${styles.box} ${expandingBox === index ? styles.expanding : ''} ${expandedBox === index ? styles.expanded : ''} ${collapsingBox === index ? styles.collapsing : ''}`}
            style={{
              backgroundColor:
                hoveredBoxIndex === index
                  ? boxColors[index]
                  : "rgb(0, 0, 0)",
            }}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            onClick={(e) => handleBoxClick(index, service, e)}
          >
            <h3>{service}</h3>
            {expandedBox === index && (
              <div 
                className={styles["exit-icon"]}
                onClick={(e) => handleExitClick(index, e)}
              >
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {activeService && (
        <ServicePage 
          service={activeService} 
          onClose={() => {
            setActiveService(null);
            setExpandedBox(null);
          }}
        />
      )}
    </div>
  );
};
