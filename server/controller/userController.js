import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";
import { generateToken } from "../utils/jwtToken.js";
import sendEmail  from "../utils/sendEmail.js";

// ------------------ Register ------------------
export const patientRegister = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return next(new ErrorHandler("Please fill the full form", 400));
    }

    let user = await User.findOne({ email });
    if (user) {
        return next(new ErrorHandler("User already registered", 400));
    }

    user = await User.create({ name, email, password });

    res.status(201).json({
        success: true,
        message: "User registered successfully. Please login to receive OTP.",
    });
});

// ------------------ Login (send OTP) ------------------
export const login = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Please provide all details", 400));
    }

    const user = await User.findOne({ email }).select("+password +otp +otpCreatedAt");

    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 400));
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 400));
    }

    // OTP reuse within 5 min
    if (user.otp && user.otpCreatedAt) {
        const otpAge = (Date.now() - user.otpCreatedAt) / (1000 * 60);
        if (otpAge < 5) {
            return res.status(200).json({
                success: true,
                message: "OTP already sent. Please check your email.",
            });
        }
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpCreatedAt = Date.now();
    await user.save();

    await sendEmail(email, `Your OTP is ${otp}`);

    res.status(200).json({
        success: true,
        message: "OTP sent to your email for verification.",
    });
});

// ------------------ Verify OTP ------------------
export const verifyOtp = catchAsyncErrors(async (req, res, next) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return next(new ErrorHandler("Please provide email and OTP", 400));
    }

    const user = await User.findOne({ email }).select("+otp +otpCreatedAt");

    if (!user || !user.otp || !user.otpCreatedAt) {
        return next(new ErrorHandler("OTP not found", 404));
    }

    const otpAge = (Date.now() - user.otpCreatedAt) / (1000 * 60);
    if (user.otp !== otp || otpAge > 5) {
        return next(new ErrorHandler("Invalid or expired OTP", 400));
    }

    // Clear OTP after verification
    user.otp = undefined;
    user.otpCreatedAt = undefined;
    await user.save();

    generateToken(user, "OTP verified successfully!", 200, res);
});

// ------------------ Logout ------------------
export const logoutPatient = catchAsyncErrors(async (req, res, next) => {
    res.status(200)
        .cookie("patientToken", "", {
            httpOnly: true,
            expires: new Date(Date.now()),
        })
        .json({
            success: true,
            message: "User logged out successfully",
        });
});

// ------------------ Resend OTP ------------------
export const resendOtp = catchAsyncErrors(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(new ErrorHandler("Please provide an email", 400));
    }

    const user = await User.findOne({ email }).select("+otp +otpCreatedAt");

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpCreatedAt = Date.now();
    await user.save();

    await sendEmail(email, `Your new OTP is ${otp}`);

    res.status(200).json({
        success: true,
        message: "New OTP sent successfully.",
    });
});
