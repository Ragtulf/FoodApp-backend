import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt-nodejs'
import { Recipe } from './models/food'
import { User } from './models/users'


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/food-app"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const authenticateUser = async (req, res, next) => {
  const user = await User.findOne({ accessToken: req.header('Authorization')})

  if (user) {
    req.user = user
    next()
  } else {
    res.status(403).json({ message: 'Access forbidden!' })
  }
}
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

app.post('/signup', async (req, res) => {
  try {
    const { userName, email, password } = req.body
    const user = new User({ userName, email, password: bcrypt.hashSync(password)})
    const savedUser = await user.save()
    res.status(201).json({ id: savedUser._id, acesssToken: savedUser.accessToken })
  } catch (err) {
    res.status(400).json({ message: 'Could not create user', err: err.errors })
  }
})

app.post('/login', async (req, res) => {
  const user = await User.findOne({ userName: req.body.userName })
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    res.json({ userID: user._id, accessToken: user.accessToken })
  } else {
    res.status(400).json({ message: 'Could not find user' })
  }
})

//Authenticated endpoint
app.get('/secret', authenticateUser)

app.get('/secret', (req, res) => {
  res.json({ secret: "Welcome to the Secret!" })
})


//Trying to create recipes
// New POST req - WORKING - rn only title and ingredients!
app.post('/recipes', authenticateUser)

app.post('/recipes', async (req, res) => {
  try {
    const { title, shortDescription, ingredients, directions, image, tags } = req.body
    const recipe = await new Recipe({
      title,
      shortDescription,
      ingredients,
      directions,
      image,
      tags,
    }).save()
    res.status(201).json(recipe)
  } catch (err) {
    res.status(400).json({ message: 'Did not work!', error: err.errors })
  }
})

app.get('/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt:'desc' }).exec()
    res.json(recipes)
  } catch (err) {
    res.status(400).json({ message: "Not working!" })
  }
})

app.get('/recipe/:id', async (req, res) => {
  const { id } = req.params
  try {
    const recipe = await Recipe.findById(id)
    res.json(recipe)
  } catch (err) {
    res.status(400).json({ message: 'Does not work!'})
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})