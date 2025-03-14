// import React, { useState, useEffect } from 'react';
// import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
// import axios from 'axios';

// const CustomMap = () => {
//   const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });
//   const [locations, setLocations] = useState([]); // State to store locations from the backend
//   const [loading, setLoading] = useState(false);
//   const [selectedLocation, setSelectedLocation] = useState(null);

//   useEffect(() => {
//     // Fetch current location
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setCurrentLocation({
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           });
//         },
//         (error) => {
//           console.error('Error fetching location:', error);
//           alert('Failed to get your location.');
//         }
//       );
//     } else {
//       alert('Geolocation is not supported by your browser.');
//     }
//   }, []);

//   useEffect(() => {
//     if (currentLocation.lat && currentLocation.lng) {
//       // Fetch nearby locations from your FastAPI backend
//       const fetchNearbyLocations = async () => {
//         setLoading(true);
//         try {
//           const response = await axios.post('http://localhost:8000/nearby_locations', {
//             latitude: currentLocation.lat,
//             longitude: currentLocation.lng,
//           });

//           if (response.data.locations) {
//             setLocations(response.data.locations);
//             console.log('Nearby locations:', response.data.locations); // Log the locations
//           }
//         } catch (error) {
//           console.error('Error fetching nearby locations:', error);
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchNearbyLocations();
//     }
//   }, [currentLocation]);

//   return (
//     <div className="recentOrders">
//       <div className="cardHeader">
//         <h2>Your Current Location</h2>
//       </div>

//       {/* Google Map Integration */}
//       <div style={{ height: '600px', width: '100%' }}>
//         <LoadScript googleMapsApiKey="AIzaSyDAsJYZSQ92_NQAz9kiSpW1XpyuCxRl_uI">
//           <GoogleMap
//             mapContainerStyle={{ height: '100%', width: '100%' }}
//             center={currentLocation}
//             zoom={15}
//           >
//             {/* User's current location marker */}
//             <Marker position={currentLocation} />

//             {/* Mark nearby locations */}
//             {locations.map((location, index) => (
//               <Marker
//                 onClick={() => setSelectedLocation(location)}
//                 key={index}
//                 position={{
//                   lat: location.location.lat,
//                   lng: location.location.lng,
//                 }}
//                 icon={{
//                   url: 'https://static.vecteezy.com/system/resources/thumbnails/019/897/155/small/location-pin-icon-map-pin-place-marker-png.png', // Custom marker icon
//                   scaledSize: new window.google.maps.Size(30, 30), // Custom size
//                 }}
//               />
//             ))}
//             {selectedLocation && (
//               <InfoWindow
//                 position={{
//                   lat: selectedLocation.location.lat,
//                   lng: selectedLocation.location.lng,
//                 }}
//                 onCloseClick={() => setSelectedLocation(null)} // Close InfoWindow
//               >
//                 <div>
//                   <h4>{selectedLocation.name}</h4>
//                   <p>{selectedLocation.address}</p>
//                 </div>
//               </InfoWindow>
//             )}
//           </GoogleMap>
//         </LoadScript>
//       </div>

//       {loading && <p>Loading nearby locations...</p>}
//     </div>
//   );
// };

// export default CustomMap;






// import React, { useState, useEffect } from 'react';
// import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
// import axios from 'axios';

// const GOOGLE_MAPS_API_KEY = "AIzaSyDAsJYZSQ92_NQAz9kiSpW1XpyuCxRl_uI";
// const BACKEND_URL = "http://localhost:8000/nearby_locations";
// const MARKER_ICON = {
//   url: "https://static.vecteezy.com/system/resources/thumbnails/019/897/155/small/location-pin-icon-map-pin-place-marker-png.png",
//   scaledSize: new window.google.maps.Size(30, 30), // Custom size
// };

// const CustomMap = () => {
//   const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });
//   const [locations, setLocations] = useState([]); // Nearby locations from the backend
//   const [loading, setLoading] = useState(false);
//   const [selectedLocation, setSelectedLocation] = useState(null);

//   // Get user's current location
//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setCurrentLocation({
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           });
//         },
//         (error) => {
//           console.error("Error fetching location:", error);
//           alert("Failed to get your location.");
//         }
//       );
//     } else {
//       alert("Geolocation is not supported by your browser.");
//     }
//   }, []);

//   // Fetch nearby locations from the backend
//   useEffect(() => {
//     const fetchNearbyLocations = async () => {
//       if (!currentLocation.lat || !currentLocation.lng) return;

