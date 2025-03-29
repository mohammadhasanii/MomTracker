import React, { useEffect, useRef } from "react";
import { useLocation } from "../contexts/LocationContext";
import axios from "axios";

const SendLocation = () => {
  const { isTracking, permissionStatus, location, startTracking } =
    useLocation();
  const previousLocation = useRef(null);

  useEffect(() => {
    startTracking();
    return () => {};
  }, []);

  const sendLocationToAPI = async (location) => {
    const locationData = {
      x: location[0],
      y: location[1],
    };

    try {
      const response = await axios.post(
        "https://8nvkd5q1-3001.euw.devtunnels.ms/api/saveLocation",
        locationData
      );
      console.log("Location sent to API:", response.data);
    } catch (error) {
      console.error("Has Error:", error);
    }
  };

  useEffect(() => {
    if (isTracking) {
      if (
        !previousLocation.current ||
        previousLocation.current[0] !== location[0] ||
        previousLocation.current[1] !== location[1]
      ) {
        sendLocationToAPI(location);
        previousLocation.current = location;
      }
    }
  }, [location, isTracking]);

  const getStatusMessage = () => {
    switch (permissionStatus) {
      case "pending":
        return "Please confirm location access permission";
      case "granted":
        return isTracking ? "Sending Position" : "Starting GPS Service";
      case "denied":
        return "Please turn on GPS and enable location access permission in browser settings";
      default:
        return "Checking Status...";
    }
  };

  const getStatusClass = () => {
    return `status ${permissionStatus === "denied" ? "error" : ""}`;
  };

  return (
    <div className="send-location">
      <h2>position status</h2>
      <div className={getStatusClass()}>{getStatusMessage()}</div>
      {isTracking && (
        <div className="coordinates">
          <p>Latitude : {location[1]}</p>
          <p>Longitude: {location[0]}</p>
        </div>
      )}
    </div>
  );
};

export default SendLocation;
