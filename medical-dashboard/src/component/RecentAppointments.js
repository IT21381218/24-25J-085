import React, { useEffect, useState } from "react";
import ENV from "../data/Env";
import { Link } from "react-router-dom";

const RecentAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Retrieve user details from localStorage
  const [user] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : {};
  });

  useEffect(() => {
    if (!user?.username) {
      setError("User not found.");
      setLoading(false);
      return;
    }

    const fetchAppointments = async () => {
      try {
        const response = await fetch(
          `${ENV.SERVER}/appointments/user/${user.username}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch appointments.");
        }
        const data = await response.json();
        setAppointments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user?.username]);

  return (
    <div className="recentOrders">
      <div className="cardHeader">
        <h2>Recent Appointments</h2>
        <a href="#" className="btn">View All</a>
      </div>
      <br></br>
      <div className="appointmentList">
        {loading ? (
          <p>Loading appointments...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : appointments.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {appointments.map((appointment) => (
              <li
                key={appointment.id}
                style={{
                  padding: "10px",
                  marginBottom: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  backgroundColor: "#f9f9f9",
                  display: "flex",
                  justifyContent: "space-between", // Pushes JOIN button to the right
                  alignItems: "center", // Aligns items properly
                }}
              >
                <div>
                  <strong>{appointment.title}</strong>
                  <p>Date: {appointment.date}</p>
                  <p>Time: {appointment.time}</p>
                  <p style={{ fontSize: "14px", color: "#555" }}>
                    {appointment.message}
                  </p>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "6px 12px", // Slightly increased padding
                      borderRadius: "5px",
                      fontSize: "14px", // Slightly larger font
                      backgroundColor: appointment.accepted ? "#28A745" : "#FFC107",
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                  >
                    {appointment.accepted ? "Accepted" : "Pending"}
                  </span>
                </div>
                <Link
                  style={{
                    display: "inline-block",
                    padding: "8px 16px", // Increased padding
                    borderRadius: "5px",
                    fontSize: "14px", // Slightly larger font
                    backgroundColor: "#1abc9c",
                    color: "#fff",
                    fontWeight: "bold",
                    textDecoration: "none",
                  }}
                  to={"/logged/chat/" + appointment.title}
                >
                  JOIN
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RecentAppointments;
