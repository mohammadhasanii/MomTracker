import React, { useEffect, useState, useRef } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./style.css";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";

import io from "socket.io-client"; // Import socket.io-client
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const socket = io("http://localhost:5000"); //SOCKET SERVER URL

const MapComponent = () => {
  const [displayLocation, setDisplayLocation] = useState([
    34.097525, 49.740646,
  ]);
  const [distance, setDistance] = useState(0);
  const mapRef = useRef(null);

  useEffect(() => {
    socket.on("newLocation", (location) => {
      const lat = parseFloat(location.x);
      const lng = parseFloat(location.y);
      if (!isNaN(lat) && !isNaN(lng)) {
        const newLocation = [lat, lng];
        console.log("New location:", newLocation);
        setDisplayLocation(newLocation);

        if (mapRef.current) {
          mapRef.current.setView(newLocation, mapRef.current.getZoom());
        }
      }
    });

    socket.emit("getLatestLocation");

    socket.on("latestLocation", (data) => {
      const latestLocation = data.location;
      if (latestLocation) {
        const lat = parseFloat(latestLocation.x);
        const lng = parseFloat(latestLocation.y);
        setDisplayLocation([lat, lng]);
      }
    });

    return () => {
      socket.off("newLocation");
      socket.off("latestLocation");
    };
  }, []);

  useEffect(() => {
    const calculateDistance = (loc1, loc2) => {
      const toRad = (value) => (value * Math.PI) / 180;
      const R = 6371;
      const dLat = toRad(loc2[0] - loc1[0]);
      const dLon = toRad(loc2[1] - loc1[1]);
      const lat1 = toRad(loc1[0]);
      const lat2 = toRad(loc2[0]);

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) *
          Math.sin(dLon / 2) *
          Math.cos(lat1) *
          Math.cos(lat2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    const homeLocation = [34.097525, 49.740646];
    setDistance(calculateDistance(displayLocation, homeLocation).toFixed(2));
  }, [displayLocation]);

  return (
    <div className="App">
      <MapContainer
        center={displayLocation}
        zoom={15}
        style={{ height: "100vh", width: "100%" }}
        ref={mapRef}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={displayLocation}>
          <Popup>
            <div style={{ direction: "rtl", textAlign: "center" }}>
              <img
                width={40}
                src="https://cdn.iconscout.com/icon/premium/png-512-thumb/crazy-man-1650831-1401821.png?f=webp&w=256"
                alt="Icon"
              />
              <h3 style={{fontSize:"20px"}}>محمد درحال پرسه زدن در این منطقه</h3>
              <p style={{fontSize:"20px"}}>فاصله: {distance} کیلومتر تا خونه</p>
            </div>
          </Popup>
        </Marker>
        <Circle
          center={displayLocation}
          radius={100}
          pathOptions={{ color: "blue", fillColor: "blue", fillOpacity: 0.2 }}
        />
      </MapContainer>
      <div className="current-location">
        <p>آخرین موقعیت ثبت شده:</p>
        <p>عرض: {displayLocation[0]}</p>
        <p>طول: {displayLocation[1]}</p>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MapComponent />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
