import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt-nodejs'
import { Recipe } from './models/recipe'


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
  res.send('Our pretty Food App!🍌')
})

app.post('/recipe', async (req, res) => {
  const { title, ingredient } = req.body

  try {
    const recipe = await new Recipe({ title, ingredient }).save()
    res.status(201).json(recipe)
  } catch (err) {
    res.status(400).json({ message: 'Did not work!' })
  }
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
