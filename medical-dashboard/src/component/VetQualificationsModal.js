"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import ENV from "../data/Env"

const VetQualificationsModal = ({ vetName, onClose }) => {
  const [qualifications, setQualifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [vetInfo, setVetInfo] = useState(null)

  useEffect(() => {
    const fetchVetInfo = async () => {
      try {
        // First, get the vet's username from their full name
        const usersResponse = await axios.get(`${ENV.SERVER}/users/role/Veterinarian`)
        const vets = usersResponse.data
        const vet = vets.find((v) => v.full_name === vetName)

        if (vet) {
          setVetInfo(vet)

          // Then fetch their qualifications
          try {
            const qualResponse = await axios.get(`${ENV.SERVER}/vet-qualifications/${vet.username}`)
            if (qualResponse.data && qualResponse.data.qualifications) {
              setQualifications(qualResponse.data.qualifications)
            }
          } catch (qualError) {
            // If there's an error fetching qualifications, just show empty qualifications
            console.error("Error fetching qualifications:", qualError)
            setQualifications([])
          }
        } else {
          setError("Veterinarian not found")
        }
      } catch (error) {
        console.error("Error fetching vet qualifications:", error)
        setError("Failed to load veterinarian information")
      } finally {
        setLoading(false)
      }
    }

    if (vetName) {
      fetchVetInfo()
    } else {
      setLoading(false)
      setError("No veterinarian specified")
    }
  }, [vetName])

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <button style={closeButtonStyle} onClick={onClose}>
          ×
        </button>

        <h2 style={headerStyle}>Veterinarian Qualifications</h2>

        {loading ? (
          <div style={loadingStyle}>Loading veterinarian information...</div>
        ) : error ? (
          <div style={errorStyle}>{error}</div>
        ) : !vetInfo ? (
          <div style={errorStyle}>Veterinarian information not available</div>
        ) : (
          <>
            <div style={vetInfoStyle}>
              <div style={vetNameStyle}>{vetInfo.full_name}</div>
              {vetInfo.specialization && (
                <div style={specializationStyle}>Specialization: {vetInfo.specialization}</div>
              )}
              <div style={contactInfoStyle}>
                <p>
                  <strong>Email:</strong> {vetInfo.email}
                </p>
                <p>
                  <strong>Contact:</strong> {vetInfo.contact}
                </p>
              </div>
            </div>

            {qualifications.length === 0 ? (
              <div style={noQualificationsStyle}>No qualifications have been added by this veterinarian.</div>
            ) : (
              <div style={qualificationsListStyle}>
                <h3 style={subHeaderStyle}>Professional Qualifications</h3>
                {qualifications.map((qual, index) => (
                  <div key={index} style={qualificationItemStyle}>
                    <div style={qualificationTitleStyle}>{qual.degree}</div>
                    <div style={qualificationDetailsStyle}>
                      {qual.institution}, {qual.year}
                    </div>
                    {qual.description && <div style={qualificationDescriptionStyle}>{qual.description}</div>}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// Styles
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
}

const modalStyle = {
  backgroundColor: "white",
  borderRadius: "8px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  padding: "25px",
  width: "90%",
  maxWidth: "600px",
  maxHeight: "80vh",
  overflow: "auto",
  position: "relative",
}

const closeButtonStyle = {
  position: "absolute",
  top: "10px",
  right: "15px",
  background: "none",
  border: "none",
  fontSize: "24px",
  cursor: "pointer",
  color: "#666",
}

const headerStyle = {
  color: "#39aa51",
  marginBottom: "15px",
  borderBottom: "2px solid #f0f0f0",
  paddingBottom: "10px",
}

const subHeaderStyle = {
  color: "#333",
  marginBottom: "10px",
  fontSize: "18px",
}

const vetInfoStyle = {
  marginBottom: "20px",
  padding: "15px",
  backgroundColor: "#f9f9f9",
  borderRadius: "8px",
}

const vetNameStyle = {
  fontSize: "22px",
  fontWeight: "bold",
  color: "#333",
  marginBottom: "5px",
}

const specializationStyle = {
  fontSize: "16px",
  color: "#666",
  marginBottom: "10px",
}

const contactInfoStyle = {
  fontSize: "14px",
  color: "#555",
  marginTop: "10px",
}

const qualificationsListStyle = {
  display: "grid",
  gap: "15px",
}

const qualificationItemStyle = {
  padding: "15px",
  backgroundColor: "#f9f9f9",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
}

const qualificationTitleStyle = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#39aa51",
  marginBottom: "5px",
}

const qualificationDetailsStyle = {
  fontSize: "16px",
  color: "#333",
  marginBottom: "5px",
}

const qualificationDescriptionStyle = {
  fontSize: "14px",
  color: "#666",
  fontStyle: "italic",
  marginTop: "5px",
}

const loadingStyle = {
  textAlign: "center",
  padding: "20px",
  color: "#666",
}

const errorStyle = {
  textAlign: "center",
  padding: "20px",
  color: "#dc3545",
}

const noQualificationsStyle = {
  textAlign: "center",
  padding: "20px",
  color: "#666",
  fontStyle: "italic",
  backgroundColor: "#f9f9f9",
  borderRadius: "8px",
}

export default VetQualificationsModal
