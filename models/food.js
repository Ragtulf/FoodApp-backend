import mongoose from 'mongoose'

// Working model with arrays
export const Recipe = mongoose.model('Recipe', {
  title: {
    type: String,
    required: true,
    maxlength: 30,
  },
  shortDescription: {
    type: String,
    maxlength: 140,
  },
  ingredients: [{
      type: String,
    }],
  directions: {
    type: String,
    required: true,
  },
  // time: {
  //   type: String,
  // },
  // image: {
  //   type: String,
  // },
  tags: [{
      type: String,
    }],
})