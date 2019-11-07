const mongoose = require('mongoose');

const ReviewSchema = mongoose.Schema({
  id: Number,
  content: String,
  reviewee: String,
  reviewer: String,
  feedback: String
}, {
  timestamp: true
});

module.exports = mongoose.model('Review', ReviewSchema);