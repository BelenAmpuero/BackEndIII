const { Schema, model } = require('mongoose')
const { ROLES } = require('../utils/constants')
const documentSchema = require('./document.model')

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.USER
    },

    phone: {
      type: String
    },

    address: {
      type: String
    },

    documents: {
      type: [documentSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
)

module.exports = model('User', userSchema)