// src/models/deliveryPerson.model.js
const { Schema, model } = require('mongoose');

const deliveryPersonSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  vehicle: {
    kind: { type: String, enum: ['moto', 'bicycle', 'car'], required: true },
    plate: { type: String }
  },
  isAvailable: { type: Boolean, default: true },
  currentLocation: {
    lat: { type: Number },
    lng: { type: Number }
  }
}, {
  timestamps: true
});

module.exports = model('DeliveryPerson', deliveryPersonSchema);