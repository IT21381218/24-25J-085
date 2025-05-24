
// import React, { useState } from "react";

// const LocationsListContainer = ({ locations, setSelectedLocation, setShowReviewsPopup, setShowAppointmentPopup, user }) => {
//   const [filteredLocations, setFilteredLocations] = useState(locations);
//   const [filterType, setFilterType] = useState("none");

//   const applyFilter = (type) => {
//     let sortedLocations = [...locations];
//     if (type === "nearest") {
//       sortedLocations.sort((a, b) => a.distance - b.distance);
//     } else if (type === "highestRated") {
//       sortedLocations.sort((a, b) => b.rating - a.rating);
//     }
//     setFilterType(type);
//     setFilteredLocations(sortedLocations);
//   };

//   return (
//     <div className="recentCustomers">
//       <div className="cardHeader">
//         <h2>Available Locations</h2>
//       </div>
      
//       <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
//         <button 
//           onClick={() => applyFilter("nearest")} 
//           style={{ ...buttonStyle, backgroundColor: filterType === "nearest" ? "#28a745" : "#ccc" }}
//         >
//           Nearest Location
//         </button>
//         <button 
//           onClick={() => applyFilter("highestRated")} 
//           style={{ ...buttonStyle, backgroundColor: filterType === "highestRated" ? "#007BFF" : "#ccc" }}
//         >
//           Highest Rated
//         </button>
//       </div>
      
//       <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
//         {filteredLocations.map((location, index) => (
//           <div
//             key={index}
//             onClick={() => setSelectedLocation(location)}
//             style={locationCardStyle}
//             onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
//             onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
//           >
//             <h3 style={{ margin: "5px 0" }}>{location.name}</h3>
//             <p style={{ margin: "5px 0", color: "#555" }}>{location.address}</p>
//             <p style={{ margin: "5px 0", fontSize: "14px", color: "#777" }}>Distance: {location.distance} km</p>
//             <div style={{ marginTop: "5px" }}>{renderStars(location.rating)}</div>
            
//             <div style={buttonContainerStyle}>
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setSelectedLocation(location);
//                   setShowReviewsPopup(true);
//                 }}
//                 style={reviewButtonStyle}
//               >
//                 See Reviews
//               </button>
              
//               {user?.role !== 'Veterinarian' && (
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setSelectedLocation(location);
//                     setShowAppointmentPopup(true);
//                   }}
//                   style={appointmentButtonStyle}
//                 >
//                   Make Appointment
//                 </button>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const renderStars = (rating) => {
//   const stars = [];
//   const filledStars = Math.floor(rating || 0);
//   const halfStar = rating && rating % 1 !== 0 ? 1 : 0;

//   for (let i = 0; i < filledStars; i++) {
//     stars.push("★");
//   }
//   if (halfStar) {
//     stars.push("☆");
//   }
//   while (stars.length < 5) {
//     stars.push("☆");
//   }

//   return <span style={{ color: "#FFD700", fontSize: "16px" }}>{stars.join(" ")}</span>;
// };

// const buttonStyle = {
//   color: "#fff",
//   padding: "10px 15px",
//   border: "none",
//   borderRadius: "5px",
//   cursor: "pointer",
//   fontSize: "16px",
//   fontWeight: "bold",
//   boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)"
// };

// const locationCardStyle = {
//   padding: "15px",
//   borderRadius: "8px",
//   backgroundColor: "#f9f9f9",
//   boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//   cursor: "pointer",
//   transition: "transform 0.2s"
// };

// const buttonContainerStyle = {
//   display: "flex",
//   justifyContent: "center",
//   gap: "10px",
//   marginTop: "10px"
// };

// const reviewButtonStyle = {
//   backgroundColor: "#6a0dad", // Purple
//   color: "#fff",
//   padding: "10px 15px",
//   border: "none",
//   borderRadius: "5px",
//   cursor: "pointer",
//   fontSize: "16px",
//   fontWeight: "bold",
//   boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)"
// };

// const appointmentButtonStyle = {
//   backgroundColor: "#007BFF", // Blue
//   color: "#fff",
//   padding: "10px 15px",
//   border: "none",
//   borderRadius: "5px",
//   cursor: "pointer",
//   fontSize: "16px",
//   fontWeight: "bold",
//   boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)"
// };

// export default LocationsListContainer;


"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import ENV from "../data/Env"
import VetQualificationsModal from "./VetQualificationsModal"

