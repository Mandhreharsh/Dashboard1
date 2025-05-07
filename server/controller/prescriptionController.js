import nodemailer from 'nodemailer';
import pdfkit from 'pdfkit';
import { Prescription } from '../models/Prescription.js';
import PDFDocument from 'pdfkit';
import 'dotenv/config';
import fs from 'fs'; 
import puppeteer from 'puppeteer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generatePrescriptionPDF = (prescription) => {
  return new Promise((resolve, reject) => {
    try {
    const doc = new PDFDocument({ margin: 50 });
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err) => reject(err));

      // Add styling and header
    doc.fontSize(20).fillColor('#000').text('Health', { continued: true }).fillColor('#6a5acd').text('Axis', { align: 'center' });
    doc.moveDown(0.2);
      doc.fontSize(18).fillColor('#000').text("Doctor's Prescription Note", { align: 'center' });
    doc.moveDown();

      // Doctor information
      doc.fontSize(12).text(`Prepared by: ${prescription.doctorName || 'Not specified'}`);
      doc.text(`Email: ${prescription.doctorEmail || 'Not specified'}`);
      doc.text(`Contact: ${prescription.doctorContact || 'Not specified'}`);
    doc.moveDown();

      // Patient Information section
      doc.fontSize(14).fillColor('#000').text('I. Patient Information', { bold: true });
    doc.moveDown(0.5);

    const patientInfo = [
        ['Patient Name', prescription.patientName || 'Not specified'],
        ['Date of Birth', prescription.dateOfBirth || 'Not specified'],
        ['Address', prescription.address || 'Not specified'],
        ['Contact Number', prescription.contactNumber || 'Not specified'],
        ['Email', prescription.patientEmail || 'Not specified'],
        ['Date of Prescription', prescription.prescriptionDate || 'Not specified'],
    ];

    generateTable(doc, patientInfo, ['Field', 'Details']);
    doc.moveDown();

      // Medication Details section
      doc.fontSize(14).fillColor('#000').text('II. Medication Details');
    doc.moveDown(0.5);

    const medHeader = ['Medication Name', 'Dosage', 'Frequency', 'Quantity', 'Refills'];
      
      // Ensure medicines array exists and is valid
      const medicinesArray = Array.isArray(prescription.medicines) ? prescription.medicines : [];
      
      if (medicinesArray.length === 0) {
        doc.text('No medications specified', { italic: true });
      } else {
        const medRows = medicinesArray.map(med => [
          med.name || 'Not specified', 
          med.dosage || 'Not specified', 
          med.frequency || 'Not specified', 
          med.quantity || 'Not specified', 
          med.refills || 'Not specified'
    ]);

    generateTable(doc, medRows, medHeader);
      }
      
    doc.moveDown();

      // Additional Information section
      doc.fontSize(14).fillColor('#000').text('III. Additional Information');
    doc.moveDown(0.5);
      doc.fontSize(12).text(`Doctor's Name: ${prescription.doctorName || 'Not specified'}`);
      doc.text(`Contact Number: ${prescription.doctorContact || 'Not specified'}`);
      doc.text(`Date: ${prescription.prescriptionDate || 'Not specified'}`);
      
      // Add footer
      doc.moveDown(2);
      doc.fontSize(10).text('This prescription is valid for 30 days from the date of issue.', { align: 'center', italic: true });
      doc.text('If you have any questions, please contact your doctor.', { align: 'center', italic: true });

    doc.end();
    } catch (error) {
      console.error("Error generating PDF:", error);
      reject(error);
    }
  });
};

