import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
// import bcrypt from 'bcrypt-nodejs'
// import { Recipe } from './models/recipe'
import { Recipe } from './models/food'


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/food-app"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise


// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Our pretty Food App! 🍌')
})



//Trying to create recipes
// New POST req - WORKING - rn only title and ingredients!
app.post('/recipe', async (req, res) => {
  try {
    const { title, shortDescription, ingredients, directions, image, tags } = req.body
    const recipe = await new Recipe({
      title,
      shortDescription,
      ingredients,
      directions,
      image,
      tags
    }).save()
    res.status(201).json(recipe)
  } catch (err) {
    res.status(400).json({ message: 'Did not work!', error: err.errors })
  }
})

app.get('/recipe', async (req, res) => {
  try {
    const recipes = await Recipe.find().exec()
    res.json(recipes)
  } catch (err) {
    res.status(400).json({ message: "Not working!" })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
