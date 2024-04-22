import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const GeolocationMap = ({ latitude, longitude }) => {
  const [loadingData, setLoadingData] = useState(true);
  const [loadingAddr, setLoadingAddr] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [address, setAddress] = useState(null);

  console.log(latitude, longitude);

  const getNearbyHospitals = async () => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&amenity=hospital&emergency=yes&lat=${latitude}&lon=${longitude}&zoom=15`;
  
    try {
      console.log('Request URL:', url);
  
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch nearby hospitals.');
      }
      const data = await response.json();
  
      console.log('Response:', data);
  
      return data;
    } catch (error) {
      console.error('Error fetching nearby hospitals:', error);
      return [];
    }
  };

  const reverseGeoCode = async () => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`; // corrected parameter name to 'format'
    try {
      console.log('Request URL:', url);
  
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch nearby hospitals. HTTP status ' + response.status);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Unexpected response format. Expected JSON, got ' + contentType);
      }
  
      const data = await response.json();
  
      console.log('Response:', data);
  
      return data;
    } catch (error) {
      console.error('Error fetching nearby hospitals:', error);
      return [];
    }
    finally{
      setLoadingAddr(false);
    }
  }
  

  useEffect (()=>{
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const hospitalsData = await getNearbyHospitals();
        const addr = await reverseGeoCode();
        setData(hospitalsData);
        setAddress(addr);
        setLoadingData(false);
      } catch (error) {
        setError(error.message);
        setLoadingData(false);
      }
    };
    fetchData();
  }, [latitude, longitude]);
  
  return (
    <div className="mt-5">
      {loadingAddr && (
        <>
        <CircularProgress/>
        <p className="dark:text-white">Detecting Address...</p>
        </>
      )}

    {address && <p className="dark:text-white mt-4 mb-5 font-normal text-lg">Detected Address: {address.display_name}</p>}


      {loadingData && (
        <>
          <CircularProgress/>
          <p className="dark:text-white">Getting hospitals...</p>
        </>
      )}
      <h1 className="text-slate-600 dark:text-slate-200 text-xl font-bold mt-4 mb-3 border-b-2 border-slate-100">Hospitals Nearby</h1>
      {!latitude && !longitude && <p className="dark:text-orange-500 text-orange-600">Cannot determine location</p>}
      {error && <p className="text-slate-600 dark:text-slate-200 text-xl font-bold">Error: {error}</p>}
      {!loadingData && !error && latitude && longitude && data && (
        <div className="max-h-60 overflow-auto">
          <ul className="divide-y divide-gray-200 dark:divide-slate-600">
            {data.map((hospital, index) => (
              <li key={index} className="py-4">
                <p className="text-slate-600 dark:text-slate-200 text-xl">{hospital.display_name}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
};

export default GeolocationMap;
