import mongoose from "mongoose";
import validator from "validator";

const messageSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength:[3, "First Name must contain At least 3 Characters"]
    },
    lastName: {
        type: String,
        required: true,
        minLength:[3, "First Name must contain At least 3 Characters"]
    },
    email: {
        type: String,
        required: true,
        validate: [validator.isEmail, "Please Provide a valid email"]
    },
    Phone: {
        type: Number,
        required: true,
        minLength:[11, "Phone number contain Exact 11 Digits"],
        maxLength:[11, "Phone number contain Exact 11 Digits"],
    },
    message: {
        type: String,
        required: true,
        minLength:[10, "Message Must Contain At least 10 characters"]
    },
});


export const Message = mongoose.model("Message", messageSchema);