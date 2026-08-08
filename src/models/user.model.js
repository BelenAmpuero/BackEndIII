// src/models/user.model.js
const { Schema, model } = require('mongoose');
const { ROLES } = require("../utils/constants");

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: Object.values(ROLES), 
    default: ROLES.USER
  },
  phone: { type: String },
  address: { type: String }
}, {
  timestamps: true
});

module.exports = model('User', userSchema);