const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.get('/api', (req, res) => {
  res.status(200).json({ message: 'API Showroom Arjuna Motor berjalan' });
});

module.exports = app;