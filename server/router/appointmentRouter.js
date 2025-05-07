import express from "express";
import {  postAppointment, getAllAppointments} from "../controller/appointmentController.js";
import { sendAppointmentEmail } from  "../controller/appointmentController.js";
import { deleteAppointment } from "../controller/appointmentController.js";

const router = express.Router();

router.post("/post", postAppointment);
router.get("/getall",  getAllAppointments);
router.post("/send-email", sendAppointmentEmail);
router.delete('/delete/:id', deleteAppointment);

export default router;