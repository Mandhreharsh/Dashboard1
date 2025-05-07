import React, { useEffect, useState } from "react";
import AppointmentIcon from '../images/AppointmentIcon.png';
import axios from "axios";

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get("https://dashboard1-yhmt.onrender.com/api/v1/appointment/getall", { withCredentials: true });
      setAppointments(data.appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setAppointments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowPopup(true);
  };

  const handleDeleteClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDeletePopup(true);
  };

  const handleConfirmSend = async () => {
    if (!selectedAppointment) return;
    const appointmentDate = selectedAppointment.appointment_date;

    try {
      await axios.post("https://dashboard1-yhmt.onrender.com/api/v1/appointment/send-email", {
        email: selectedAppointment.email,
        firstName: selectedAppointment.firstName,
        lastName: selectedAppointment.lastName,
        status: selectedAppointment.status,
        appointment_date: appointmentDate,
        doctor: selectedAppointment.doctor,
        department: selectedAppointment.department
      }, { withCredentials: true });

      alert("Email sent successfully!");
    } catch (error) {
      console.error("Send email error:", error);
      alert(`Failed to send email: ${error.response?.data?.message || error.message}`);
    }

    setShowPopup(false);
    setSelectedAppointment(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedAppointment) return;

    try {
      await axios.delete(`https://dashboard1-yhmt.onrender.com/api/v1/appointment/delete/${selectedAppointment._id}`, {
        withCredentials: true
      });

      setAppointments(appointments.filter(a => a._id !== selectedAppointment._id));
      alert("Appointment cancelled successfully!");

      try {
        await axios.post("https://dashboard1-yhmt.onrender.com/api/v1/appointment/send-email", {
          email: selectedAppointment.email,
          firstName: selectedAppointment.firstName,
          lastName: selectedAppointment.lastName,
          status: "Cancelled",
          appointment_date: selectedAppointment.appointment_date,
          doctor: selectedAppointment.doctor,
          department: selectedAppointment.department
        }, { withCredentials: true });

        console.log("Cancellation email sent");
      } catch (emailError) {
        console.error("Failed to send cancellation email:", emailError);
      }
    } catch (error) {
      console.error("Delete appointment error:", error);
      alert(`Failed to cancel appointment: ${error.response?.data?.message || error.message}`);
    }

    setShowDeletePopup(false);
    setSelectedAppointment(null);
  };

  const handleCancelSend = () => {
    setShowPopup(false);
    setSelectedAppointment(null);
  };

  const handleCancelDelete = () => {
    setShowDeletePopup(false);
    setSelectedAppointment(null);
  };

  return (
    <div className="bg-main4 min-h-screen w-full p-4">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <img className="h-8 w-8" src={AppointmentIcon} alt="icon" />
          <h1 className="text-xl font-semibold">Appointments</h1>
        </div>

        <div className="hidden md:flex bg-lightBlue rounded-md py-2 px-4 font-semibold justify-between text-sm md:text-base">
          <div className="w-1/6 text-center">First Name</div>
          <div className="w-1/6 text-center">Last Name</div>
          <div className="w-1/6 text-center">Date</div>
          <div className="w-1/6 text-center">Doctor</div>
          <div className="w-1/6 text-center">Department</div>
          <div className="w-1/6 text-center">Status</div>
          <div className="w-1/6 text-center">Actions</div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-auto max-h-[600px] scrollbar-hide">
          {isLoading ? (
          <div className="p-4 space-y-4">
          {[...Array(10)].map((_, index) => (
            <div
              key={index}
              className="animate-pulse bg-white shadow-md rounded-lg p-4 flex flex-wrap md:flex-nowrap items-center gap-4"
            >
              <div className="h-4 bg-gray-300 rounded w-full md:w-1/6"></div>
              <div className="h-4 bg-gray-300 rounded w-full md:w-1/6"></div>
              <div className="h-4 bg-gray-300 rounded w-full md:w-1/6"></div>
              <div className="h-4 bg-gray-300 rounded w-full md:w-1/6"></div>
              <div className="h-4 bg-gray-300 rounded w-full md:w-1/6"></div>
            </div>
          ))}
        </div>
        
          ) : (
            <div className="divide-y">
              {appointments && appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <div key={appointment._id} className="flex flex-wrap md:flex-nowrap gap-9 md:gap-0 items-center justify-between px-4 py-3 bg-lightBlue text-sm md:text-base">
                    <div className="w-full md:w-1/6 text-center">{appointment.firstName}</div>
                    <div className="w-full md:w-1/6 text-center">{appointment.lastName}</div>
                    <div className="w-full md:w-1/6 text-center">{appointment.appointment_date.substring(0, 16)}</div>
                    <div className="w-full md:w-1/6 text-center">{appointment.doctor}</div>
                    <div className="w-full md:w-1/6 text-center">{appointment.department}</div>
                    <div className="w-full md:w-1/6 text-center">
                      <select
                        className={`p-1 rounded ${
                          appointment.status === "Pending" ? "bg-yellow-100" :
                          appointment.status === "Accepted" ? "bg-green-100" :
                          "bg-red-100"
                        }`}
                        value={appointment.status}
                        onChange={(e) => {
                          setAppointments(prev => prev.map(a =>
                            a._id === appointment._id ? { ...a, status: e.target.value } : a
                          ));
                        }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                    <div className="w-full md:w-1/6 text-center flex justify-center gap-2 mt-2 md:mt-0">
                      <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        onClick={() => handleSendClick(appointment)}>
                        Send
                      </button>
                      <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        onClick={() => handleDeleteClick(appointment)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-gray-500 font-medium">No Appointments Found!</div>
              )}
            </div>
          )}
        </div>
      </div>

      {showPopup && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md text-center">
            <h2 className="text-lg font-semibold mb-3">Confirm Email Send</h2>
            <p>Send email to:</p>
            <div className="bg-gray-100 rounded p-3 my-3 text-sm text-left">
              <p><strong>Email:</strong> {selectedAppointment.email}</p>
              <p><strong>Patient:</strong> {selectedAppointment.firstName} {selectedAppointment.lastName}</p>
              <p><strong>Status:</strong> <span className={
                selectedAppointment.status === "Accepted" ? "text-green-600 font-bold" :
                selectedAppointment.status === "Rejected" ? "text-red-600 font-bold" :
                "text-yellow-600 font-bold"
              }>{selectedAppointment.status}</span></p>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded" onClick={handleConfirmSend}>Yes, Send</button>
              <button className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded" onClick={handleCancelSend}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showDeletePopup && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md text-center">
            <h2 className="text-lg font-semibold mb-3">Cancel Appointment</h2>
            <p>Are you sure you want to cancel this appointment?</p>
            <div className="bg-gray-100 rounded p-3 my-3 text-sm text-left">
              <p><strong>Patient:</strong> {selectedAppointment.firstName} {selectedAppointment.lastName}</p>
              <p><strong>Date:</strong> {selectedAppointment.appointment_date.substring(0, 16)}</p>
              <p><strong>Doctor:</strong> Dr. {selectedAppointment.doctor}</p>
              <p><strong>Department:</strong> {selectedAppointment.department}</p>
            </div>
            <p className="text-red-600">This action cannot be undone.</p>
            <div className="flex justify-center gap-4 mt-4">
              <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded" onClick={handleConfirmDelete}>Yes, Cancel</button>
              <button className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded" onClick={handleCancelDelete}>Keep</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointment;
