require('dotenv/config');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  accelerateUrl: process.env.DATABASE_URL,
});
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_in_prod';
const PORT = process.env.PORT || 4000;

const allowedOrigins = [
  process.env.FRONTEND_URL
];

(async () => {
  try {
    await prisma.$connect();
    console.log('Prisma connected');
  } catch (e) {
    console.error('Prisma connection error:', e);
    process.exit(1);
  }
})();

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow curl, Postman, same-origin requests
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('CORS policy: This origin is not allowed'), false);
  },
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(__dirname + '/uploads'));

const upload = multer({ dest: __dirname + '/uploads/' });

// --- Auth middleware ---
async function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) return res.status(401).json({ error: 'Invalid token (user not found)' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// --- Helpers ---
function validationErrors(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  return null;
}

// Health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Signup
app.post(
  '/api/auth/signup',
  body('email').isEmail().withMessage('valid email required'),
  body('password').isLength({ min: 6 }).withMessage('password min length 6'),
  async (req, res) => {
    if (validationErrors(req, res)) return;
    const { email, password, name } = req.body;
    try {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) return res.status(409).json({ error: 'Email already in use' });
      const hashed = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { email, name: name || null, password: hashed }
      });
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
      res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name } });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Login
app.post(
  '/api/auth/login',
  body('email').isEmail(),
  body('password').exists(),
  async (req, res) => {
    if (validationErrors(req, res)) return;
    const { email, password } = req.body;
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });
      const ok = await bcrypt.compare(password, user.password);
      if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
      res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Items
app.get('/api/items', async (req, res) => {
  const items = await prisma.item.findMany({ include: { owner: { select: { id: true, email: true, name: true } } } });
  res.json(items);
});

app.post(
  '/api/items',
  authMiddleware,
  body('title').isLength({ min: 1 }).withMessage('title required'),
  body('price').optional().isFloat({ gt: 0 }).withMessage('price must be > 0'),
  async (req, res) => {
    if (validationErrors(req, res)) return;
    const { title, description, price, imageUrl } = req.body;
    try {
      const item = await prisma.item.create({
        data: {
          title,
          description: description || null,
          price: price ? Number(price) : null,
          imageUrl: imageUrl || null,
          owner: { connect: { id: req.user.id } }
        }
      });
      res.status(201).json(item);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Upload (authenticated)
app.post('/api/upload', authMiddleware, upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const url = `/uploads/${req.file.filename}`;
  // Optionally create a DB record for the upload:
  await prisma.upload.create({
    data: {
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      path: url,
      owner: { connect: { id: req.user.id } }
    }
  });
  res.json({ url });
});

app.listen(PORT, () => console.log(`API listening on ${PORT}`));