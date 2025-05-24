import React, { useEffect, useState } from "react";
import axios from "axios";
import ENV from "../data/Env";

const MilkRecords = () => {
  const [milkRecords, setMilkRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Retrieve username from localStorage
  const user = JSON.parse(localStorage.getItem("user")) || { username: "Guest" };
  const username = user.username;

  useEffect(() => {
    const fetchMilkRecords = async () => {
      try {
        const response = await axios.get(`${ENV.SERVER}/milk-records/${username}`);
        setMilkRecords(response.data.records);
        console.log(response.data);
      } catch (err) {
        setError("Failed to load milk records. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMilkRecords();
  }, [username]);

  return (
    <div className="recentOrders">
      <div style={styles.header}>
        <h2>Milk Records</h2>
      </div>

      {loading && <p style={styles.message}>Loading milk records...</p>}
      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.recordsList}>
        {milkRecords.length > 0 ? (
          milkRecords.map((record) => (
            <div key={record.record_id} style={styles.recordCard}>
              <h3 style={styles.date}>{record.date}</h3>
              <p><strong>Milk Amount:</strong> {record.amount} L</p>
              <p><strong>Cattle ID:</strong> {record.cattle_id}</p>
              <p><strong>Status:</strong> <span style={styles.status}>{record.status}</span></p>
              {record.feedback && <p style={styles.feedback}><strong>Feedback:</strong> {record.feedback}</p>}
            </div>
          ))
        ) : (
          !loading && <p style={styles.message}>No records found.</p>
        )}
      </div>
    </div>
  );
};

// Inline CSS styles
const styles = {
  container: {
    padding: "20px",
    fontFamily: "'Arial', sans-serif",
  },
  header: {
    marginBottom: "20px",
  },
  recordsList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  recordCard: {
    backgroundColor: "#f9f9f9",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
    borderLeft: "5px solid #4CAF50",
  },
  date: {
    marginBottom: "8px",
    color: "#333",
  },
  status: {
    fontWeight: "bold",
    color: "#007BFF",
  },
  feedback: {
    marginTop: "10px",
    fontStyle: "italic",
    color: "#555",
  },
  message: {
    color: "#777",
    fontSize: "16px",
  },
  error: {
    color: "red",
    fontSize: "16px",
  },
};

export default MilkRecords;
