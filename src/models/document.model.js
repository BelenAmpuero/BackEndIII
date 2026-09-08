const { Schema, model } = require('mongoose');

const documentSchema = new Schema({
  originalName: {
    type: String,
    required: true
  },

  fileName: {
    type: String,
    required: true
  },

  path: {
    type: String,
    required: true
  },

  mimeType: {
    type: String,
    required: true
  },

  size: {
    type: Number,
    required: true
  },

  type: {
    type: String,
    required: true
  },

  uploadedAt: {
    type: Date,
    default: Date.now
  },

  proof: {
    originalName: String,
    fileName: String,
    path: String,
    mimeType: String,
    size: Number,
    uploadedAt: Date
  }
})

module.exports = model("Documnet", documentSchema);
