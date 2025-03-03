import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
import styles from "./HomeServicesSection.module.css";
import { presetColors } from "../constants/PresetColors";

export const HomeServicesSection = () => {
  const [hoveredBoxIndex, setHoveredBoxIndex] = useState(null);
  const [boxColors, setBoxColors] = useState({});
  const [lastUsedIndexes, setLastUsedIndexes] = useState([]);

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

  const handleButtonClick = () => {
    // navigate("/services");
  };

  return (
    <div className={styles.main}>
      <div className={styles["title-container"]}>
        {/* <h2 style={{color:"#fff"}}>Our Services</h2> */}
      </div>

      <div className={styles.container}>
        {[
          "Branding",
          "Advertising",
          "Media Buying",
          "3D & CGI",
          "Development - UI/UX",
          "Photography - Videography",
        ].map((service, index) => (
          <div
            key={index}
            className={styles.box}
            style={{
              backgroundColor:
                hoveredBoxIndex === index
                  ? boxColors[index]
                  : "rgb(19, 41, 53)",
            }}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            onClick={handleButtonClick}
          >
            <h3>{service}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};
