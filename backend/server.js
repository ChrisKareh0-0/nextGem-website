import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { Contact } from './models/Contact.js';
import { Client } from './models/Client.js';
import multer from 'multer';

dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
}));

// Middleware
app.use(express.json());

// Pre-flight requests
app.options('*', cors());

// Add headers middleware
app.use((req, res, next) => {
  res.header('Content-Type', 'application/json');
  next();
});

// Health check endpoint
app.get('/', (req, res) => {
  res.send('NextGem API is running');
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Contact form endpoint
app.post('/api/contacts', async (req, res) => {
  try {
    const contact = new Contact({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      message: req.body.message,
      timestamp: new Date()
    });

    await contact.save();
    res.status(201).json({ message: 'Contact form submitted successfully' });
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({ error: 'Failed to submit contact form' });
  }
});

// Get all clients
app.get('/api/clients', async (req, res) => {
  try {
    const clients = await Client.find();
    if (!clients) {
      return res.status(404).json({ error: 'No clients found' });
    }
    console.log('Sending clients:', clients); // Debug log
    res.json(clients);
  } catch (error) {
    console.error('Error in /api/clients:', error);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

// Add new client
app.post('/api/clients', upload.single('quotationFile'), async (req, res) => {
  try {
    console.log('Received client data:', req.body); // Debug log
    const client = new Client({
      ...req.body,
      quotationFile: req.file ? req.file.path : null
    });
    await client.save();
    console.log('Saved client:', client); // Debug log
    res.status(201).json(client);
  } catch (error) {
    console.error('Error in client creation:', error);
    res.status(500).json({ error: 'Failed to add client' });
  }
});

// Update payment status
app.post('/api/clients/:id/payment', async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    client.paymentHistory.push({
      amount: req.body.amount,
      date: new Date(),
      status: 'paid'
    });
    await client.save();
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update payment' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app; 