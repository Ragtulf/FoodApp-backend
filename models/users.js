import mongoose from 'mongoose'
import crypto from 'crypto'

export const User = mongoose.model('User', {
  userName: {
    type: String,
    unique: true,
    required: true,
    minlength: 2
  },
  profilePic: {
    type: String,
  },
  profilePicName: {
    type: String
  },
  // avatar: {
  //   type: String,
  // },
  shortBio: {
    type: String,
    maxlength: 140,
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5
  },
  accessToken: {
    type: String,
    default: () => crypto.randomBytes(128).toString('hex')
  }
})