// Helper: Table Generator
const generateTable = (doc, rows, headers) => {
  try {
  const tableTop = doc.y;
  const cellPadding = 5;
    

    const colWidths = [];
    if (headers.length === 2) {
      colWidths.push(150, 350); 
    } else {
  
      const availableWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
      const colWidth = Math.floor(availableWidth / headers.length);
      for (let i = 0; i < headers.length; i++) {
        colWidths.push(colWidth);
      }
    }
    
  const startX = doc.page.margins.left;


  doc.font('Helvetica-Bold').fontSize(12);
  headers.forEach((header, i) => {
    doc.rect(startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0), tableTop, colWidths[i], 20).stroke();
      doc.text(
        header, 
        startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0) + cellPadding, 
        tableTop + cellPadding,
        { width: colWidths[i] - (2 * cellPadding), align: 'left' }
      );
  });


  let y = tableTop + 20;
  doc.font('Helvetica').fontSize(12);
    
  rows.forEach(row => {
      let rowHeight = 20; 
      

    row.forEach((cell, i) => {
        const cellText = String(cell || '');
        const textHeight = doc.heightOfString(cellText, {
          width: colWidths[i] - (2 * cellPadding)
        });
        rowHeight = Math.max(rowHeight, textHeight + (2 * cellPadding));
      });
      
     
      row.forEach((cell, i) => {
        const cellText = String(cell || '');
        doc.rect(
          startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0), 
          y, 
          colWidths[i], 
          rowHeight
        ).stroke();
        
        doc.text(
          cellText,
          startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0) + cellPadding,
          y + cellPadding,
          { width: colWidths[i] - (2 * cellPadding), align: 'left' }
        );
      });
      
      y += rowHeight;
    });

    doc.moveDown();
  } catch (error) {
    console.error("Error generating table:", error);
    doc.text("Error generating table", { italic: true });
  doc.moveDown();
  }
};

const sendPrescription = async (req, res) => {
  const { 
    doctorEmail, 
    patientEmail, 
    patientName, 
    dateOfBirth,
    address,
    contactNumber,
    prescriptionDate,
    doctorName,
    doctorContact,
    medicines,
    htmlContent
  } = req.body;


  if (!patientEmail) {
    return res.status(400).json({ message: 'Patient email is required' });
  }

  if (!patientName) {
    return res.status(400).json({ message: 'Patient name is required' });
  }

  try {
    let pdfBuffer;
    let browser = null;
    let tempHtmlPath = null;

   
    const startTime = Date.now();

    
    if (htmlContent) {
      console.log("Generating PDF from HTML content");
      try {
     
        browser = await puppeteer.launch({
          headless: 'new', 
          args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
          defaultViewport: {
            width: 1024,
            height: 1200,
            deviceScaleFactor: 1,
          }
        });
        
        const page = await browser.newPage();
        
        
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      
        pdfBuffer = await page.pdf({
          format: 'A4',
          printBackground: true,
          margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' },
          preferCSSPageSize: true,
        });
        
        console.log(`PDF generated successfully in ${Date.now() - startTime}ms`);
      } catch (pdfError) {
        console.error("Error generating PDF from HTML:", pdfError);
        
       
        console.log("Falling back to standard PDF generation");
        pdfBuffer = await generateStandardPDF();
      } finally {
        
        if (browser) {
          await browser.close();
          console.log("Browser closed");
        }
        
    
        if (tempHtmlPath && fs.existsSync(tempHtmlPath)) {
          fs.unlinkSync(tempHtmlPath);
          console.log("Temporary HTML file deleted");
        }
      }
    } else {
      pdfBuffer = await generateStandardPDF();
    }

    const subject = `Medical Prescription for ${patientName}`;
    const attachments = [
      {
        filename: `prescription_${patientName.replace(/\s+/g, '_')}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }
    ];

    const prescription = new Prescription({
      patientName,
      doctorName,
      doctorEmail,
      patientEmail,
      dateOfBirth,
      address,
      contactNumber,
      prescriptionDate,
      doctorContact,
      medicines,
    });

    await prescription.save();
    console.log(`Prescription saved to database with ID: ${prescription._id}`);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: patientEmail,
      subject,
      text: `Hello ${patientName},

Please find your medical prescription from Dr. ${doctorName || 'your doctor'} attached to this email.

This is an automatically generated email. Please do not reply to this message.

Regards,
HealthAxis Medical Team`,
      attachments,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${patientEmail}, ID: ${info.messageId}`);

    return res.status(200).json({ 
      message: 'Prescription sent successfully!',
      prescriptionId: prescription._id
    });
  } catch (error) {
    console.error('Error sending prescription:', error);
    return res.status(500).json({ 
      message: 'Failed to send prescription', 
      error: error.message 
    });
  }

  async function generateStandardPDF() {
    console.log("Using standard PDF generation");
    return await generatePrescriptionPDF({
      patientName,
      doctorName,
      doctorEmail,
      patientEmail,
      dateOfBirth,
      address,
      contactNumber,
      prescriptionDate,
      doctorContact,
      medicines,
    });
  }
};

const createPrescription = async (req, res) => {
  const { patientName, doctorName, doctorEmail, patientEmail, medicines } = req.body;

  try {
    if (!Array.isArray(medicines) || medicines.length === 0) {
      return res.status(400).json({ message: 'Medicines must be an array and cannot be empty.' });
    }

    const prescription = new Prescription({
      patientName,
      doctorName,
      doctorEmail,
      patientEmail,
      medicines,
    });

    await prescription.save();
    res.status(201).json({ message: 'Prescription created successfully!' });
  } catch (error) {
    console.error('Error creating prescription:', error);
    res.status(500).json({ message: error.message });
  }
};

const getPrescriptionHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const searchTerm = req.query.search || '';
    const skip = (page - 1) * limit;
    
    const searchFilter = searchTerm ? {
      $or: [
        { patientName: { $regex: searchTerm, $options: 'i' } },
        { doctorName: { $regex: searchTerm, $options: 'i' } },
        { patientEmail: { $regex: searchTerm, $options: 'i' } }
      ]
    } : {};
    
    const [totalCount, prescriptions] = await Promise.all([
      Prescription.countDocuments(searchFilter),
      Prescription.find(searchFilter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-__v')
        .lean()
    ]);
    
    res.status(200).json({
      prescriptions,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit)
    });
  } catch (error) {
    console.error('Error fetching prescription history:', error);
    res.status(500).json({ message: 'Failed to fetch prescription history', error: error.message });
  }
};


