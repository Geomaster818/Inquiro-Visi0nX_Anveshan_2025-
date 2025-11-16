const mongoose = require('mongoose');
const { Schema } = mongoose;

const PaperSchema = new Schema({
  title: { type: String, required: true, index: true },
  authors: { type: [String], default: [] },
  abstract: { type: String, default: '' },
  tags: { type: [String], default: [] },
  filePath: { type: String, required: true },
  originalFileName: { type: String },
  createdAt: { type: Date, default: Date.now }
});

PaperSchema.index({ title: 'text', abstract: 'text', authors: 'text', tags: 'text' });

module.exports = mongoose.model('Paper', PaperSchema);
