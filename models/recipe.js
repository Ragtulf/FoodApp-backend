import mongoose, { Schema } from 'mongoose'

export const ingredientsSchema = new Schema({
  type: String
})

export const tagsSchema = new Schema({
  type: String
})

export const Recipe = mongoose.model('Recipe', {
  title: {
    type: String,
    maxlength: 40,
    required: true
  },
  shortDescription: {
    type: String,
    maxlength: 140,
  },

  ingredient: [ingredientsSchema],

  directions: {
    type: String,
    required: true
  },
  timeHours: {
    type: Number,
  },
  timeMinutes: {
    type: Number
  },
  image: {
    type: String,
  },

  tags: [tagsSchema]
})