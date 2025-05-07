const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const handlebars = require('handlebars');

exports.generatePDF = async (prescription) => {
  try {
    const templatePath = path.join(__dirname, 'templates', 'prescription-template.html');
    const templateHtml = fs.readFileSync(templatePath, 'utf-8');
    
    const template = handlebars.compile(templateHtml);
    const html = template(prescription);
    
    const browser = await puppeteer.launch({
      headless: 'new'
    });
    const page = await browser.newPage();
    
    await page.setContent(htmlContent);
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });
    
    await browser.close();
    
    fs.writeFileSync('./prescription.pdf', pdfBuffer);
    
    return pdfBuffer;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};