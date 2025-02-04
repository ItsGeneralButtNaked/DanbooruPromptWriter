// app.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const { default: openBrowser } = require('open');

const app = express();
const PORT = process.env.PORT || 3000;

// Sert les fichiers statiques dans le dossier public
app.use(express.static('public'));

// Endpoint pour récupérer la liste des tags depuis tags.txt
app.get('/tags', (req, res) => {
  const filePath = path.join(__dirname, 'tags.txt');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Impossible de lire le fichier des tags.' });
    }
    // Chaque ligne du fichier est de la forme "tag,number"
    const lines = data.split('\n').filter(line => line.trim() !== '');
    const tags = lines.map(line => {
      const [tag, number] = line.split(',');
      return { tag: tag.trim(), id: number.trim() };
    });
    res.json(tags);
  });
});

app.listen(PORT, () => {
  console.log(`Le serveur est lancé sur le port ${PORT}`);
  // Ouvre automatiquement le navigateur à l'URL du serveur
  openBrowser(`http://localhost:${PORT}`);
});
