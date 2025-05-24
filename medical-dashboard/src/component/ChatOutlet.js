import React from "react";
import { useNavigate } from "react-router-dom";

const ChatOutlet = ({ locations, setSelectedLocation}) => {
  const navigate = useNavigate();
  return (
    <div className="recentCustomers">
      <div className="cardHeader">
        <h2>Available Locations</h2>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {locations.map((location, index) => (
          <div
            key={index}
            onClick={() => setSelectedLocation(location)}
            style={{
              padding: "15px",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              cursor: "pointer",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <h3 style={{ margin: "5px 0" }}>{location.name}</h3>
            <p style={{ margin: "5px 0", color: "#555" }}>{location.address}</p>
            <div style={{ marginTop: "5px" }}>{renderStars(location.rating)}</div>

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                    marginTop: "10px",
                }}
                >
                

                <button
                    onClick={(e) => {
                      navigate("/logged/chat/" + location.name)
                      window.location.reload()
                    
                    }}
                    style={{
                    backgroundColor: "#007BFF", // Blue
                    color: "#fff",
                    padding: "10px 15px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: "bold",
                    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
                    }}
                >
                    Chat Now
                </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

const renderStars = (rating) => {
  const stars = [];
  const filledStars = Math.floor(rating || 0);
  const halfStar = rating && rating % 1 !== 0 ? 1 : 0;

  for (let i = 0; i < filledStars; i++) {
    stars.push("★");
  }
  if (halfStar) {
    stars.push("☆");
  }
  while (stars.length < 5) {
    stars.push("☆");
  }

  return (
    <span style={{ color: "#FFD700", fontSize: "16px" }}>
      {stars.join(" ")}
    </span>
  );
};

export default ChatOutlet;
