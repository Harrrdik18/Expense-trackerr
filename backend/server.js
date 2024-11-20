const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // To load environment variables

const app = express();
const PORT = process.env.PORT || 5000; // Use Render's provided PORT or default to 5000

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI; // MongoDB Atlas connection string from environment variables
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Schema and Model
const entrySchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ['Expense', 'Income'], required: true },
});

const Entry = mongoose.model('Entry', entrySchema);

// Routes

// Add a new entry (Income/Expense)
app.post('/addEntry', async (req, res) => {
  try {
    const entry = new Entry(req.body);
    await entry.save();
    res.status(201).send(entry);
  } catch (error) {
    res.status(400).send({ error: 'Failed to add entry', details: error.message });
  }
});

// Get all entries
app.get('/entries', async (req, res) => {
  try {
    const entries = await Entry.find();
    res.status(200).send(entries);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch entries', details: error.message });
  }
});

// Delete an entry by ID
app.delete('/deleteEntry/:id', async (req, res) => {
  try {
    const entry = await Entry.findByIdAndDelete(req.params.id);
    if (!entry) {
      return res.status(404).send({ error: 'Entry not found' });
    }
    res.status(200).send(entry);
  } catch (error) {
    res.status(500).send({ error: 'Failed to delete entry', details: error.message });
  }
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
