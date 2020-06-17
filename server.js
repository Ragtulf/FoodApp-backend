import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import cloudinaryFramework from 'cloudinary'
import multer from 'multer'
import cloudinaryStorage from 'multer-storage-cloudinary'
import cors from 'cors'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt-nodejs'
import { Recipe } from './models/food'
import { User } from './models/users'

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/food-app"
mongoose.connect(mongoUrl, 
  { useNewUrlParser: true, 
    useUnifiedTopology: true })
mongoose.Promise = Promise

const cloudinary = cloudinaryFramework.v2; 
cloudinary.config({
  cloud_name: 'dnqxxs1yn',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const storage = cloudinaryStorage({
  cloudinary,
  params: {
    folder: 'recipeImages',
    allowedFormats: ['jpg', 'png'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
})
const parser = multer({ storage })

// Auth users
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
    const { userName, email, password, shortBio } = req.body
    const avatar = Math.floor(Math.random() * 16) +1
    const user = new User({ userName, avatar, email, password: bcrypt.hashSync(password), shortBio })
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

app.get('/login/user/:id', async (req, res) => {
  const {id} = req.params
  try {
    const user = await User.findById(id)
    res.status(201).json(user)
  } catch (err) {
    res.status(400).json({ message: 'No user found.'})
  } 
})

// Finds all recipes by specific user
app.get('/users/:id/recipes', async (req, res) => {
  const { id } = req.params
  try {
    const userRecipes = await Recipe.find({ createdBy: id})
    res.json(userRecipes)
  } catch (err) {
    res.status(400).json({ message: 'Does not work at all!'})
  }
})

app.post('/login/user/:id/image', parser.single('image'), async (req, res) => {
  const { id } = req.params
  try {
    const userProfile = await User.findOneAndUpdate(
      { _id: id },
      { profilePic: req.file.path, profilePicName: req.file.filename },
      { new: true })
    res.json(userProfile)
  } catch (err) {
    res.status(400).json({ message: "Can't post profile pic" })
  }
})

//Trying to create recipes
app.post('/recipes', authenticateUser)

app.post('/recipes', async (req, res) => {
  try {
    const { title, shortDescription, ingredients, directions, tags } = req.body
    const recipe = await new Recipe({
      title,
      shortDescription,
      ingredients,
      directions,
      tags,
      createdBy: req.user._id
    }).save()
    res.status(201).json(recipe)
  } catch (err) {
    console.log(JSON.stringify(err))
    res.status(400).json({ message: 'Did not work!', error: err.errors })
  }
})

app.get('/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find().populate({
      path: 'createdBy',
      select: ['userName', 'profilePic', 'avatar']
    }).sort({ createdAt:'desc' }).exec()
    res.json(recipes)
  } catch (err) {
    res.status(400).json({ message: "Not working!" })
  }
})

app.get('/recipes/tags/:tag', async (req, res) => {
  const { tag } = req.params
  try {
    const findTags = await Recipe.find({tags: { $regex: new RegExp(tag)}} )
    if (findTags.length > 0) {
      res.json(findTags)
    } else {
      res.status(400).json({ message: 'Not working'})
    }
  } catch (err) {
    res.status(400).json({ message: 'No tags'})
  }
})


app.get('/recipes/:id', async (req, res) => {
  const { id } = req.params
  try {
    const recipe = await Recipe.findById(id).populate({
      path: 'createdBy',
    select: ['userName', 'profilePic', 'avatar']
    })
    res.json(recipe)
  } catch (err) {
    res.status(400).json({ message: 'Does not work!'})
  }
})

// app.post('/recipes/:id/image', authenticateUser)
app.post('/recipes/:id/image', parser.single('image'), async (req, res) => {
  const { id } = req.params
  try {
    const updatedRecipe = await Recipe.findOneAndUpdate(
      { _id: id },
      { imageUrl: req.file.path, imageName: req.file.filename },
      { new: true })
    res.json(updatedRecipe)
  } catch (err) {
    res.status(400).json({ message: "Can't post image" })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})