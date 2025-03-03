import React from 'react';
import Slider from 'react-slick';
import './ClientsCarousel.css';

// Import client logo images
import skoonLogo from '../../public/SKOON LOGO_.png';
import marinaLogo from '../../public/marina b.png';
import haddadLogo from '../../public/HADDAD.png';
import darwishLogo from '../../public/DARWISH.png';
import chefHannaLogo from '../../public/chef hanna.png';
import easyRentLogo from '../../public/EASY RENT.png';
import eliteLogo from '../../public/ELITE.png';
import expoAdonisLogo from '../../public/EXPO ADONIS.png';
import gemanLineLogo from '../../public/GEMAN LINE.png';
import goatLogo from '../../public/goat.png';
import itadLogo from '../../public/ITAD.png';
import moverzLogo from '../../public/LOGO Moverz-01.png';
import pariRoyalLogo from '../../public/PARI ROYAL.png';
import proCreamLogo from '../../public/pro cream.png';
import rioLogo from '../../public/RIO.png';
import tioLogo from '../../public/TIO.png';
import uFeedLogo from '../../public/u-feed.png';
import vintageClosetLogo from '../../public/vintage closet.png';
// import masterCabinLogo from '../../public/Master Cabin.png';

export default function ClientsCarousel() {
  // Array of logos using imported images as src
  const logos = [
    { src: skoonLogo, alt: 'Client 1' },
    { src: marinaLogo, alt: 'Client 2' },
    { src: haddadLogo, alt: 'Client 3' },
    { src: darwishLogo, alt: 'Client 4' },
    { src: chefHannaLogo, alt: 'Client 5' },
    { src: easyRentLogo, alt: 'Client 6' },
    { src: eliteLogo, alt: 'Client 7' },
    { src: expoAdonisLogo, alt: 'Client 8' },
    { src: gemanLineLogo, alt: 'Client 9' },
    { src: goatLogo, alt: 'Client 10' },
    { src: itadLogo, alt: 'Client 11' },
    { src: moverzLogo, alt: 'Client 12' },
    { src: pariRoyalLogo, alt: 'Client 13' },
    { src: proCreamLogo, alt: 'Client 14' },
    { src: rioLogo, alt: 'Client 15' },
    { src: tioLogo, alt: 'Client 16' },
    { src: uFeedLogo, alt: 'Client 17' },
    { src: vintageClosetLogo, alt: 'Client 18' },
    // { src: masterCabinLogo, alt: 'Client 19' },
  ];

  // Slider settings for react-slick
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Show 3 logos at a time
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className="clients-carousel">
      {/* <h2 style={{ color: "#fff", marginBottom: "10%" }}>Our Clients</h2> */}
      <Slider {...settings}>
        {logos.map((logo, index) => (
          <div key={index} className="client-logo">
            <img src={logo.src} alt={logo.alt} />
          </div>
        ))}
      </Slider>
    </div>
  );
}
