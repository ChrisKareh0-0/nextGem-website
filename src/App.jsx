import React, { useState, useEffect, Suspense, lazy } from 'react';
import ScrollReveal from 'scrollreveal';
import './App.css'; // <-- Import your CSS
import StarBackground from './Components/StarBackground'; // Our new star background
import ClientsCarousel from './Components/ClientsCarousel';
import { HomeServicesSection } from './Components/HomeServicesSection';
import LOGO1 from '../public/NEXTGEM LOGO 1-05.png';
import LOGO2 from '../public/IMG_0560.png';
import AboutLogo from '../public/play.png';
import Geometric1 from '../public/photo_5974518505279701778_y.jpg';
import Geometric2 from '../public/photo_5974518505279701779_y.jpg';
import Geometric3 from '../public/photo_5974518505279701780_y.jpg';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ContactForm from './Components/ContactForm';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProtectedRoute from './Components/ProtectedRoute';
import RadioButtonEffect from './utils/RadioButtonEffect';
import CubeAnimation from './Components/CubeAnimation';
import Spline from '@splinetool/react-spline';
  

// Lazy load the pages
const ManagementPage = lazy(() => import('./pages/ManagementPage'));
const CommunicationPage = lazy(() => import('./pages/CommunicationPage'));
const ManagementDashboard = lazy(() => import('./pages/ManagementDashboard'));
const Login = lazy(() => import('./pages/Login'));
const NotFound = lazy(() => import('./pages/NotFound'));

