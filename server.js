const express = require('express');

const { MongoClient } = require('mongodb');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const bcrypt = require( 'bcrypt');


// Connection URL and database name
const url = 'mongodb+srv://lakhanimeet:lakhanimeet@cluster0.okzfoxe.mongodb.net';
const dbName = 'meet';

// Serve the HTML files
app.use(express.static('public'));
// app.use(expressSanitizer());
app.set('view engine', 'ejs');

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));


// Create a schema for the data
const dataSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String
});
// Create a model for the data
const Data = mongoose.model('Data', dataSchema);

 // Login route
 app.get('/login', (req, res) => {
  res.redirect('login.html');
});


// Connect to the MongoDB database
mongoose.connect(`${url}/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to the database');


   

    app.post('/submit-form', async (req, res) => {
      const { username, email, password } = req.body;
    
      try {
        // Check if the username or email is already registered
        const existingUser = await Data.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
          return res.render('register', { error: 'Username or email already exists' });
        }
    
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Create a new user
        const newUser = new Data({ username, email, password: hashedPassword });
        await newUser.save();
    
        return res.redirect('/login.html');
      } catch (error) {
        console.error('Failed to register user:', error);
      return res.redirect('/error.html');
      }
    });
    
    // Login route
    app.get('/login', (req, res) => {
      res.redirect('/dashboard.html');
    });
    
    app.post('/login', async (req, res) => {
      const { username, password } = req.body;
    
      try {
        // Find the user by username
        const user = await Data.findOne({ username });
        if (!user) {
          return res.render('login', { error: 'Invalid username or password' });
        }
    
        // Compare the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return res.render('login', { error: 'Invalid username or password' });
        }
    
        return res.redirect('/dashboard.html');
      } catch (error) {
        console.error('Failed to login:', error);
        res.render('login', { error: 'Failed to login'});
    }
    });
  
    // Start the server
        app.listen(port, () => {
          console.log(`Server running on port ${port}`);
        });
      },err=>{
        console.error('Error connecting to the database', err);

      });
     
  