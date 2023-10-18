const express = require('express');
const { PDFDocument } = require('pdf-lib');
const multer = require('multer');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;



app.use(express.static('public'));
app.use(express.json());

const storage = multer.diskStorage({
  destination: 'uploads',
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.post('/upload', upload.single('pdfFile'), async (req, res) => {
    try {
      // Validate and parse selected pages
      const selectedPages = req.body.pages
        .split(',')
        .map((page) => parseInt(page))
        .filter((page) => !isNaN(page) && page > 0);
  
      // Load the uploaded PDF file
      const pdfBuffer = fs.readFileSync(`uploads/${req.file.originalname}`);
      const pdfDoc = await PDFDocument.load(pdfBuffer);
  
      // Create a new PDF document for extracted pages
      const newPdfDoc = await PDFDocument.create();
  
      for (const pageNumber of selectedPages) {
        if (pageNumber <= pdfDoc.getPageCount()) {
          const [page] = await newPdfDoc.copyPages(pdfDoc, [pageNumber - 1]);
          newPdfDoc.addPage(page);
        }
      }
  
      // Serialize the new PDF as a buffer
      const pdfBytes = await newPdfDoc.save();
  
      // Set response headers for downloading the new PDF
      const newPdfFileName = `new-${req.file.originalname}`;
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${newPdfFileName}`);
      res.end(pdfBytes, 'binary');
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Error processing PDF' });
    }
  });
  

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`);
});
