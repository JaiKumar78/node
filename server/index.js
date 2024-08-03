import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import userModel from './user.js';

// Set the port from environment variables or default to 8000
const port = process.env.PORT || 8000;

// Initialize Express app
const app = express();

// Apply middleware
app.use(cors());
app.use(express.json());

// MongoDB connection string from environment variables
const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mydatabase";

// Connect to MongoDB
mongoose.connect(mongoUri)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Failed to connect to MongoDB", err));

app.post('/adduser', (req, res) => {
const { name, email, age } = req.body;

const newUser = new userModel({ name, email, age });

newUser.save()
    .then(() => {
    res.status(201).json('User added successfully');
    })
    .catch((err) => {
    console.error('Error saving user:', err);
    res.status(500).json('Failed to add user');
    });
});

app.delete('/deleteuser', async (req, res) => {
    const { userId } = req.body; // Extract userId from URL parameters
  
    try {
      const deletedUser = await userModel.findByIdAndDelete(userId);
  
      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json({ message: 'User deleted successfully', deletedUser });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ error: 'Failed to delete user' });
    }
  });

  app.put('/updateuser/:userId', async (req, res) => {
    const { userId } = req.params;
    const { name, email, age } = req.body;
  
    try {
      const updatedUser = await userModel.findByIdAndUpdate(
        userId,
        { name, email, age },
        { new: true, runValidators: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json(updatedUser);
    } catch (err) {
      console.error('Error updating user:', err);
      res.status(500).json({ error: 'Failed to update user' });
    }
  });

// Define the /getuser route
app.get('/getuser', (req, res) => {
  userModel.find()
    .then(users => res.json(users))
    .catch(err => {
      console.error("Error fetching users", err);
      res.status(500).json({ error: "Failed to fetch users" });
    });
});

// Start the server
app.listen(port, () => console.log(`Server running on port ${port}`));
