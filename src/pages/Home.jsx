import React from "react";
import { FaArrowRight } from "react-icons/fa6";
import DashboardImage from "../images/dashboardImage.png";
import "../css/Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate(); 

  const handleGetStartedClick = () => {
    navigate("/appointment"); 
  };
  return (
    <div className="home-container">
      <div className="home-content">
        <div className="home-left">
          <div className="home-text">
            <h1>
              Welcome To The <span className="highlight">HealthAxis</span> Dashboard
            </h1>
            <p>
              The HealthAxis Dashboard is a centralized platform designed for managing and monitoring various aspects of healthcare services. It provides an intuitive and user-friendly interface for administrators, medical professionals, and patients to access essential health-related information efficiently.
            </p>
            <button className="icon2" onClick={handleGetStartedClick}>
              GET STARTED <span className="icon"><FaArrowRight /></span>
            </button>
          </div>
        </div>
        <div className="home-right">
          <img src={DashboardImage} alt="Dashboard" />
        </div>
      </div>
    </div>
  );
};

export default Home;                                                      
