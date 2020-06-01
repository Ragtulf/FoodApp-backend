import mongoose from 'mongoose'
import crypto from 'crypto'

export const User = mongoose.model('User', {
  userName: {
    type: String,
    unique: true
  },
  shortBio: {
    type: String,
    maxlength: 140,
  },
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  accessToken: {
    type: String,
    default: () => crypto.randomBytes(128).toString('hex')
  }
})