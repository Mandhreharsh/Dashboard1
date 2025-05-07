import express from "express"
import{ logoutPatient} from "../controller/userController.js";
import { login, patientRegister, verifyOtp, resendOtp} from "../controller/userController.js"

const router = express.Router();

router.post("/patient/register", patientRegister);
router.post("/login", login);
router.get("/patient/logout", logoutPatient);

router.post('/verify-otp', verifyOtp);

router.post("/resend-otp", resendOtp);


export default router;
