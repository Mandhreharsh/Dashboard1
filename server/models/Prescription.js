import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
  patientName: { 
    type: String, 
    required: true 
  },
  dateOfBirth: { 
    type: String, 
    required: true 
  },
  address: { 
    type: String, 
    required: true 
  },
  contactNumber: { 
    type: String, 
    required: true 
  },
  prescriptionDate: { 
    type: String, 
    required: true 
  },
  doctorName: { 
    type: String, 
    required: true 
  },
  doctorEmail: { 
    type: String, 
    required: true 
  },
  doctorContact: { 
    type: String, 
    required: true 
  },
  patientEmail: { 
    type: String, 
    required: true 
  },
  medicines: [{
    name: { 
      type: String, 
      required: true 
    },
    dosage: { 
      type: String, 
      required: true 
    },
    frequency: { 
      type: String, 
      required: true 
    },
    quantity: { 
      type: String, 
      required: true 
    },
    refills: { 
      type: String, 
      required: true 
    }
  }],
}, { timestamps: true });

const Prescription = mongoose.model("Prescription", prescriptionSchema);

export { Prescription };
