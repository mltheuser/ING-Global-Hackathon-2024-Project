const express = require('express');
const app = express();

// API endpoint
app.get('/api/data', (req, res) => {
  // Handle API request and send response
  res.json({ message: 'Hello from the server!' });
});

const port = process.env.PORT || 6000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
