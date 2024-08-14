// models/User.js
const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
},
desc: {
  type: String,
  required: true
},
  
  avatar: { type: String }, // Add avatar field to store image URL
});

module.exports = mongoose.model('Picture', ImageSchema);
