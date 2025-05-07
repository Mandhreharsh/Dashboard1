import express from 'express';
import prescriptionController from '../controller/prescriptionController.js';

const router = express.Router();

router.post('/', prescriptionController.createPrescription);

router.post('/send', prescriptionController.sendPrescription);

router.get('/history', prescriptionController.getPrescriptionHistory);

router.get('/download/:id', prescriptionController.downloadPrescription);

router.post('/resend/:id', prescriptionController.resendPrescription);

router.delete('/delete/:id', prescriptionController.deletePrescription);

export default router;
