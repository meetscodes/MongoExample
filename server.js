const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const bcrypt = require('bcrypt');
// const cors = require('cors');
const app = express();
const port = 3000;

//  app.use(cors());
app.use(express.static('public'));

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// app.set('view engine', 'ejs');
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
      const id = req.params.id;
      const updates = req.body;

      try {
        // Find the user by ID
        const user = await Data.updateOne({ _id: id }, updates);

        if (user.nModified === 0) {
          return res.status(404).json({ message: `cannot find user with ID ${id}` });
        }

        return res.status(200).json({ success: true, message: 'User updated successfully', user: user });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
      }
    });

    app.delete('/users/:id', async (req, res) => {
      Data.deleteOne({ _id: req.params.id }).then(
        () =>{ res.status(200).json({
        success: "User deleted successfully"
      });
    }).catch((error ) => {
      res.status(500).json({ success: false, message: '  server Error' });
    
    }
    );
  });
    


    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });