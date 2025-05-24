import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import CustomMap from "../components/CustomMap";
import LocationsListContainer from "../components/LocationListContainer";
import axios from "axios";
import ENV from "../data/Env";

const VetLocate = () => {
  const [user, setUser] = useState(() => {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : {};
  });
  const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showReviewsPopup, setShowReviewsPopup] = useState(false); 
  const [showAppointmentPopup, setShowAppointmentPopup] = useState(false);

  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [authorName, setAuthorName] = useState("");

  const [formData, setFormData] = useState({
    // title: "",
    date: "",
    time: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (outlet) => {
    const payload = {
      ...formData,
      title: outlet,
      username: user?.username, // Replace with actual user
      accepted: false,
    };

    try {
      const response = await fetch(ENV.SERVER+"/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Appointment created successfully!");
      } else {
        alert(`Error: ${result.detail}`);
      }
    } catch (error) {
      console.error("Error submitting appointment:", error);
      alert("Failed to create appointment.");
    }
  };

  useEffect(() => {
    // Fetch user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(userLocation);
        },
        (error) => {
          console.error("Error fetching location:", error);
          alert("Failed to get your location.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  }, []);

  useEffect(() => {
    if (currentLocation.lat && currentLocation.lng) {
      // Fetch nearby locations from backend
      const fetchNearbyLocations = async () => {
        setLoading(true);
        try {
          const response = await axios.post(`${ENV.SERVER}/nearby_locations`, {
            latitude: currentLocation.lat,
            longitude: currentLocation.lng,
          });
          console.log(currentLocation.lat)

          if (response.data.locations) {
            console.log(response)
            setLocations(response.data.locations);
          }
        } catch (error) {
          console.error("Error fetching nearby locations:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchNearbyLocations();
    }
  }, [currentLocation]);

  const submitReview = async () => {
    if (!selectedLocation) return;
    console.log(selectedLocation)
  
    const reviewData = {
      author_name: user.username || "Anonymous",
      rating: 5,
      text: reviewText,
      location_name: selectedLocation.name
    };
  
    try {
      await axios.post(`${ENV.SERVER}/submit_review`, reviewData);
  
      alert("Review submitted successfully!");
      setShowReviewsPopup(false);
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review.");
    }
  };

  return (
    <div className="dashContainer">
      <Sidebar />
      <div className="main">
        <div className="details">
          <CustomMap
            currentLocation={currentLocation}
            locations={locations}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
          />
          <LocationsListContainer
            locations={locations}
            user={user}
            setSelectedLocation={setSelectedLocation}
            setShowReviewsPopup={setShowReviewsPopup}
            setShowAppointmentPopup={setShowAppointmentPopup}
          />
        </div>
 
      </div>
      {/* Review Popup */}
      {showReviewsPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "10px",
              width: "400px",
              maxWidth: "90%",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            }}
          >
            <button
              style={{
                position: "absolute",
                right: "20px",
                top: "20px",
                width: "30px",
                height: "30px",
                backgroundColor: "#ff4d4d",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                fontSize: "28px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
              }}
              onClick={() => setShowReviewsPopup(false)}
            >
              ×
            </button>
            <h2>Reviews for {selectedLocation?.name}</h2>
            <div
              style={{
                maxHeight: "200px",
                overflowY: "auto",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                marginBottom: "10px",
              }}
            >
              {selectedLocation?.reviews?.length > 0 ? (
                selectedLocation.reviews.map((review, index) => (
                  <div key={index} style={{ marginBottom: "10px" }}>
                    <p>
                      <strong>{review.author_name}</strong>: {review.text}
                    </p>
                    <p>Rating: {review.rating} ★</p>
                  </div>
                ))
              ) : (
                <p>No reviews available.</p>
              )}
            </div>
            <input
              type="text"
              placeholder="Write a review..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "8px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            />
            <select
                value={reviewRating}
                onChange={(e) => setReviewRating(Number(e.target.value))}
                style={{
                  width: "100%",
                  padding: "8px",
                  marginBottom: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                }}
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num} ★
                  </option>
                ))}
            </select>
            <button
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#007BFF",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={() => submitReview()}
            >
              Submit Review
            </button>
          </div>
        </div>
      )}

      {/* Appointment Popup */}
      {showAppointmentPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "10px",
              width: "400px",
              maxWidth: "90%",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            }}
          >
            <button
              style={{
                position: "absolute",
                right: "20px",
                top: "20px",
                width: "30px",
                height: "30px",
                backgroundColor: "#ff4d4d",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                fontSize: "28px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
              }}
              onClick={() => setShowAppointmentPopup(false)}
            >
              ×
            </button>
            <h2>Book Appointment at {selectedLocation?.name}</h2>
            {/* <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} style={inputStyle} /> */}
            <input type="date" name="date" value={formData.date} onChange={handleChange} style={inputStyle} />
            <input type="time" name="time" value={formData.time} onChange={handleChange} style={inputStyle} />
            <textarea name="message" placeholder="Message" value={formData.message} onChange={handleChange} style={inputStyle} />
            <button
              onClick={() =>handleSubmit(selectedLocation?.name)}
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#28A745",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Submit Appointment
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  marginBottom: "8px",
  border: "1px solid #ccc",
  borderRadius: "5px",
};

export default VetLocate;
