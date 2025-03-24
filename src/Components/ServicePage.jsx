import React from 'react';
import styles from './ServicePage.module.css';

export const ServicePage = ({ service, onClose }) => {
  const getServiceContent = (serviceName) => {
    switch (serviceName) {
      case "Branding":
        return {
          title: "Branding Services",
          description: "We create unique and memorable brand identities that resonate with your target audience. Our branding services include logo design, brand guidelines, and visual identity development.",
          features: [
            "Logo Design",
            "Brand Guidelines",
            "Visual Identity",
            "Brand Strategy",
            "Brand Voice Development"
          ]
        };
      case "Advertising":
        return {
          title: "Advertising Services",
          description: "Strategic advertising campaigns that drive results. We create compelling content and place it where your audience will see it.",
          features: [
            "Digital Advertising",
            "Social Media Ads",
            "Display Advertising",
            "Search Engine Marketing",
            "Campaign Strategy"
          ]
        };
      case "Media Buying":
        return {
          title: "Media Buying Services",
          description: "Expert media buying services to ensure your advertising budget is spent effectively across the right channels.",
          features: [
            "Media Planning",
            "Channel Selection",
            "Budget Optimization",
            "Performance Tracking",
            "ROI Analysis"
          ]
        };
      case "3D & CGI":
        return {
          title: "3D & CGI Services",
          description: "Bring your ideas to life with stunning 3D and CGI visuals. Perfect for product visualization, architectural rendering, and creative content.",
          features: [
            "3D Modeling",
            "Animation",
            "Product Visualization",
            "Architectural Rendering",
            "Motion Graphics"
          ]
        };
      case "Development - UI/UX":
        return {
          title: "UI/UX Development",
          description: "Create intuitive and beautiful digital experiences with our UI/UX development services.",
          features: [
            "User Interface Design",
            "User Experience Design",
            "Prototyping",
            "Wireframing",
            "Interactive Design"
          ]
        };
      case "Photography - Videography":
        return {
          title: "Photography & Videography",
          description: "Professional photography and videography services to capture your brand's story and showcase your products or services.",
          features: [
            "Product Photography",
            "Commercial Photography",
            "Video Production",
            "Event Coverage",
            "Content Creation"
          ]
        };
      default:
        return {
          title: serviceName,
          description: "Comprehensive services tailored to your needs.",
          features: ["Feature 1", "Feature 2", "Feature 3"]
        };
    }
  };

  const content = getServiceContent(service);

  return (
    <div className={styles.servicePage}>
      <div className={styles.content}>
        <h1>{content.title}</h1>
        <p>{content.description}</p>
        <div className={styles.features}>
          <h2>Our Services Include:</h2>
          <ul>
            {content.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}; 