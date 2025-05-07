import React from "react";
import LogoutIcon from "../images/logoutIcon.png";
import "../css/Logout.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Logout = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate(-1);
  };

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:5000/api/auth/logout', { withCredentials: true });
      setIsLoggedIn(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="logout-container">
      <div className="logout-box">
        <div className="logout-content">
          <div className="logout-icon-wrapper">
            <img className="logout-icon" src={LogoutIcon} alt="Logout Icon" />
          </div>

          <h1 className="logout-title">Logout</h1>
          <h2 className="logout-subtitle">Are you sure you want to logout?</h2>
        </div>

        <div className="logout-buttons">
          <button className="cancel-button" onClick={handleCancel}>Cancel</button>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
