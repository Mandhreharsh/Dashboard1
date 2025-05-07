import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: [3, "Name must contain at least 3 characters"],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
        type: String,
        minLength: [8, "Password must contain at least 8 characters"],
        required: true,
        select: false,
    },
    doctorDepartment: {
        type: String,
    },
    docAvatar: {
        public_id: String,
        url: String,
    },
    otp: {
        type: String,
        select: false,
    },
    otpCreatedAt: {
        type: Date,
        select: false,
    },
}, { timestamps: true });

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// JWT generation method
userSchema.methods.generateJsonWebToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES,
    });
};

// OTP generation method
userSchema.methods.generateOtp = async function () {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.otp = otp;
    this.otpCreatedAt = Date.now();
    await this.save();
    return otp;
};

// OTP verification
userSchema.methods.isOtpValid = function (enteredOtp) {
    if (!this.otp || !this.otpCreatedAt) return false;
    const now = new Date();
    const otpAge = (now - this.otpCreatedAt) / (1000 * 60);
    return this.otp === enteredOtp && otpAge <= 5;
};

// Clear OTP after verification
userSchema.methods.clearOtp = async function () {
    this.otp = undefined;
    this.otpCreatedAt = undefined;
    await this.save();
};

export const User = mongoose.model("User", userSchema);
