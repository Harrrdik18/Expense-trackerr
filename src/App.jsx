import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [entries, setEntries] = useState([]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('Expense');
  const [netBalance, setNetBalance] = useState(0);

  // Fetch entries from the backend
  useEffect(() => {
    axios.get('http://localhost:5000/entries')
      .then((response) => {
        setEntries(response.data);
        calculateNetBalance(response.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const calculateNetBalance = (entries) => {
    let income = 0, expenses = 0;
    entries.forEach(entry => {
      if (entry.type === 'Income') income += entry.amount;
      else expenses += entry.amount;
    });
    setNetBalance(income - expenses);
  };

  const addEntry = (e) => {
    e.preventDefault();
    const newEntry = { amount: parseFloat(amount), description, date, type };
    axios.post('http://localhost:5000/addEntry', newEntry)
      .then((response) => {
        const updatedEntries = [...entries, response.data];
        setEntries(updatedEntries);
        calculateNetBalance(updatedEntries);
        setAmount('');
        setDescription('');
        setDate('');
        setType('Expense');
      })
      .catch((err) => console.error(err));
  };

  const deleteEntry = (id) => {
    axios.delete(`http://localhost:5000/deleteEntry/${id}`)
      .then(() => {
        const updatedEntries = entries.filter(entry => entry._id !== id);
        setEntries(updatedEntries);
        calculateNetBalance(updatedEntries);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="App">
      <h1>Expense Tracker</h1>
      <h2>Net Balance: ${netBalance}</h2>
      
      <form onSubmit={addEntry}>
        <input 
          type="number" 
          placeholder="Amount" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="Description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          required 
        />
        <input 
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
          required 
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="Expense">Expense</option>
          <option value="Income">Income</option>
        </select>
        <button type="submit">Add Entry</button>
      </form>

      <ul>
        {entries.map((entry) => (
          <li key={entry._id}>
            {entry.description} - ${entry.amount} ({entry.type}) on {new Date(entry.date).toLocaleDateString()}
            <button onClick={() => deleteEntry(entry._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
