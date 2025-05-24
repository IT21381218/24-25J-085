"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Notiflix from "notiflix"
import ENV from "../data/Env"

const VetQualifications = ({ veterinarian, onUpdate }) => {
  const [qualifications, setQualifications] = useState([])
  const [newQualification, setNewQualification] = useState({
    degree: "",
    institution: "",
    year: "",
    description: "",
  })
  const [isEditing, setIsEditing] = useState(false)
  const [editIndex, setEditIndex] = useState(null)

  useEffect(() => {
    // Fetch veterinarian qualifications when component mounts
    const fetchQualifications = async () => {
      try {
        const response = await axios.get(`${ENV.SERVER}/vet-qualifications/${veterinarian.username}`)
        if (response.data && response.data.qualifications) {
          setQualifications(response.data.qualifications)
        }
      } catch (error) {
        console.error("Error fetching qualifications:", error)
      }
    }

    fetchQualifications()
  }, [veterinarian.username])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewQualification((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Update the handleAddQualification function to match the backend API expectations
  const handleAddQualification = async () => {
    // Validate inputs
    if (!newQualification.degree || !newQualification.institution || !newQualification.year) {
      Notiflix.Notify.failure("Please fill in all required fields")
      return
    }

    try {
      // If editing an existing qualification
      if (isEditing && editIndex !== null) {
        const updatedQualifications = [...qualifications]
        updatedQualifications[editIndex] = newQualification

        const response = await axios.put(`${ENV.SERVER}/vet-qualifications/${veterinarian.username}`, {
          qualifications: updatedQualifications,
        })

        setQualifications(updatedQualifications)
        Notiflix.Notify.success("Qualification updated successfully")
      } else {
        // Adding a new qualification
        const updatedQualifications = [...qualifications, newQualification]

        // Send the entire updated array instead of just the new qualification
        const response = await axios.put(`${ENV.SERVER}/vet-qualifications/${veterinarian.username}`, {
          qualifications: updatedQualifications,
        })

        setQualifications(updatedQualifications)
        Notiflix.Notify.success("Qualification added successfully")
      }

      // Reset form
      setNewQualification({
        degree: "",
        institution: "",
        year: "",
        description: "",
      })
      setIsEditing(false)
      setEditIndex(null)

      // Notify parent component of update
      if (onUpdate) onUpdate()
    } catch (error) {
      console.error("Error saving qualification:", error)
      // More detailed error logging
      if (error.response) {
        console.error("Response data:", error.response.data)
        console.error("Response status:", error.response.status)
        Notiflix.Notify.failure(`Failed to save qualification: ${error.response.data.detail || "Server error"}`)
      } else {
        Notiflix.Notify.failure("Failed to save qualification. Network error.")
      }
    }
  }

  const handleEdit = (index) => {
    setNewQualification(qualifications[index])
    setIsEditing(true)
    setEditIndex(index)
  }

  const handleDelete = async (index) => {
    Notiflix.Confirm.show(
      "Confirm Deletion",
      "Are you sure you want to delete this qualification?",
      "Yes, Delete",
      "Cancel",
      async () => {
        try {
          const updatedQualifications = qualifications.filter((_, i) => i !== index)

          await axios.put(`${ENV.SERVER}/vet-qualifications/${veterinarian.username}`, {
            qualifications: updatedQualifications,
          })

          setQualifications(updatedQualifications)
          Notiflix.Notify.success("Qualification deleted successfully")

          // Notify parent component of update
          if (onUpdate) onUpdate()
        } catch (error) {
          console.error("Error deleting qualification:", error)
          Notiflix.Notify.failure("Failed to delete qualification")
        }
      },
    )
  }

  const handleCancel = () => {
    setNewQualification({
      degree: "",
      institution: "",
      year: "",
      description: "",
    })
    setIsEditing(false)
    setEditIndex(null)
  }

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2 style={{ marginBottom: "20px", color: "#39aa51" }}>Professional Qualifications</h2>

      {/* Qualification Form */}
      <div style={{ marginBottom: "30px", padding: "15px", backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
        <h3 style={{ marginBottom: "15px" }}>{isEditing ? "Edit Qualification" : "Add New Qualification"}</h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "15px", marginBottom: "15px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>Degree/Certification *</label>
            <input
              type="text"
              name="degree"
              value={newQualification.degree}
              onChange={handleInputChange}
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              placeholder="e.g., DVM, PhD in Veterinary Science"
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>Institution *</label>
            <input
              type="text"
              name="institution"
              value={newQualification.institution}
              onChange={handleInputChange}
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              placeholder="e.g., University of Veterinary Medicine"
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>Year Completed *</label>
            <input
              type="text"
              name="year"
              value={newQualification.year}
              onChange={handleInputChange}
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              placeholder="e.g., 2018"
            />
          </div>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>Description</label>
          <textarea
            name="description"
            value={newQualification.description}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc", minHeight: "80px" }}
            placeholder="Additional details about your qualification"
          />
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handleAddQualification}
            style={{
              backgroundColor: "#39aa51",
              color: "white",
              padding: "8px 15px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            {isEditing ? "Update Qualification" : "Add Qualification"}
          </button>

          {isEditing && (
            <button
              onClick={handleCancel}
              style={{
                backgroundColor: "#6c757d",
                color: "white",
                padding: "8px 15px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Qualifications List */}
      <div>
        <h3 style={{ marginBottom: "15px" }}>Your Qualifications</h3>

        {qualifications.length === 0 ? (
          <p style={{ color: "#6c757d", fontStyle: "italic" }}>No qualifications added yet.</p>
        ) : (
          <div style={{ display: "grid", gap: "15px" }}>
            {qualifications.map((qual, index) => (
              <div
                key={index}
                style={{
                  padding: "15px",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <h4 style={{ marginBottom: "5px", color: "#39aa51" }}>{qual.degree}</h4>
                  <p style={{ margin: "0 0 5px 0", color: "#333" }}>
                    {qual.institution}, {qual.year}
                  </p>
                  {qual.description && <p style={{ margin: "0", color: "#6c757d" }}>{qual.description}</p>}
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => handleEdit(index)}
                    style={{
                      backgroundColor: "#007bff",
                      color: "white",
                      padding: "5px 10px",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(index)}
                    style={{
                      backgroundColor: "#dc3545",
                      color: "white",
                      padding: "5px 10px",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default VetQualifications
