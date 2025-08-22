// app.js
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Endpoint to get tags from tags.txt
app.get('/tags', (req, res) => {
  const filePath = path.join(__dirname, 'tags.txt');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to read tags file.' });
    }
    // Each line in the file is in the form "tag,number"
    const lines = data.split('\n').filter(line => line.trim() !== '');
    const tags = lines.map(line => {
      const [tag, number] = line.split(',');
      return { tag: tag.trim(), id: number.trim() };
    });
    res.json(tags);
  });
});

app.listen(PORT, async () => {
  console.log(`The server is launched on port ${PORT}`);

  // Only try to auto-open the browser if not running in Docker
  if (!process.env.DOCKERIZED) {
    try {
      const openModule = await import('open');
      const openBrowser = openModule.default;
      openBrowser(`http://localhost:${PORT}`);
    } catch (err) {
      console.error('Error opening browser:', err);
    }
  }
});
