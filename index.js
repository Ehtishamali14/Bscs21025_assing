const express = require('express');
const app = express();
const PORT = 3001;
const { readData, writeData } = require('./data/file');

// Middleware to parse JSON requests
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send("Welcome to the Express API!");
});

// Route to get all users
app.get('/users', async (req, res) => {
  try {
    const users = await readData();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Route to create a new user
app.post('/users', async (req, res) => {
  const newUser = req.body;
  try {
    const users = await readData();
    users.push(newUser);
    await writeData(users);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
});

// Route to update a user by ID
app.put('/users/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const updatedFields = req.body;
  try {
    const users = await readData();
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updatedFields };
      await writeData(users);
      res.json(users[index]);
    } else {
      res.status(404).json({ message: `User with ID ${id} not found.` });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating user" });
  }
});

// Route to delete a user by ID
app.delete('/users/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const users = await readData();
    const newData = users.filter(user => user.id !== id);
    if (newData.length !== users.length) {
      await writeData(newData);
      res.json({ message: `User with ID ${id} deleted.` });
    } else {
      res.status(404).json({ message: `User with ID ${id} not found.` });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
