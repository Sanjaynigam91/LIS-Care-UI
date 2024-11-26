import express from 'express';
const app = express();

// CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');  // Replace with your domain
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// Your API endpoints
app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

// Start the server
const PORT = process.env.PORT || 63035;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
