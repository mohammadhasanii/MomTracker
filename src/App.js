import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./style.css";
import Mapir from "mapir-react-component";
import { LocationProvider } from "./contexts/LocationContext";
import SendLocation from "./components/SendLocation";
import axios from "axios";

const TOKEN =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImY3MjY3ZGVlNGFiZGJmNjMxMjIyMDMyMDAyYTg5Yzc4MWNmNzg1MGVhMzBiODMyODU0MDAzMjBkY2Y1NGQ0MDNmYmYxZmIxYjYyM2VjZDIzIn0.eyJhdWQiOiIyMTgzNSIsImp0aSI6ImY3MjY3ZGVlNGFiZGJmNjMxMjIyMDMyMDAyYTg5Yzc4MWNmNzg1MGVhMzBiODMyODU0MDAzMjBkY2Y1NGQ0MDNmYmYxZmIxYjYyM2VjZDIzIiwiaWF0IjoxNjgxNDAyMDM0LCJuYmYiOjE2ODE0MDIwMzQsImV4cCI6MTY4Mzk5NDAzNCwic3ViIjoiIiwic2NvcGVzIjpbImJhc2ljIl19.T3z69Z8baWjx3zR8jsK-iQCS8A0CBE2hFgx_FDZ2yY77cVEJoo9SqYm3e3IO0WzvUT2glWstWlOhvd_wN6l3Q_f3NyoeUxthLV308ad8huxFVBkYGnxYHk1vwQS6j01D8T8U_9oaLpK2EBOnqPcXBmPTax0nT2DG9oY9b3wqNIAy4EwxcudF3kUdhbUj0x8R2vD_Hsw_wAVZR_YHvX1yfMLdnnR09ipE4UPyYkdEVQ9zRiwle2515WI3LHtvpEJAqMRUJS8NGEBwcFeZUsFHtx-uNdDDar_MCVWSvPDRSYEJV4BnfAcuFw0spuA2SCj65-q7Z814LQSIY6c32TpkAA";

const Map = Mapir.setToken({
  transformRequest: (url) => {
    return {
      url: url,
      headers: {
        "x-api-key": TOKEN,
        "Mapir-SDK": "reactjs",
      },
    };
  },
});

const MapComponent = () => {
  const [displayLocation, setDisplayLocation] = useState([51.42047, 35.729054]);
  const targetLocation = [49.740646, 34.097525];
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const fetchLatestLocation = async () => {
      try {
        const response = await axios.get(
          "https://8nvkd5q1-3001.euw.devtunnels.ms/api/getLatestLocation"
        );
        const data = response.data;

        if (data.success && data.location) {
          setDisplayLocation([data.location.x, data.location.y]);
        }
      } catch (error) {
        console.error("Error fetching latest location:", error);
      }
    };

    const interval = setInterval(fetchLatestLocation, 5000);
    fetchLatestLocation();

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const calculateDistance = (loc1, loc2) => {
      const toRad = (value) => (value * Math.PI) / 180;
      const R = 6371;
      const dLat = toRad(loc2[1] - loc1[1]);
      const dLon = toRad(loc2[0] - loc1[0]);
      const lat1 = toRad(loc1[1]);
      const lat2 = toRad(loc2[1]);

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) *
          Math.sin(dLon / 2) *
          Math.cos(lat1) *
          Math.cos(lat2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    setDistance(calculateDistance(displayLocation, targetLocation).toFixed(2));
  }, [displayLocation]);

  return (
    <div className="App">
      <Mapir center={displayLocation} Map={Map} zoom={[15]} dragPan={true}>
        <Mapir.Marker coordinates={displayLocation} anchor="center" />

        <Mapir.Popup
          coordinates={displayLocation}
          offset={{
            "bottom-left": [12, -38],
            bottom: [0, -38],
            "bottom-right": [-12, -38],
          }}
        >
          <h1
            style={{
              backgroundColor: "green",
              color: "white",
              padding: "10",
              borderRadius: "7px",
            }}
          >
            <img
              width={40}
              src="https://cdn.iconscout.com/icon/premium/png-512-thumb/crazy-man-1650831-1401821.png?f=webp&w=256"
              alt="Icon"
            />
            محمد درحال پرسه زدن در این منطقه
            <br />
            <br />
            فاصله: {distance} کیلومتر تا خونه
          </h1>
        </Mapir.Popup>
      </Mapir>
      <div className="current-location">
        <p>The last recorded position:</p>
        <p>Lat: {displayLocation[0]}</p>
        <p>Long: {displayLocation[1]}</p>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <LocationProvider>
      <BrowserRouter>
        <nav>
          <Link to="/">مشاهده نقشه</Link>
          <Link to="/send-location">ارسال موقیت جغرافیایی</Link>
        </nav>
        <Routes>
          <Route path="/" element={<MapComponent />} />
          <Route path="/send-location" element={<SendLocation />} />
        </Routes>
      </BrowserRouter>
    </LocationProvider>
  );
};

export default App;
