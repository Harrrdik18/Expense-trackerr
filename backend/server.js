const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());


mongoose.connect('mongodb://localhost:27017/expense-tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const entrySchema = new mongoose.Schema({
  amount: Number,
  description: String,
  date: Date,
  type: { type: String, enum: ['Expense', 'Income'] },
});

const Entry = mongoose.model('Entry', entrySchema);

app.post('/addEntry', async (req, res) => {
  try {
    const entry = new Entry(req.body);
    await entry.save();
    res.status(201).send(entry);
  } catch (error) {
    res.status(400).send(error);
  }
});


app.delete('/deleteEntry/:id', async (req, res) => {
  try {
    const entry = await Entry.findByIdAndDelete(req.params.id);
    if (!entry) return res.status(404).send();
    res.status(200).send(entry);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get all Entries
app.get('/entries', async (req, res) => {
  try {
    const entries = await Entry.find();
    res.status(200).send(entries);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
