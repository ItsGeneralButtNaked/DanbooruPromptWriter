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
      return res.status(500).json({ error: 'Impossible de lire le fichier des tags.' });
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
  console.log(`Le serveur est lancé sur le port ${PORT}`);

  try {
    // Dynamically import the open package
    const openModule = await import('open');
    const openBrowser = openModule.default;
    // Automatically open the browser at the server URL
    openBrowser(`http://localhost:${PORT}`);
  } catch (err) {
    console.error('Erreur lors de l\'ouverture du navigateur:', err);
  }
});
