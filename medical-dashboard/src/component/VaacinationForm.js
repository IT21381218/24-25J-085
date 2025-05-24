"use client"

import { useState, useEffect } from "react"
import ENV from "../data/Env"

const VaccinationForm = ({ cattle }) => {
  // Add reminderTime to the form state
  const [formData, setFormData] = useState({
    vaccinationType: "",
    vaccinationDate: "",
    vaccinationDetails: "",
    email: "",
    reminderTime: "08:00", // Default to 8:00 AM
  })

  const [vaccinationRecords, setVaccinationRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: "", type: "" })
  const [user, setUser] = useState(null)

  // Get the current user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  // Fetch existing vaccination records for this user
  useEffect(() => {
    if (user && user.username) {
      fetchVaccinationRecords()
    }
  }, [user])

  const fetchVaccinationRecords = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${ENV.SERVER}/vaccinations/${user.username}`)
      if (response.ok) {
        const data = await response.json()
        setVaccinationRecords(data.vaccinations || [])
      }
    } catch (error) {
      console.error("Error fetching vaccination records:", error)
    } finally {
      setLoading(false)
    }
  }

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  // Handle form submission for vaccination notifier
  const handleVaccinationSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      setMessage({ text: "Please log in to save vaccination records", type: "error" })
      return
    }

    try {
      setLoading(true)

      // In the handleVaccinationSubmit function, update the vaccinationData object:
      const vaccinationData = {
        username: user.username,
        vaccinationType: formData.vaccinationType,
        vaccinationDate: formData.vaccinationDate,
        vaccinationDetails: formData.vaccinationDetails,
        email: formData.email || user.email,
        cattleId: cattle?.id || "general",
        reminderTime: formData.reminderTime,
      }

      const response = await fetch(`${ENV.SERVER}/vaccinations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vaccinationData),
      })

      if (response.ok) {
        const result = await response.json()
        setMessage({ text: "Vaccination record saved successfully!", type: "success" })

        // Add the new record to the list
        setVaccinationRecords((prev) => [
          ...prev,
          {
            id: result.id,
            ...vaccinationData,
          },
        ])

        // Clear the form
        setFormData({
          vaccinationType: "",
          vaccinationDate: "",
          vaccinationDetails: "",
          email: "",
          reminderTime: "08:00",
        })
      } else {
        const error = await response.json()
        setMessage({ text: error.detail || "Failed to save vaccination record", type: "error" })
      }
    } catch (error) {
      console.error("Error saving vaccination record:", error)
      setMessage({ text: "An error occurred while saving the record", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  // Remove vaccination record
  const handleRemoveRecord = async (id) => {
    try {
      setLoading(true)
      const response = await fetch(`${ENV.SERVER}/vaccinations/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setVaccinationRecords((prevRecords) => prevRecords.filter((record) => record.id !== id))
        setMessage({ text: "Vaccination record deleted successfully", type: "success" })
      } else {
        const error = await response.json()
        setMessage({ text: error.detail || "Failed to delete vaccination record", type: "error" })
      }
    } catch (error) {
      console.error("Error deleting vaccination record:", error)
      setMessage({ text: "An error occurred while deleting the record", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Vaccination Reminder and Alert</h2>

      {message.text && (
        <div
          style={{
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "4px",
            backgroundColor: message.type === "success" ? "#d4edda" : "#f8d7da",
            color: message.type === "success" ? "#155724" : "#721c24",
          }}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleVaccinationSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Vaccination Type:</label>
          <select
            name="vaccinationType"
            value={formData.vaccinationType}
            onChange={handleInputChange}
            required
            style={{
              width: "100%",
              padding: "8px",
              fontSize: "16px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              boxSizing: "border-box",
            }}
          >
            <option value="">Select a Vaccination Type</option>
            <option value="Bovine Tuberculosis">Bovine Tuberculosis</option>
            <option value="Brucellosis">Brucellosis</option>
            <option value="Foot and Mouth Disease">Foot and Mouth Disease</option>
            <option value="Black Quarter">Black Quarter</option>
            <option value="Anthrax">Anthrax</option>
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Vaccination Date:</label>
          <input
            type="date"
            name="vaccinationDate"
            value={formData.vaccinationDate}
            onChange={handleInputChange}
            required
            style={{
              width: "100%",
              padding: "8px",
              fontSize: "16px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Add this time input field after the date input in the form: */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Reminder Time:</label>
          <input
            type="time"
            name="reminderTime"
            value={formData.reminderTime}
            onChange={handleInputChange}
            required
            style={{
              width: "100%",
              padding: "8px",
              fontSize: "16px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              boxSizing: "border-box",
            }}
          />
          <small style={{ color: "#666" }}>Time for sending email reminder</small>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Email for Notifications:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder={user?.email || "Enter email for notifications"}
            style={{
              width: "100%",
              padding: "8px",
              fontSize: "16px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              boxSizing: "border-box",
            }}
          />
          <small style={{ color: "#666" }}>Leave empty to use your account email</small>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Additional Details:</label>
          <textarea
            name="vaccinationDetails"
            value={formData.vaccinationDetails}
            onChange={handleInputChange}
            required
            style={{
              width: "100%",
              padding: "8px",
              fontSize: "16px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              boxSizing: "border-box",
              minHeight: "100px",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: loading ? "#cccccc" : "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
            cursor: loading ? "not-allowed" : "pointer",
            marginTop: "15px",
          }}
        >
          {loading ? "Saving..." : "Submit Vaccination Notifier"}
        </button>
      </form>

      <div style={{ marginTop: "30px" }}>
        <h2 style={{ textAlign: "center" }}>Vaccination Notifications</h2>
        {loading && <p>Loading records...</p>}
        {!loading && vaccinationRecords.length === 0 && <p>No vaccination records available.</p>}
        {/* Update the vaccination records display to show the reminder time */}
        {!loading &&
          vaccinationRecords.map((record) => (
            <div
              key={record.id}
              style={{
                backgroundColor: "#fff",
                padding: "15px",
                marginBottom: "15px",
                borderRadius: "8px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                position: "relative",
              }}
            >
              <button
                onClick={() => handleRemoveRecord(record.id)}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  backgroundColor: "transparent",
                  border: "none",
                  color: "red",
                  fontSize: "18px",
                  cursor: "pointer",
                }}
              >
                &#10006; {/* Red cross icon */}
              </button>
              <h3>{record.vaccinationType}</h3>
              <p>
                <strong>Date:</strong> {record.vaccinationDate}
              </p>
              <p>
                <strong>Reminder Time:</strong> {record.reminderTime || "08:00"}
              </p>
              <p>
                <strong>Details:</strong> {record.vaccinationDetails}
              </p>
              <p>
                <strong>Notification Email:</strong> {record.email || user?.email || "Not specified"}
              </p>
              {record.cattleId !== "general" && (
                <p>
                  <strong>Cattle ID:</strong> {record.cattleId}
                </p>
              )}
            </div>
          ))}
      </div>
    </div>
  )
}

export default VaccinationForm
