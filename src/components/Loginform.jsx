import React, { useContext, useState } from "react";
import { Context } from "../index";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import "../css/Loginform.css"; // Link to raw CSS

const Loginform = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const [formData, setformData] = useState({
    email: "", password: ""
  })

  function changeHandler(event) {
    setformData((prevData) => (
      {
        ...prevData,
        [event.target.name]: event.target.value
      }
    ))
  }

  async function handleLogin(event) {
    event.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:7000/api/auth/login",
        {
          email: formData.email,
          password: formData.password
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(response.data.message);
      localStorage.setItem("token", response.data.token);
      setIsAuthenticated(true);
      setIsLoggedIn(true);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="loginform-container">
      <form className="loginform" onSubmit={handleLogin}>
        <h2 className="loginform-title">Login</h2>

        <div className="loginform-field">
          <label>Email <sup>*</sup></label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={changeHandler}
            className="loginform-input"
          />
        </div>

        <div className="loginform-field">
          <label>Password <sup>*</sup></label>
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={changeHandler}
            className="loginform-input"
          />
        </div>

        <button type="submit" className="loginform-button">Submit</button>

        <p className="loginform-footer">
          Don't have an account?
          <span className="loginform-link" onClick={() => navigate("/signup")}>
            SignUp
          </span>
        </p>
      </form>
    </div>
  );
};

export default Loginform;