const ResizableInput = ({ placeholder }) => {
  const [fontSize, setFontSize] = useState(14);

  const handleInput = (event) => {
    const input = event.target;
    const maxWidth = input.clientWidth;
    const textWidth = input.scrollWidth;

    if (textWidth > maxWidth) {
      setFontSize((prevSize) => Math.max(prevSize - 1, 8));
    } else {
      setFontSize(14);
    }
  };

  return (
    <input
      className="app-form-control"
      placeholder={placeholder}
      style={{ fontSize: `${fontSize}px`, transition: 'font-size 0.2s ease' }}
      onInput={handleInput}
    />
  );
};

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('#home');

  // Toggle mobile menu
  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle nav link click
  const handleNavLinkClick = (sectionId) => {
    setActiveLink(sectionId);
    setIsMenuOpen(false); // Close the mobile menu after clicking a link
    
    // Scroll to the corresponding section
    const section = document.querySelector(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // ScrollReveal effect (runs once on mount)
  useEffect(() => {
    const sr = ScrollReveal({
      origin: 'top',
      distance: '80px',
      duration: 2000,
      reset: true,
    });

    sr.reveal('.home-title', { delay: 200 });
    sr.reveal('.button', { delay: 200 });
    sr.reveal('.home-img', { delay: 400 });
    sr.reveal('.home-social', { delay: 400 });
    sr.reveal('.about-img');
    sr.reveal('.about-subtitle', { delay: 200 });
    sr.reveal('.about-text', { delay: 400 });
    sr.reveal('.Services-subtitle', { delay: 100 });
    sr.reveal('.Services-text', { delay: 150 });
    sr.reveal('.Services-data', { interval: 200 });
    sr.reveal('.Services-img', { delay: 400 });
    sr.reveal('.work-img', { interval: 200 });
    sr.reveal('.contact-input', { interval: 200 });

    // Initialize RadioButtonEffect
    const radioBtnGroups = document.querySelectorAll(".radio-btn-group");
    new RadioButtonEffect(radioBtnGroups);

    // Add scroll event listener to update active link
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id], div[id]');
      const scrollY = window.pageYOffset + 100; // Add offset to trigger slightly earlier

      sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          setActiveLink(`#${sectionId}`);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Common SVG style as an object (camelCased properties)
  const svgStyle = {
    shapeRendering: 'geometricPrecision',
    textRendering: 'geometricPrecision',
    imageRendering: 'optimizeQuality',
    fillRule: 'evenodd',
    clipRule: 'evenodd'
  };

  // Scroll to the contact section
  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Loading component for Suspense fallback
  const LoadingSpinner = () => (
    <div className="loading-spinner">
      <div className="spinner"></div>
    </div>
  );

  return (
    <Router>
      <>
        <div className="spline-container">
          <Spline 
            scene="https://prod.spline.design/Dc1yF0TKl-zWQE6X/scene.splinecode"
            style={{ 
              width: '100%', 
              height: '100%',
              position: 'fixed',
              top: 0,
              left: 0,
              zIndex: -1
            }}
          />
        </div>
        <div className="floating-rectangle"></div>
        
        {/* HEADER */}
        <header className="l-header">
          <nav className="nav bd-grid">
            <div>
              {/* Optionally, uncomment text logo */}
              {/* <a href="#home" className="nav-logo">NextGem</a> */}
              <img
                src={LOGO1}
                width={200}
                height={100}
                alt="NextGem Logo"
              />
            </div>

            {/* Mobile/desktop nav menu */}
            <div className={`nav-menu ${isMenuOpen ? 'show' : ''}`} id="nav-menu">
              <ul className="nav-list">
                <li className="radio-btn-group">
                  <input type="radio" name="nav-radio-group" value="home" id="nav-home" checked={activeLink === '#home'} onChange={() => handleNavLinkClick('#home')} />
                  <label htmlFor="nav-home">
                    <span>Home</span>
                    <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
                      <g className="pink">
                        <rect x="-101%" y="0" width="100%" height="5" />
                        <rect x="-101%" y="5" width="100%" height="5" />
                        <rect x="-101%" y="10" width="100%" height="5" />
                        <rect x="-101%" y="15" width="100%" height="5" />
                        <rect x="-101%" y="20" width="100%" height="5" />
                        <rect x="-101%" y="25" width="100%" height="5" />
                        <rect x="-101%" y="30" width="100%" height="5" />
                        <rect x="-101%" y="35" width="100%" height="5" />
                        <rect x="-101%" y="40" width="100%" height="5" />
                        <rect x="-101%" y="45" width="100%" height="5" />
                      </g>
                      <g className="blue">
                        <rect x="101%" y="0" width="100%" height="5" />
                        <rect x="101%" y="5" width="100%" height="5" />
                        <rect x="101%" y="10" width="100%" height="5" />
                        <rect x="101%" y="15" width="100%" height="5" />
                        <rect x="101%" y="20" width="100%" height="5" />
                        <rect x="101%" y="25" width="100%" height="5" />
                        <rect x="101%" y="30" width="100%" height="5" />
                        <rect x="101%" y="35" width="100%" height="5" />
                        <rect x="101%" y="40" width="100%" height="5" />
                        <rect x="101%" y="45" width="100%" height="5" />
                      </g>
                    </svg>
                  </label>
                </li>

                <li className="radio-btn-group">
                  <input type="radio" name="nav-radio-group" value="about" id="nav-about" checked={activeLink === '#about'} onChange={() => handleNavLinkClick('#about')} />
                  <label htmlFor="nav-about">
                    <span>About</span>
                    <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
                      <g className="pink">
                        <rect x="-101%" y="0" width="100%" height="5" />
                        <rect x="-101%" y="5" width="100%" height="5" />
                        <rect x="-101%" y="10" width="100%" height="5" />
                        <rect x="-101%" y="15" width="100%" height="5" />
                        <rect x="-101%" y="20" width="100%" height="5" />
                        <rect x="-101%" y="25" width="100%" height="5" />
                        <rect x="-101%" y="30" width="100%" height="5" />
                        <rect x="-101%" y="35" width="100%" height="5" />
                        <rect x="-101%" y="40" width="100%" height="5" />
                        <rect x="-101%" y="45" width="100%" height="5" />
                      </g>
                      <g className="blue">
                        <rect x="101%" y="0" width="100%" height="5" />
                        <rect x="101%" y="5" width="100%" height="5" />
                        <rect x="101%" y="10" width="100%" height="5" />
                        <rect x="101%" y="15" width="100%" height="5" />
                        <rect x="101%" y="20" width="100%" height="5" />
                        <rect x="101%" y="25" width="100%" height="5" />
                        <rect x="101%" y="30" width="100%" height="5" />
                        <rect x="101%" y="35" width="100%" height="5" />
                        <rect x="101%" y="40" width="100%" height="5" />
                        <rect x="101%" y="45" width="100%" height="5" />
                      </g>
                    </svg>
                  </label>
                </li>

                <li className="radio-btn-group">
                  <input type="radio" name="nav-radio-group" value="services" id="nav-services" checked={activeLink === '#services'} onChange={() => handleNavLinkClick('#services')} />
                  <label htmlFor="nav-services">
                    <span>Services</span>
                    <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
                      <g className="pink">
                        <rect x="-101%" y="0" width="100%" height="5" />
                        <rect x="-101%" y="5" width="100%" height="5" />
                        <rect x="-101%" y="10" width="100%" height="5" />
                        <rect x="-101%" y="15" width="100%" height="5" />
                        <rect x="-101%" y="20" width="100%" height="5" />
                        <rect x="-101%" y="25" width="100%" height="5" />
                        <rect x="-101%" y="30" width="100%" height="5" />
                        <rect x="-101%" y="35" width="100%" height="5" />
                        <rect x="-101%" y="40" width="100%" height="5" />
                        <rect x="-101%" y="45" width="100%" height="5" />
                      </g>
                      <g className="blue">
                        <rect x="101%" y="0" width="100%" height="5" />
                        <rect x="101%" y="5" width="100%" height="5" />
                        <rect x="101%" y="10" width="100%" height="5" />
                        <rect x="101%" y="15" width="100%" height="5" />
                        <rect x="101%" y="20" width="100%" height="5" />
                        <rect x="101%" y="25" width="100%" height="5" />
                        <rect x="101%" y="30" width="100%" height="5" />
                        <rect x="101%" y="35" width="100%" height="5" />
                        <rect x="101%" y="40" width="100%" height="5" />
                        <rect x="101%" y="45" width="100%" height="5" />
                      </g>
                    </svg>
                  </label>
                </li>

                <li className="radio-btn-group">
                  <input type="radio" name="nav-radio-group" value="clients" id="nav-clients" checked={activeLink === '#clients'} onChange={() => handleNavLinkClick('#clients')} />
                  <label htmlFor="nav-clients">
                    <span>Clients</span>
                    <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
                      <g className="pink">
                        <rect x="-101%" y="0" width="100%" height="5" />
                        <rect x="-101%" y="5" width="100%" height="5" />
                        <rect x="-101%" y="10" width="100%" height="5" />
                        <rect x="-101%" y="15" width="100%" height="5" />
                        <rect x="-101%" y="20" width="100%" height="5" />
                        <rect x="-101%" y="25" width="100%" height="5" />
                        <rect x="-101%" y="30" width="100%" height="5" />
                        <rect x="-101%" y="35" width="100%" height="5" />
                        <rect x="-101%" y="40" width="100%" height="5" />
                        <rect x="-101%" y="45" width="100%" height="5" />
                      </g>
                      <g className="blue">
                        <rect x="101%" y="0" width="100%" height="5" />
                        <rect x="101%" y="5" width="100%" height="5" />
                        <rect x="101%" y="10" width="100%" height="5" />
                        <rect x="101%" y="15" width="100%" height="5" />
                        <rect x="101%" y="20" width="100%" height="5" />
                        <rect x="101%" y="25" width="100%" height="5" />
                        <rect x="101%" y="30" width="100%" height="5" />
                        <rect x="101%" y="35" width="100%" height="5" />
                        <rect x="101%" y="40" width="100%" height="5" />
                        <rect x="101%" y="45" width="100%" height="5" />
                      </g>
                    </svg>
                  </label>
                </li>

                <li className="radio-btn-group">
                  <input type="radio" name="nav-radio-group" value="contact" id="nav-contact" checked={activeLink === '#contact'} onChange={() => handleNavLinkClick('#contact')} />
                  <label htmlFor="nav-contact">
                    <span>Contact</span>
                    <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
                      <g className="pink">
                        <rect x="-101%" y="0" width="100%" height="5" />
                        <rect x="-101%" y="5" width="100%" height="5" />
                        <rect x="-101%" y="10" width="100%" height="5" />
                        <rect x="-101%" y="15" width="100%" height="5" />
                        <rect x="-101%" y="20" width="100%" height="5" />
                        <rect x="-101%" y="25" width="100%" height="5" />
                        <rect x="-101%" y="30" width="100%" height="5" />
                        <rect x="-101%" y="35" width="100%" height="5" />
                        <rect x="-101%" y="40" width="100%" height="5" />
                        <rect x="-101%" y="45" width="100%" height="5" />
                      </g>
                      <g className="blue">
                        <rect x="101%" y="0" width="100%" height="5" />
                        <rect x="101%" y="5" width="100%" height="5" />
                        <rect x="101%" y="10" width="100%" height="5" />
                        <rect x="101%" y="15" width="100%" height="5" />
                        <rect x="101%" y="20" width="100%" height="5" />
                        <rect x="101%" y="25" width="100%" height="5" />
                        <rect x="101%" y="30" width="100%" height="5" />
                        <rect x="101%" y="35" width="100%" height="5" />
                        <rect x="101%" y="40" width="100%" height="5" />
                        <rect x="101%" y="45" width="100%" height="5" />
                      </g>
                    </svg>
                  </label>
                </li>
              </ul>
            </div>
            {/* Optionally include mobile nav toggle */}
            {/* <div className="nav-toggle" id="nav-toggle" onClick={handleToggleMenu}>
              <i className="bx bx-menu"></i>
            </div> */}
          </nav>
        </header>

        <Routes>
          <Route path="/login" element={
            <Suspense fallback={<LoadingSpinner />}>
              <Login />
            </Suspense>
          } />
          <Route path="/dashboard" element={
            <Suspense fallback={<LoadingSpinner />}>
              <ProtectedRoute>
                <ManagementDashboard />
              </ProtectedRoute>
            </Suspense>
          } />
          <Route path="/management" element={
            <Suspense fallback={<LoadingSpinner />}>
              <ProtectedRoute>
                <ManagementPage />
              </ProtectedRoute>
            </Suspense>
          } />
          <Route path="/communication" element={
            <Suspense fallback={<LoadingSpinner />}>
              <ProtectedRoute>
                <CommunicationPage />
              </ProtectedRoute>
            </Suspense>
          } />
          <Route path="/" element={
            <main className="l-main">
              {/* HOME SECTION */}
              <section className="home bd-grid" id="home">
                <div className="home-content">
                  <div className="home-data">
                    <h1 className="home-title">
                      This is <br />
                      <span className="glitch home-title-color" data-text="NextGem">NextGem</span>
                      <br />
                    </h1>
                    {/* Contact button scrolls to the contact section */}
                    <button className="contactButton" onClick={scrollToContact}>
                      Contact
                      <div className="star-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          xmlSpace="preserve"
                          version="1.1"
                          style={svgStyle}
                          viewBox="0 0 784.11 815.53"
                          xmlnsXlink="http://www.w3.org/1999/xlink"
                        >
                          <defs></defs>
                          <g id="Layer_x0020_1">
                            <metadata id="CorelCorpID_0Corel-Layer"></metadata>
                            <path className="fil0" d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z" />
                          </g>
                        </svg>
                      </div>
                      <div className="star-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          xmlSpace="preserve"
                          version="1.1"
                          style={svgStyle}
                          viewBox="0 0 784.11 815.53"
                          xmlnsXlink="http://www.w3.org/1999/xlink"
                        >
                          <defs></defs>
                          <g id="Layer_x0020_1">
                            <metadata id="CorelCorpID_0Corel-Layer"></metadata>
                            <path className="fil0" d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z" />
                          </g>
                        </svg>
                      </div>
                      <div className="star-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          xmlSpace="preserve"
                          version="1.1"
                          style={svgStyle}
                          viewBox="0 0 784.11 815.53"
                          xmlnsXlink="http://www.w3.org/1999/xlink"
                        >
                          <defs></defs>
                          <g id="Layer_x0020_1">
                            <metadata id="CorelCorpID_0Corel-Layer"></metadata>
                            <path className="fil0" d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z" />
                          </g>
                        </svg>
                      </div>
                      <div className="star-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          xmlSpace="preserve"
                          version="1.1"
                          style={svgStyle}
                          viewBox="0 0 784.11 815.53"
                          xmlnsXlink="http://www.w3.org/1999/xlink"
                        >
                          <defs></defs>
                          <g id="Layer_x0020_1">
                            <metadata id="CorelCorpID_0Corel-Layer"></metadata>
                            <path className="fil0" d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z" />
                          </g>
                        </svg>
                      </div>
                      <div className="star-5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          xmlSpace="preserve"
                          version="1.1"
                          style={svgStyle}
                          viewBox="0 0 784.11 815.53"
                          xmlnsXlink="http://www.w3.org/1999/xlink"
                        >
                          <defs></defs>
                          <g id="Layer_x0020_1">
                            <metadata id="CorelCorpID_0Corel-Layer"></metadata>
                            <path className="fil0" d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z" />
                          </g>
                        </svg>
                      </div>
                      <div className="star-6">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          xmlSpace="preserve"
                          version="1.1"
                          style={svgStyle}
                          viewBox="0 0 784.11 815.53"
                          xmlnsXlink="http://www.w3.org/1999/xlink"
                        >
                          <defs></defs>
                          <g id="Layer_x0020_1">
                            <metadata id="CorelCorpID_0Corel-Layer"></metadata>
                            <path className="fil0" d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z" />
                          </g>
                        </svg>
                      </div>
                    </button>
                  </div>

                  {/* All social icons in one container */}
                  <div className="home-social">
                    <a href="https://www.tiktok.com/@nextgemagency_?_t=ZS-8tr0VGTNNmp&_r=1" className="home-social-icon">
                      <i className="bx bxl-tiktok"></i>
                    </a>
                    <a href="https://www.instagram.com/nextgemagency?igsh=bjExOG1qd215MXpi&utm_source=qr" className="home-social-icon">
                      <i className="bx bxl-instagram"></i>
                    </a>
                    <a href="https://www.facebook.com/share/18LhroPBFo/?mibextid=wwXIfr" className="home-social-icon">
                      <i className="bx bxl-facebook"></i>
                    </a>
                    <a href="https://www.linkedin.com/company/nextgem-agency/" className="home-social-icon">
                      <i className="bx bxl-linkedin"></i>
                    </a>
                  </div>
                </div>

                <div className="home-animation">
                  <CubeAnimation />
                </div>

                {/* <div className="home-img"> */}
                  {/* <img
                    src={LOGO2}
                    alt="NextGem Profile"
                    width={500}
                    height={500}
                  /> */}
                {/* </div> */}
              </section>

              {/* ABOUT SECTION */}
              <section className="about section" id="about">
                <h2 className="section-title">About</h2>
                <div className="about-container bd-grid">
                  {/* <div className="about-img">
                    <img
                      src={AboutLogo}
                      alt="About"
                    />
                  </div> */}
                  <div>
                    <h2 className="about-subtitle">
                      At NextGem, we specialize in branding, social media marketing, content creation, and digital strategies for all businesses. With expertise in brand positioning and digital storytelling, we help businesses build credibility, generate leads, and convert online engagement into real sales.
                    </h2>
                  </div>
                  <div className="geometric-images">
                    <img src={Geometric1} alt="Geometric Shape 1" className="geometric-image" />
                    <img src={Geometric2} alt="Geometric Shape 2" className="geometric-image" />
                    <img src={Geometric3} alt="Geometric Shape 3" className="geometric-image" />
                  </div>
                </div>
              </section>

              {/* Services */}
              <section id="services" className="section">
                <h2 className="section-title">Services</h2>
                <HomeServicesSection/>
              </section>

              {/* Client */}
              <section id="clients" className="section">
                <h2 className="section-title">Clients</h2>
                <ClientsCarousel />
              </section>

              {/* CONTACT SECTION */}
              <div id="contact" className="background">
                <div className="container">
                  <div className="screen">
                    <div className="screen-header">
                      <div className="screen-header-left">
                        <div className="screen-header-button close"></div>
                        <div className="screen-header-button maximize"></div>
                        <div className="screen-header-button minimize"></div>
                      </div>
                      <div className="screen-header-right">
                        <div className="screen-header-ellipsis"></div>
                        <div className="screen-header-ellipsis"></div>
                        <div className="screen-header-ellipsis"></div>
                      </div>
                    </div>
                    <div className="screen-body">
                      <div className="screen-body-item left">
                        <div className="app-title">
                          <span>CONTACT US</span>
                          <span></span>
                        </div>
                        <div className="app-contact">CONTACT INFO : creative@nextgem.agency</div>
                      </div>
                      <div className="screen-body-item">
                        <ContactForm />
                      </div>
                    </div>
                  </div>          
                </div>
              </div>
            </main>
          } />
          <Route path="*" element={
            <Suspense fallback={<LoadingSpinner />}>
              <NotFound />
            </Suspense>
          } />
        </Routes>

        {/* FOOTER */}
        <footer className="footer">
          <p className="footer-title">NextGem</p>
          <div className="footer-social">
            <a href="#!" className="footer-icon">
              <i className="bx bxl-facebook"></i>
            </a>
            <a href="#!" className="footer-icon">
              <i className="bx bxl-instagram"></i>
            </a>
            <a href="#!" className="footer-icon">
              <i className="bx bxl-twitter"></i>
            </a>
          </div>
          <p>&#169; 2025 Copyright all rights reserved</p>
        </footer>

        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </>
    </Router>
  );
}

export default App;
