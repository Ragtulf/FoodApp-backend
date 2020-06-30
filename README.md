# o! Food Community - Final Project - Backend 🌟🍔🏅

This is a ToDo app website that shows how many tasks you have completed and out of how many. You can add a task, delete a task and clear the list. It has some tasks in there to show how it looks when it is not empty. 

## Tech

- Node.js
- Express
- Mongoose
- Authentication
- MongoDB
- Cloudinary
- RESTful API
- bcrypt

## Documentation

- GET requests
  * /recipes – *Gets all recipes*
  * /recipes/:id – *Gets a specific recipe*
  * /recipes/tags/:tag – *Gets all recipes with a specific tag*
  * /login/user/:id – *Gets specific user profile*
  * /users/:id/recipes – *Gets all recipes by a specific user*

- POST requests
  * /recipes 
*Posts a recipe to database*
  * /recipes/:id/image 
*Connects image to recipe*
  * /signup 
*Adds new user*
  * /login 
*Login for a user*
  * /login/user/:id/image *Connects profile pic to user*

## How we did it

We started with trying to visualize the models we needed in the backend and then built the routes we wanted to use. We finished working on authentication before starting on the frontend. We made some adjustments during the development of the frontend.  

## View it live

The final product can be viewed here👀🌶: 
https://o-food-community.netlify.app/