const LocationsListContainer = ({
  locations,
  setSelectedLocation,
  setShowReviewsPopup,
  setShowAppointmentPopup,
  user,
}) => {
  const [filteredLocations, setFilteredLocations] = useState(locations)
  const [filterType, setFilterType] = useState("none")
  const [showQualifications, setShowQualifications] = useState(false)
  const [selectedVet, setSelectedVet] = useState(null)
  const [vetsData, setVetsData] = useState({})

  useEffect(() => {
    setFilteredLocations(locations)
  }, [locations])

  // Fetch veterinarian data when component mounts
  useEffect(() => {
    const fetchVetsData = async () => {
      try {
        const response = await axios.get(`${ENV.SERVER}/users/role/Veterinarian`)
        // Create a map of vet names to their data for easy lookup
        const vetsMap = {}
        response.data.forEach((vet) => {
          vetsMap[vet.full_name] = vet
        })
        setVetsData(vetsMap)
      } catch (error) {
        console.error("Error fetching veterinarians:", error)
      }
    }

    fetchVetsData()
  }, [])

  const applyFilter = (type) => {
    const sortedLocations = [...locations]
    if (type === "nearest") {
      sortedLocations.sort((a, b) => a.distance - b.distance)
    } else if (type === "highestRated") {
      sortedLocations.sort((a, b) => b.rating - a.rating)
    }
    setFilterType(type)
    setFilteredLocations(sortedLocations)
  }

  const handleViewQualifications = (e, location) => {
    e.stopPropagation()
    setSelectedVet(location.name)
    setShowQualifications(true)
  }

  const closeQualificationsModal = () => {
    setShowQualifications(false)
    setSelectedVet(null)
  }

  // Check if a location is a registered veterinarian
  const isRegisteredVet = (locationName) => {
    return vetsData[locationName] !== undefined
  }

  return (
    <div className="recentCustomers">
      <div className="cardHeader">
        <h2>Available Locations</h2>
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        <button
          onClick={() => applyFilter("nearest")}
          style={{ ...buttonStyle, backgroundColor: filterType === "nearest" ? "#28a745" : "#ccc" }}
        >
          Nearest Location
        </button>
        <button
          onClick={() => applyFilter("highestRated")}
          style={{ ...buttonStyle, backgroundColor: filterType === "highestRated" ? "#007BFF" : "#ccc" }}
        >
          Highest Rated
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {filteredLocations.map((location, index) => (
          <div
            key={index}
            onClick={() => setSelectedLocation(location)}
            style={locationCardStyle}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <h3 style={{ margin: "5px 0" }}>
              {location.name}
              {isRegisteredVet(location.name) && (
                <span style={verifiedBadgeStyle} title="Verified Veterinarian">
                  ✓
                </span>
              )}
            </h3>
            <p style={{ margin: "5px 0", color: "#555" }}>{location.address}</p>
            <p style={{ margin: "5px 0", fontSize: "14px", color: "#777" }}>Distance: {location.distance} km</p>
            <div style={{ marginTop: "5px" }}>{renderStars(location.rating)}</div>

            <div style={buttonContainerStyle}>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedLocation(location)
                  setShowReviewsPopup(true)
                }}
                style={reviewButtonStyle}
              >
                See Reviews
              </button>

              {user?.role !== "Veterinarian" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedLocation(location)
                    setShowAppointmentPopup(true)
                  }}
                  style={appointmentButtonStyle}
                >
                  Make Appointment
                </button>
              )}

              {/* New button for viewing qualifications - only show for registered vets */}
              {isRegisteredVet(location.name) && (
                <button onClick={(e) => handleViewQualifications(e, location)} style={qualificationsButtonStyle}>
                  View Qualifications
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Qualifications Modal */}
      {showQualifications && selectedVet && (
        <VetQualificationsModal vetName={selectedVet} onClose={closeQualificationsModal} />
      )}
    </div>
  )
}

const renderStars = (rating) => {
  const stars = []
  const filledStars = Math.floor(rating || 0)
  const halfStar = rating && rating % 1 !== 0 ? 1 : 0

  for (let i = 0; i < filledStars; i++) {
    stars.push("★")
  }
  if (halfStar) {
    stars.push("☆")
  }
  while (stars.length < 5) {
    stars.push("☆")
  }

  return <span style={{ color: "#FFD700", fontSize: "16px" }}>{stars.join(" ")}</span>
}

const buttonStyle = {
  color: "#fff",
  padding: "10px 15px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "bold",
  boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
}

const locationCardStyle = {
  padding: "15px",
  borderRadius: "8px",
  backgroundColor: "#f9f9f9",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  cursor: "pointer",
  transition: "transform 0.2s",
}

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "center",
  gap: "10px",
  marginTop: "10px",
  flexWrap: "wrap", // Allow buttons to wrap on smaller screens
}

const reviewButtonStyle = {
  backgroundColor: "#6a0dad", // Purple
  color: "#fff",
  padding: "10px 15px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "bold",
  boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
}

const appointmentButtonStyle = {
  backgroundColor: "#007BFF", // Blue
  color: "#fff",
  padding: "10px 15px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "bold",
  boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
}

const qualificationsButtonStyle = {
  backgroundColor: "#39aa51", // Green
  color: "#fff",
  padding: "10px 15px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "bold",
  boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
}

const verifiedBadgeStyle = {
  display: "inline-block",
  marginLeft: "8px",
  backgroundColor: "#39aa51",
  color: "white",
  borderRadius: "50%",
  width: "20px",
  height: "20px",
  textAlign: "center",
  lineHeight: "20px",
  fontSize: "12px",
  fontWeight: "bold",
}

export default LocationsListContainer
