import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const GeolocationMap = ({ latitude, longitude }) => {
    const [loadingData, setLoadingData] = useState(true);
    const [loadingAddr, setLoadingAddr] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);
    const [address, setAddress] = useState(null);

    const fetchNearbyHospitals = async (latitude, longitude, radius) => {
      // Define the Overpass API query to search for hospitals near the specified latitude and longitude
      const query = `
          [out:json];
          (
              node
                  ["amenity"="hospital"]
                  (around:${radius}, ${latitude}, ${longitude});
              way
                  ["amenity"="hospital"]
                  (around:${radius}, ${latitude}, ${longitude});
              relation
                  ["amenity"="hospital"]
                  (around:${radius}, ${latitude}, ${longitude});
          );
          out body;
      `;

      console.log('Query: ', query);
  
      // Define the Overpass API endpoint
      const overpassUrl = 'https://overpass-api.de/api/interpreter';
  
      try {
          // Send the query to the Overpass API endpoint
          const response = await fetch(overpassUrl, {
              method: 'POST',
              headers: {
                  'Content-Type': 'text/plain',
              },
              body: query,
          });

          console.log('API Response: ',response);
  
          // Check if the response was successful
          if (!response.ok) {
              throw new Error(`Failed to fetch data from Overpass API: ${response.statusText}`);
          }
  
          // Parse the JSON response
          const data = await response.json();

          console.log('Data returned: ',data);
  
          // Filter the response to extract hospitals and their details
          const hospitals = data.elements.map(element => {
              return {
                  id: element.id,
                  name: element.tags?.name || 'Unnamed hospital',
                  latitude: element.lat || element.center?.lat,
                  longitude: element.lon || element.center?.lon,
              };
          });

          console.log('Filtered Hospitals: ',hospitals);
  
          return hospitals;
      } catch (error) {
          console.error('Error fetching data from Overpass API:', error);
          return [];
      }
  };
  
  
    // Function to fetch reverse geocoding data
    const reverseGeoCode = async () => {
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

        try {

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch address data. HTTP status ${response.status}`);
            }

            // Parse the JSON response
            const data = await response.json();

            return data;
        } catch (error) {
            console.error('Error fetching address data:', error);
            return null;
        } finally {
            setLoadingAddr(false);
        }
    };

    // Fetch data when latitude and longitude change
    useEffect(() => {
      const fetchData = async () => {
          setLoadingData(true);
          try {
              const radius = 5000; // Specify the search radius in meters
              const hospitalsData = await fetchNearbyHospitals(latitude, longitude, radius);
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
  

    // Render the component
    return (
        <div className="mt-5">
            {loadingAddr && (
                <>
                    <CircularProgress />
                    <p className="dark:text-white">Detecting Address...</p>
                </>
            )}

            {address && (
                <>
                    <p className="dark:text-white mt-4 mb-5 font-normal text-lg">Detected Address: {address.display_name}</p>
                </>
            )}

            {loadingData && (
                <>
                    <CircularProgress />
                    <p className="dark:text-white">Getting hospitals...</p>
                </>
            )}

            <h1 className="text-slate-600 dark:text-slate-200 text-xl font-bold mt-4 mb-3 border-b-2 border-slate-100">Hospitals Nearby</h1>
            
            {error && (
                <p className="text-slate-600 dark:text-slate-200 text-xl font-bold">Error: {error}</p>
            )}

            {!loadingData && !error && latitude && longitude && data && (
              <div className="max-h-60 overflow-auto">
              <ul className="divide-y divide-gray-200 dark:divide-slate-600">
                  {data.length > 0 ? (
                      data.map((hospital, index) => (
                          <li key={hospital.id || index} className="py-4">
                              {/* Display the hospital's name */}
                              <p className="text-slate-600 dark:text-slate-200 text-xl">{hospital.name || 'N/A'}</p>
          
                              {/* Display the hospital's address */}
                              <p className="text-slate-600 dark:text-slate-200">
                                  Address: {hospital.tags?.['addr:housenumber'] || 'N/A'} {hospital.tags?.['addr:street'] || 'N/A'}, 
                                  {hospital.tags?.['addr:city'] || 'N/A'}, {hospital.tags?.['addr:state'] || 'N/A'}, {hospital.tags?.['addr:postcode'] || 'N/A'}
                              </p>
          
                              {/* Display whether or not it is an emergency hospital */}
                              <p className="text-slate-600 dark:text-slate-200">
                                  Emergency: {hospital.tags?.emergency === 'yes' ? 'Yes' : 'No'}
                              </p>
          
                              {/* Optionally, display other details such as phone number, website, etc. */}
                              {/* Phone number: */}
                              <p className="text-slate-600 dark:text-slate-200">
                                  Phone: {hospital.tags?.phone || 'N/A'}
                              </p>
          
                              {/* Website link: */}
                              {hospital.tags?.website ? (
                                  <p className="text-slate-600 dark:text-slate-200">
                                      <a href={hospital.tags.website} target="_blank" rel="noopener noreferrer">
                                          Website
                                      </a>
                                  </p>
                              ) : (
                                  <p className="text-slate-600 dark:text-slate-200">Website: N/A</p>
                              )}
                          </li>
                      ))
                  ) : (
                      <p className="dark:text-white">No hospitals found.</p>
                  )}
              </ul>
          </div>
          
           
            )}
        </div>
    );
};

export default GeolocationMap;
