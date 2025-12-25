const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(session({
  secret: 'your-secret-key', // Change this in production
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Helper functions
function readJSON(file) {
  try {
    return JSON.parse(fs.readFileSync(path.join(__dirname, 'data', file), 'utf8'));
  } catch (err) {
    console.error(err);
    return [];
  }
}

function writeJSON(file, data) {
  try {
    fs.writeFileSync(path.join(__dirname, 'data', file), JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
  }
}

// API Routes (must come before static file serving)
app.get('/api/products', (req, res) => {
  const products = readJSON('../../data/products.json');
  res.json(products);
});

app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  if (username.length < 8) {
    return res.status(400).json({ error: 'Username must be at least 8 characters' });
  }

  const users = readJSON('../../data/users.json');
  const existingUser = users.find(u => u.username === username);
  if (existingUser) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  writeJSON('../../data/users.json', users);

  req.session.user = { username };
  res.json({ message: 'Signup successful', user: { username } });
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const users = readJSON('../../data/users.json');
  const user = users.find(u => u.username === username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  req.session.user = { username };
  res.json({ message: 'Login successful', user: { username } });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ message: 'Logout successful' });
  });
});

// Static file serving
app.use(express.static(path.join(__dirname, '..')));

// Catch-all route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
