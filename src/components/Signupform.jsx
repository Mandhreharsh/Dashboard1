import React, { useContext, useState } from "react";
import { Context } from '../index';
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import "../css/Signupform.css";

const Signupform = ({ setIsLoggedIn }) => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const navigate = useNavigate();

  const [formData, setformData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  })

  function changeHandler(event) {
    setformData((prevData) => (
      {
        ...prevData,
        [event.target.name]: event.target.value
      }
    ))
  }

  async function handleSignup(event) {
    event.preventDefault();
    try {
      const response = await axios.post(
        "https://dashboard1-yhmt.onrender.com/api/auth/signup",
        {
          name: formData.name,
          email: formData.email,
          Phone: formData.phone,
          password: formData.password
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(response.data.message);
      setIsLoggedIn(false);
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="signupform-container">
      <form className="signupform" onSubmit={handleSignup}>
        <h2 className="signupform-title">Signup</h2>

        <div className="signupform-field">
          <label>Name <sup>*</sup></label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={changeHandler}
            className="signupform-input"
          />
        </div>

        <div className="signupform-field">
          <label>Email <sup>*</sup></label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={changeHandler}
            className="signupform-input"
          />
        </div>

        <div className="signupform-field">
          <label>Phone <sup>*</sup></label>
          <input
            type="text"
            name="phone"
            required
            value={formData.phone}
            onChange={changeHandler}
            className="signupform-input"
          />
        </div>

        <div className="signupform-field">
          <label>Password <sup>*</sup></label>
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={changeHandler}
            className="signupform-input"
          />
        </div>

        <button type="submit" className="signupform-button">Submit</button>

        <p className="signupform-footer">
          Already have an account?
          <span className="signupform-link" onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default Signupform;
