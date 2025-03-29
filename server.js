const express = require('express');
const http = require('http');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); 

const app = express();
const server = http.createServer(app);

const locationsFile = path.join(__dirname, 'src/data/locations.json');


if (!fs.existsSync(locationsFile)) {
  fs.writeFileSync(locationsFile, JSON.stringify({ locations: [] }, null, 2));
}


app.use(cors());
app.use(express.json());


app.post('/api/saveLocation', (req, res) => {
  console.log("True")
  try {
    const { x, y } = req.body;
    if (x === undefined || y === undefined) {
      return res.status(400).json({ error: 'x and y are required' });
    }

    console.log(`Received location: x=${x}, y=${y}`); 

    const data = JSON.parse(fs.readFileSync(locationsFile));
    const newLocation = { x, y, timestamp: new Date().toISOString() };
    data.locations.push(newLocation);
    fs.writeFileSync(locationsFile, JSON.stringify(data, null, 2));
    res.json({ success: true, location: newLocation });
  } catch (error) {
    console.error('Error saving to file:', error);
    res.status(500).json({ error: 'Failed to save location' });
  }
});


app.get('/api/getLatestLocation', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(locationsFile));
    const latestLocation = data.locations[data.locations.length - 1] || null; 
    res.json({ success: true, location: latestLocation });
  } catch (error) {
    console.error('Error reading from file:', error);
    res.status(500).json({ error: 'Failed to read location' });
  }
});

server.listen(3001, () => {
  console.log('Server running on port 3001');
});
