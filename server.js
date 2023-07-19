const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

const url = 'mongodb+srv://lakhanimeet:lakhanimeet@cluster0.okzfoxe.mongodb.net';
const dbName = 'meet';

mongoose.connect(`${url}/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to the database');

    const dataSchema = new mongoose.Schema({
      username: String,
      email: String,
      password: String
    });

    const Data = mongoose.model('Data', dataSchema);

    app.post('/submit-form', async (req, res) => {
      const { username, email, password } = req.body;

      try {
        const existingUser = await Data.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
          return res.render('register', { error: 'Username or email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new Data({ username, email, password: hashedPassword });
        await newUser.save();

        return res.redirect('/login.html');
      } catch (error) {
        console.error('Failed to register user:', error);
        return res.redirect('/error.html');
      }
    });

    app.post('/login', async (req, res) => {
      const { username, password } = req.body;

      try {
        const user = await Data.findOne({ username });
        if (!user) {
          return res.render('login', { error: 'Invalid username or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return res.render('login', { error: 'Invalid username or password' });
        }

        return res.redirect('/dashboard.html');
      } catch (error) {
        console.error('Failed to login:', error);
        res.render('login', { error: 'Failed to login' });
      }
    });

    app.put('/update/:id', async (req, res) => {
      const { id } = req.params;
      const { username } = req.body;
    
      try {
        // Find the user by ID
        const username = await Data.findByIdAndUpdate(id, { username }, { new: true });
        if (!user) {
          return res.status(404).json({ success: false, message: `User with ID ${id} not found` });
        }
    
        // Update the user's username
        user.username = username;
        await user.save();
    
        return res.json({ success: true, message: 'User updated successfully', user: user });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
      }
    });

    

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });
