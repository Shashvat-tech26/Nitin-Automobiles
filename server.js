require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 5000;

const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Mongoose Schemas & Models
// home route
app.get('/NAadmin', (req, res) => {
  res.render("admin");
});
app.get('/', (req, res) => {
  res.render("NA");
});

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  carDetails: { type: String, default: '' },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const Contact = mongoose.model('Contact', contactSchema);

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  text: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now }
});
const Review = mongoose.model('Review', reviewSchema);

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hindi: { type: String, default: '' },
  desc: { type: String, default: '' },
  active: { type: Boolean, default: true }
});
const Service = mongoose.model('Service', serviceSchema);

const appointmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  car: { type: String, default: '' },
  service: { type: String, default: '' },
  date: { type: String, default: '' },
  status: { type: String, default: 'pending' },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});
const Appointment = mongoose.model('Appointment', appointmentSchema);

const mediaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  type: { type: String, default: 'image' },
  createdAt: { type: Date, default: Date.now }
});
const Media = mongoose.model('Media', mediaSchema);



// API Endpoints

// --- Contacts ---
app.post('/api/contact', async (req, res) => {
  try {
    const { name, phone, carDetails, message } = req.body;
    if (!name || !phone || !message) {
      return res.status(400).json({ success: false, error: 'Name, phone, and message are required.' });
    }
    const newContact = new Contact({ name, phone, carDetails, message });
    await newContact.save();
    res.status(201).json({ success: true, data: newContact, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.get('/api/contact', async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.delete('/api/contact/:id', async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Contact deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error deleting contact' });
  }
});

// --- Reviews ---
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

app.post('/api/reviews', async (req, res) => {
  try {
    const newReview = new Review(req.body);
    await newReview.save();
    res.status(201).json({ success: true, data: newReview });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

app.delete('/api/reviews/:id', async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// --- Services ---
app.get('/api/services', async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

app.post('/api/services', async (req, res) => {
  try {
    const newService = new Service(req.body);
    await newService.save();
    res.status(201).json({ success: true, data: newService });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

app.put('/api/services/:id/toggle', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, error: 'Not found' });
    service.active = !service.active;
    await service.save();
    res.status(200).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// --- Appointments ---
app.get('/api/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

app.post('/api/appointments', async (req, res) => {
  try {
    const newAppointment = new Appointment(req.body);
    await newAppointment.save();
    res.status(201).json({ success: true, data: newAppointment });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

app.put('/api/appointments/:id', async (req, res) => {
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: updatedAppointment });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

app.delete('/api/appointments/:id', async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Appointment deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// --- Media ---
app.get('/api/media', async (req, res) => {
  try {
    const mediaList = await Media.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: mediaList });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

app.post('/api/media', async (req, res) => {
  try {
    const newMedia = new Media(req.body);
    await newMedia.save();
    res.status(201).json({ success: true, data: newMedia });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

app.delete('/api/media/:id', async (req, res) => {
  try {
    await Media.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Media deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
