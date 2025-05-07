import React, { useEffect, useState } from "react";
import staffIcon from "../images/staffIcon.png";
import "../css/Doctors.css";

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        fetch("/data.json")
            .then((response) => response.json())
            .then((data) => setDoctors(data.doctors))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    return (
        <div className="doctors-container ">
            <div className="doctors-header">
                <img className="staff-icon" src={staffIcon} alt="Staff Icon" />
                <h1 className="staff-title">Staff</h1>
            </div>
            
            <div className="doctors-grid">
                {doctors.map((doctor, index) => (
                    <div key={index} className="doctor-card">
                        <img
                            src={doctor.image}
                            alt={doctor.name}
                            className="doctor-avatar"
                        />
                        <h2 className="doctor-name">{doctor.name}</h2>
                        <p className="doctor-email">{doctor.email}</p>
                        <div className="doctor-department">{doctor.Department}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Doctors;
