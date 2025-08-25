import express from 'express';
import next from 'next';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import Tesseract from 'tesseract.js';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import {aiDataExtraction} from './utils/geminiExtractor.js';
import { calculateAge, buildFullName} from './utils/utils.js';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();


const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const upload = multer({ dest: uploadDir });

app.prepare().then(() => {
  const server = express();
  server.use(cors());
  server.use(express.json());

  server.post('/api/process', upload.single('file'), async (req, res) => {
    try {
      const { firstName, lastName, dob, method } = req.body;
      if (!req.file || !firstName || !lastName || !dob) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      let rawText = '';
      if (req.file.mimetype === 'application/pdf') {
        const dataBuffer = fs.readFileSync(req.file.path);
        const pdfData = await pdfParse(dataBuffer);
        rawText = pdfData.text;
      } else if (req.file.mimetype.startsWith('image/')) {
        const result = await Tesseract.recognize(req.file.path, 'eng');
        rawText = result.data.text;
      } else {
        return res.status(400).json({ error: 'Unsupported file type' });
      }

      let aiData = null;
      if (method === 'ai') {
        //Using Gemini for AI extraction
        aiData = await aiDataExtraction(rawText)
      }

      const age = calculateAge(dob);
      const fullName = buildFullName(firstName, lastName);

      res.json({
        fullName,
        age,
        rawText,
        aiData,
      });
      fs.unlinkSync(req.file.path);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(3000, err => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});

