import React, { useEffect, useState } from 'react';

const GeolocationMap = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  useEffect(() => {
    const getLocation = () => {
      if (navigator.permissions) {
        navigator.permissions.query({ name: 'geolocation' }).then(function(permissionStatus) {
          if (permissionStatus.state === 'granted') {
            getUserPosition();
          } else if (permissionStatus.state === 'prompt') {
            navigator.geolocation.getCurrentPosition(getUserPosition, handleError);
          } else {
            alert("Geolocation permission denied.");
          }
        });
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    };

    const getUserPosition = () => {
      navigator.geolocation.getCurrentPosition(function(position) {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      }, handleError);
    };

    const handleError = (error) => {
      switch(error.code) {
          case error.PERMISSION_DENIED:
              alert("User denied the request for Geolocation.");
              break;
          case error.POSITION_UNAVAILABLE:
              alert("Location information is unavailable.");
              break;
          case error.TIMEOUT:
              alert("The request to get user location timed out.");
              break;
          case error.UNKNOWN_ERROR:
              alert("An unknown error occurred.");
              break;
      }
    };

    getLocation();
  }, []);

  return (
    <div>
      {latitude && longitude ? (
        <p className="text-white text-2xl">Latitude: {latitude} Longitude: {longitude}</p>
      ) : 
      <p className="text-white text-2xl">Getting Geolocation Data...</p>
      }  
    </div>
  );
};

export default GeolocationMap;
