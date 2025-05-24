import React from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";

const CustomMap = ({ currentLocation, locations, selectedLocation, setSelectedLocation }) => {
  return (
    <div className="recentOrders">
      <div className="cardHeader">
        <h2>Your Current Location</h2>
      </div>

      <div style={{ height: "600px", width: "100%" }}>
        <LoadScript googleMapsApiKey="AIzaSyDTJjnuqF0J18Uu_Ft2TA5R13WsyyDbo4U">
          {/* AIzaSyDAsJYZSQ92_NQAz9kiSpW1XpyuCxRl_uI */}
          <GoogleMap
            mapContainerStyle={{ height: "100%", width: "100%" }}
            center={selectedLocation ? selectedLocation.location : currentLocation}
            zoom={selectedLocation ? 17 : 15}
          >
            {/* User's current location marker */}
            <Marker position={currentLocation} />

            {/* Nearby locations markers */}
            {locations.map((location, index) => (
              <Marker
                key={index}
                position={{ lat: location.location.lat, lng: location.location.lng }}
                icon={{
                  url: "https://static.vecteezy.com/system/resources/thumbnails/019/897/155/small/location-pin-icon-map-pin-place-marker-png.png",
                  scaledSize: new window.google.maps.Size(30, 30),
                }}
                onClick={() => setSelectedLocation(location)}
              />
            ))}

            {/* Show InfoWindow when a location is selected */}
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
    </div>
  );
};

export default CustomMap;