//       setLoading(true);
//       try {
//         const response = await axios.post(BACKEND_URL, {
//           latitude: currentLocation.lat,
//           longitude: currentLocation.lng,
//         });

//         if (response.data.locations) {
//           setLocations(response.data.locations);
//           console.log("Nearby locations:", response.data.locations);
//         }
//       } catch (error) {
//         console.error("Error fetching nearby locations:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNearbyLocations();
//   }, [currentLocation]);

//   return (
//     <div className="recentOrders">
//       <div className="cardHeader">
//         <h2>Your Current Location</h2>
//       </div>

//       {/* Google Map Integration */}
//       <div style={{ height: "600px", width: "100%" }}>
//         <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
//           <GoogleMap
//             mapContainerStyle={{ height: "100%", width: "100%" }}
//             center={currentLocation}
//             zoom={15}
//           >
//             {/* User's Current Location Marker */}
//             <Marker position={currentLocation} />

//             {/* Nearby Locations Markers */}
//             {locations.map((location, index) => (
//               <Marker
//                 key={index}
//                 position={{ lat: location.location.lat, lng: location.location.lng }}
//                 icon={MARKER_ICON}
//                 onClick={() => setSelectedLocation(location)}
//               />
//             ))}

//             {/* InfoWindow for Selected Location */}
//             {selectedLocation && (
//               <InfoWindow
//                 position={{
//                   lat: selectedLocation.location.lat,
//                   lng: selectedLocation.location.lng,
//                 }}
//                 onCloseClick={() => setSelectedLocation(null)}
//               >
//                 <div>
//                   <h4>{selectedLocation.name}</h4>
//                   <p>{selectedLocation.address}</p>
//                 </div>
//               </InfoWindow>
//             )}
//           </GoogleMap>
//         </LoadScript>
//       </div>

//       {loading && <p>Loading nearby locations...</p>}
//     </div>
//   );
// };

// export default CustomMap;





import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import axios from 'axios';

const GOOGLE_MAPS_API_KEY = "AIzaSyDAsJYZSQ92_NQAz9kiSpW1XpyuCxRl_uI";
const BACKEND_URL = "http://localhost:8000/nearby_locations";
const MARKER_ICON = {
  url: "https://static.vecteezy.com/system/resources/thumbnails/019/897/155/small/location-pin-icon-map-pin-place-marker-png.png",
  scaledSize: new window.google.maps.Size(30, 30),
};

const CustomMap = () => {
  const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    fetchNearbyLocations();
  }, [currentLocation]);

  // const getCurrentLocation = () => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         setCurrentLocation({
  //           lat: position.coords.latitude,
  //           lng: position.coords.longitude,
  //         });
  //       },
  //       (error) => {
  //         console.error("Error fetching location:", error);
  //         alert("Failed to get your location.");
  //       }
  //     );
  //   } else {
  //     alert("Geolocation is not supported by your browser.");
  //   }
  // };

  const fetchNearbyLocations = async () => {
    if (!currentLocation.lat || !currentLocation.lng) return;
    setLoading(true);
    try {
      const response = await axios.post(BACKEND_URL, {
        latitude: currentLocation.lat,
        longitude: currentLocation.lng,
      });
      if (response.data.locations) {
        setLocations(response.data.locations);
        console.log("Nearby locations:", response.data.locations);
      }
    } catch (error) {
      console.error("Error fetching nearby locations:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recent-orders">
      <div className="card-header">
        <h2>Your Current Location</h2>
      </div>
      <div style={{ height: "600px", width: "100%" }}>
        <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
          <GoogleMap mapContainerStyle={{ height: "100%", width: "100%" }} center={currentLocation} zoom={15}>
            <Marker position={currentLocation} />
            {locations.map((location, index) => (
              <Marker
                key={index}
                position={{ lat: location.location.lat, lng: location.location.lng }}
                icon={MARKER_ICON}
                onClick={() => setSelectedLocation(location)}
              />
            ))}
            {selectedLocation && (
              <InfoWindow
                position={{
                  lat: selectedLocation.location.lat,
                  lng: selectedLocation.location.lng,
                }}
                onCloseClick={() => setSelectedLocation(null)}
              >
                <div>
                  <h4>{selectedLocation.name}</h4>
                  <p>{selectedLocation.address}</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </div>
      {loading && <p>Loading nearby locations...</p>}
    </div>
  );
};

export default CustomMap;
