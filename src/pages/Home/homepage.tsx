/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import "./homepage.css";

// Dynamically import all images in carousel folder
const imageModules = import.meta.glob("/src/assets/carousel/*.{jpg,png}", {
  eager: true,
});

const carouselImages = Object.values(imageModules).map(
  (mod: any) => mod.default
);

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reload if returning from back/forward navigation
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        window.location.reload();
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  // Cycle images every few seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-container">
      <div className="carousel-container">
        <Navbar />
        {carouselImages.map((img, index) => (
          <div
            key={index}
            className={`carousel-image ${
              index === currentIndex ? "visible" : ""
            }`}
            style={{ backgroundImage: `url(${img})` }}
          ></div>
        ))}
      </div>

      {/* Text overlay (above carousel) */}
      <div className="landing-text">
        <h1>Hey There, User</h1><br />
        <p>Welcome to <b>Weather Now</b>, your quick and reliable companion for checking the weather in any city worldwide. Designed for speed and simplicity, it gives you instant access to accurate forecasts with just a few clicks.</p>
        <p>Stay prepared for your day, whether it's sunshine, rain, or snow. With it's clean interface and contrasting themes, <b>Weather Now</b> makes weather checking effortless and visually appealing.</p>
      </div>
    </div>
  );
}
