import {catchAsyncErrors} from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import {Appointment} from "../models/appointmentSchema.js";
import nodemailer from "nodemailer";

export const postAppointment = catchAsyncErrors(async(req, res, next) => {
  const {

      firstName,
      lastName,
      email,
      Phone,
      dob,
      gender,
      appointment_date,
      department,
      doctor,
      address
  } = req.body;
  if (
      !firstName ||
      !lastName ||
      !email ||
      !Phone ||
      !dob ||
      !gender ||
      !appointment_date ||
      !department ||
      !doctor ||
      !address 
  ){
      return next(new ErrorHandler("Please Fill full Form!", 400));
  }
  
  const appointment = await Appointment.create({
      firstName,
      lastName,
      email,
      Phone,
      dob,
      gender,
      appointment_date,
      department,
      doctor,
      address
  });
  res.status(200).json({
      success: true,
      message: "Appointment Sent Successfully",
      appointment,
  });
});

export const getAllAppointments = catchAsyncErrors(async (req, res, next) => {
    const appointments = await Appointment.find();
    res.status(200).json({
        success: true,
        appointments, 
    });
});



export const sendAppointmentEmail = async (req, res) => {
    console.log("Email request received:", req.body);
  
    const { email, firstName, lastName, status, appointment_date, doctor, department } = req.body;
  
    if (!email || !firstName || !lastName || !status || !appointment_date || !doctor || !department) {
      console.log("Missing fields in request:", {
        email: !!email,
        firstName: !!firstName,
        lastName: !!lastName,
        status: !!status,
        appointment_date: !!appointment_date,
        doctor: !!doctor,
        department: !!department
      });
      return res.status(400).json({ message: "Missing required fields" });
    }
  
    try {
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
  
      let formattedDate;
      try {
        formattedDate = new Date(appointment_date).toLocaleString();
      } catch (error) {
        console.error("Date formatting error:", error);
        formattedDate = appointment_date;
      }
  
      const subject = `Appointment Status: ${status}`;
      const html = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
    <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #f0f0f0;">
      <h1 style="color: #2c3e50; margin: 0;">HealthAxis</h1>
      <p style="color: #7f8c8d; margin: 5px 0 0;">Healthcare Management System</p>
    </div>
    
    <div style="padding: 20px 0;">
      <p style="font-size: 16px; color: #34495e;">Dear ${firstName} ${lastName},</p>
      
      <p style="font-size: 16px; color: #34495e;">We are writing to inform you about your recent appointment request with our healthcare facility.</p>
      
      <div style="background-color: #f8f9fa; border-left: 4px solid ${
        status === "Accepted" ? "#2ecc71" : status === "Rejected" ? "#e74c3c" : "#f39c12"
      }; padding: 15px; margin: 20px 0;">
        <p style="font-size: 16px; margin: 0 0 10px; color: #34495e;">
          <strong>Appointment Status:</strong> 
          <span style="color: ${
            status === "Accepted" ? "#2ecc71" : status === "Rejected" ? "#e74c3c" : "#f39c12"
          }; font-weight: bold;">${status}</span>
        </p>
        
        <table style="width: 100%; font-size: 15px; color: #34495e; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0;"><strong>Specialist:</strong></td>
            <td style="padding: 8px 0;">Dr. ${doctor}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Department:</strong></td>
            <td style="padding: 8px 0;">${department}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Date & Time:</strong></td>
            <td style="padding: 8px 0;">${formattedDate}</td>
          </tr>
        </table>
      </div>
      
      ${status === "Accepted" ? `
        <p style="font-size: 16px; color: #34495e;">Please arrive 15 minutes before your scheduled appointment time. Remember to bring your identification and insurance information.</p>
      ` : status === "Rejected" ? `
        <p style="font-size: 16px; color: #34495e;">We apologize for any inconvenience this may cause. Please contact our scheduling department at (555) 123-4567 if you would like to arrange an alternative appointment time.</p>
      ` : `
        <p style="font-size: 16px; color: #34495e;">Your appointment is currently under review. We will update you as soon as possible.</p>
      `}
      
      <p style="font-size: 16px; color: #34495e;">If you need to modify or cancel this appointment, please contact us at least 24 hours in advance at (555) 123-4567 or reply to this email.</p>
    </div>
    
    <div style="padding-top: 20px; border-top: 2px solid #f0f0f0; color: #7f8c8d; font-size: 14px;">
      <p style="margin: 0 0 10px;">Thank you for choosing HealthAxis for your healthcare needs.</p>
      <p style="margin: 0;">Regards,</p>
      <p style="margin: 5px 0 0; font-weight: bold;">HealthAxis Patient Services</p>
      <p style="margin: 5px 0 0;">Email: support@healthaxis.com | Phone: (555) 123-4567</p>
    </div>
    
    <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #95a5a6;">
      <p>This is an automated message, please do not reply directly to this email.</p>
      <p>© 2025 HealthAxis. All rights reserved.</p>
    </div>
  </div>
`;
  
      await transporter.sendMail({
        from: `"HealthAxis" <${process.env.EMAIL_USER}>`,
        to: email,
        subject,
        html,
      });
  
      console.log("Email sent successfully to:", email);
      res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
      console.error("Email send failed:", error);
      res.status(500).json({ message: "Failed to send email: " + error.message });
    }
  };


  export const deleteAppointment = async (req, res) => {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: "Appointment ID is required" });
    }
  
    try {
      const appointment = await Appointment.findById(id);
      
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      
      await Appointment.findByIdAndDelete(id);
      
      console.log(`Appointment deleted: ${id} for patient ${appointment.firstName} ${appointment.lastName}`);
      
      return res.status(200).json({ 
        success: true, 
        message: "Appointment cancelled successfully" 
      });
    } catch (error) {
      console.error("Error deleting appointment:", error);
      return res.status(500).json({ 
        message: "Failed to cancel appointment", 
        error: error.message 
      });
    }
  };