import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  
    pass: process.env.EMAIL_PASS,  
  },
});

export const sendEmail = (doctorName, pdfBuffer) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,  
    to: `${doctorName}@example.com`,  
    subject: 'New Prescription for Your Patient',
    text: 'Please find the attached prescription.',
    attachments: [
      {
        filename: 'prescription.pdf',
        content: pdfBuffer,
      },
    ],
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};
