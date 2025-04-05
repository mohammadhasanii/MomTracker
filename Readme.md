# MomTracker

![Map View](./demo/demo-1.png)

## About the Project

Every night, my mom asks me:  
"Where are you going?"  
"Why are you coming back so late?"

To make things easier for both of us, I created **MomTracker**. This project allows me to share my location in real-time, calculate how far I am from home, and display it on a map. Now, instead of asking me, she can just check the app and see where I am.

## Features

- **Real-Time Location Tracking**: Real-time communication\*\* via Socket.IO (no polling)
- **Distance Calculation**: Calculates the distance between my current location and home and displays it in a popup on the map.

- **Interactive Map**: Uses `leaflet` for a smooth and interactive map experience.
- **Auto-reconnection** for stable WebSocket connections
- **Lightweight architecture** (removed legacy REST endpoints)
- **One-command deployment** with Docker Compose

## Why MomTracker?

This project is a fun and practical way to keep my mom updated about my whereabouts while giving me some peace of mind during my nightly adventures. It's a win-win!

## How It Works

1. **Frontend**:

   - Built with React.
   - Displays the map and a popup with my name and the distance to home.
   - RealTime tracking with a lightweight connection

2. **Backend**:

   - Built with Express.js.
   - Connection With Socket.IO
   - Very lightweight

3. **Distance Calculation**:
   - Uses the Haversine formula to calculate the distance between my current location and home.

## Manual Run

1. Clone the repository:

   ```bash
   git clone https://github.com/mohammadhasanii/MomTracker.git
   cd momtracker
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the server:

   ```bash
   npm run server
   ```

4. Start the React app:

   ```bash
   npm start
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Tech Stack

- **Frontend**: `React`, `leaflet` `Socket.IO`
- **Backend**: `Express.js` `Socket.IO`
- **Data Storage**: Memory

## Docker Compose Deployment

```bash
docker-compose up --build
```

## Docker Configuration Highlights

```yaml
services:
  react-app:
    ports: ["3000:3000"] # Access at http://localhost:3000
    volumes: ["./:/app"] # Live code reload

  node-app:
    ports: ["5000:5000"] # Backend and Socket.IO endpoint
    depends_on: react-app # Optional startup ordering

networks:
  mynetwork: # Isolated network for inter-container communication
```



## Future Plans

- Add a feature to notify my mom when I reach home.
- Improve the UI with more animations and better styling.

---

**Disclaimer**: This project is just for fun and personal use. It's not meant to be a professional-grade tracking solution. 😊
