import React, { createContext, useState, useContext, useEffect } from 'react';


const LocationContext = createContext();


export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState([51.42047, 35.729054]);
  const [isTracking, setIsTracking] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState('pending');


  
  const startTracking = async () => {
    try {
      if (!('geolocation' in navigator)) {
        setPermissionStatus('denied');
        return;
      }

      navigator.geolocation.watchPosition(
        (position) => {
          const newLocation = [position.coords.longitude, position.coords.latitude];
          console.log('New location from SendLocation:', newLocation);
          setLocation(newLocation);

          setIsTracking(true);
          setPermissionStatus('granted');
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsTracking(false);
          setPermissionStatus('denied');
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } catch (error) {
      console.error('Error in startTracking:', error);
      setPermissionStatus('denied');
    }
  };

  return (
    <LocationContext.Provider value={{ 
      location, 
      isTracking, 
      startTracking,
      permissionStatus 
    }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext); 
