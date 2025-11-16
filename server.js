process.on("uncaughtException", err => {
  console.error("CRASH:", err);
});
process.on("unhandledRejection", err => {
  console.error("PROMISE FAIL:", err);
});
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');

const Paper = require('./models/Paper');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/inquiro';

mongoose.connect(MONGODB_URI).then(()=> {
  console.log('Connected to MongoDB');
}).catch(err=>{
  console.error('MongoDB connection error:', err.message);
  process.exit(1);
});

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));

const uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'papers');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const safe = Date.now() + '-' + file.originalname.replace(/\s+/g, '-');
    cb(null, safe);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files are allowed'));
  }
});

app.get('/api/papers', async (req, res) => {
  try {
    const q = req.query.q ? req.query.q.trim() : '';
    let papers;
    if (q) {
      papers = await Paper.find({ $text: { $search: q } }).sort({ createdAt: -1 }).exec();
    } else {
      papers = await Paper.find().sort({ createdAt: -1 }).exec();
    }
    res.json({ success: true, data: papers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

app.get('/api/papers/:id', async (req, res) => {
  try {
    const p = await Paper.findById(req.params.id);
    if (!p) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: p });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

app.post('/api/papers', upload.single('pdf'), async (req, res) => {
  try {
    const { title, authors, abstract, tags } = req.body;
    if (!title || !req.file) return res.status(400).json({ success: false, error: 'Missing title or pdf' });

    const paper = new Paper({
      title,
      authors: authors ? authors.split(',').map(s=>s.trim()).filter(Boolean) : [],
      abstract: abstract || '',
      tags: tags ? tags.split(',').map(s=>s.trim()).filter(Boolean) : [],
      filePath: '/uploads/papers/' + req.file.filename,
      originalFileName: req.file.originalname
    });
    await paper.save();
    res.json({ success: true, data: paper });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/papers/:id', async (req, res) => {
  try {
    const p = await Paper.findById(req.params.id);
    if (!p) return res.status(404).json({ success: false, error: 'Not found' });
    const fp = path.join(__dirname, '..', 'public', p.filePath);
    fs.unlink(fp, (err) => { if (err) console.warn('file delete error', err.message); });
    await p.deleteOne();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

app.post('/api/seed', async (req, res) => {
  try {
    const seeds = [
      { title: 'Constitution of Atoms I', authors: ['Unknown'], abstract: 'Foundational atomic theory.', tags: ['physics'], filePath: '/uploads/papers/Constitution_of_atoms_I.pdf', originalFileName: 'Constitution_of_atoms_I.pdf' },
      { title: "Thomson's Atomic Model", authors: ['John Smith'], abstract: 'Thomson plum pudding model PDF.', tags: ['history','physics'], filePath: '/uploads/papers/smith97_thomson.pfg.pdf', originalFileName: 'smith97_thomson.pfg.pdf' },
      { title: 'Atomism in Greek Philosophy', authors: ['Nenad Raos'], abstract: 'Study on Greek atomist theory.', tags: ['philosophy'], filePath: '/uploads/papers/0546_001.pdf', originalFileName: '0546_001.pdf' }
    ];
    await Paper.deleteMany({});
    await Paper.insertMany(seeds);
    res.json({ success: true, inserted: seeds.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success:false, error: err.message });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'paperbank.html'));
});

app.listen(PORT, ()=> console.log('Server listening on', PORT));
