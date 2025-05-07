import mongoose from "mongoose";
import validator from "validator";

const appointmentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: [3, "First Name must contain at least 3 characters"],
  },
  lastName: {
    type: String,
    required: true,
    minLength: [3, "Last Name must contain at least 3 characters"],
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  Phone: {
    type: String,  
    required: true,
    match: [/^\d{10}$/, "Phone number must be exactly 10 digits"], 
  },
  dob: {
    type: Date,
    required: [true, "Date of Birth is required"],
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female"],
  },
  appointment_date: {
    type: Date,  
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  doctor: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

export const Appointment = mongoose.model("Appointment", appointmentSchema);
