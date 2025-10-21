const express = require('express');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'users.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function readUsers() {
  if (!fs.existsSync(DATA_FILE)) return [];
  const data = fs.readFileSync(DATA_FILE, 'utf8');
  return data ? JSON.parse(data) : [];
}

function writeUsers(users) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
}

// REGISTER
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  const users = readUsers();

  if (users.find(u => u.username === username || u.email === email)) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const isFirstUser = users.length === 0;
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: Date.now().toString(),
    username,
    email,
    password: hashedPassword,
    status: isFirstUser ? 'approved' : 'pending',
    isAdmin: isFirstUser,
    registeredAt: new Date().toISOString()
  };

  users.push(newUser);
  writeUsers(users);

  res.json({ message: isFirstUser ? 'Admin account created' : 'Registration submitted. Awaiting admin approval.' });
});

// LOGIN
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();

  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  if (user.status !== 'approved') return res.status(403).json({ error: 'User not approved yet' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });

  res.json({ message: 'Login successful', user: { ...user, password: undefined } });
});

// GET USERS
app.get('/api/users', (req, res) => {
  const users = readUsers();
  res.json(users.map(u => ({ ...u, password: undefined })));
});

// UPDATE USER STATUS
app.post('/api/users/:id/status', (req, res) => {
  const { status } = req.body;
  const users = readUsers();
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  user.status = status;
  writeUsers(users);
  res.json({ message: 'Status updated', user: { ...user, password: undefined } });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
