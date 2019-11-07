const mongoose = require('mongoose');

const EmployeeSchema = mongoose.Schema({
  id: Number,
  name: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Employee', EmployeeSchema);