const downloadPrescription = async (req, res) => {
  const { id } = req.params;
  
  try {

    const prescription = await Prescription.findById(id);
    
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    
    const pdfBuffer = await generatePrescriptionPDF(prescription);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Prescription_${prescription.patientName.replace(/\s+/g, '_')}.pdf`);
    

    res.status(200).send(pdfBuffer);
  } catch (error) {
    console.error('Error downloading prescription:', error);
    res.status(500).json({ message: 'Failed to download prescription', error: error.message });
  }
};

// Resend a prescription email
const resendPrescription = async (req, res) => {
  const { id } = req.params;
  
  try {
   
    const prescription = await Prescription.findById(id);
    
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    

    const pdfBuffer = await generatePrescriptionPDF(prescription);
    

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: prescription.patientEmail,
      subject: `Medical Prescription for ${prescription.patientName}`,
      text: `Hello ${prescription.patientName},

Please find your medical prescription from Dr. ${prescription.doctorName} attached to this email.

This is an automatically generated email. Please do not reply to this message.

Regards,
HealthAxis Medical Team`,
      attachments: [
        {
          filename: `prescription_${prescription.patientName.replace(/\s+/g, '_')}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        },
      ],
    };


    const info = await transporter.sendMail(mailOptions);
    console.log("Prescription resent, email ID:", info.messageId);
    
    res.status(200).json({ message: 'Prescription resent successfully!' });
  } catch (error) {
    console.error('Error resending prescription:', error);
    res.status(500).json({ message: 'Failed to resend prescription', error: error.message });
  }
};

// Delete a prescription
const deletePrescription = async (req, res) => {
  const { id } = req.params;
  
  try {

    const prescription = await Prescription.findById(id);
    
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    

    const patientName = prescription.patientName || 'Unknown patient';
    

    await Prescription.findByIdAndDelete(id);
    
    console.log(`Prescription for ${patientName} deleted successfully`);
    
    res.status(200).json({ message: 'Prescription deleted successfully' });
  } catch (error) {
    console.error('Error deleting prescription:', error);
    res.status(500).json({ message: 'Failed to delete prescription', error: error.message });
  }
};

export default { createPrescription, sendPrescription, getPrescriptionHistory, downloadPrescription, resendPrescription, deletePrescription };
