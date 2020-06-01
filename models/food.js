import mongoose from 'mongoose'


// Working model with arrays
export const RecipeTest = mongoose.model('RecipeTest', {
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
  },
  time: {
    type: String,
  },
  image: {
    type: String,
  },
  tags: [{
      type: String,
      minlength: 2
    }],
})