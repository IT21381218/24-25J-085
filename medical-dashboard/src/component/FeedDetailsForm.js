"use client"

import { useState, useEffect } from "react"
import ENV from "../data/Env"
import axios from "axios"

const FeedDetailsForm = ({ temp }) => {
  const [formData, setFormData] = useState({
    temperature: temp && typeof temp === "number" ? temp : 38.5, // Default to 38.5 if temp is not a number
    milkIntake: "",
    bodyScore: "", // Add Body Score
    rumenFill: "", // Add Rumen Fill
  })

  const [records, setRecords] = useState([])
  const [prediction, setPrediction] = useState(null)
  const [explanation, setExplanation] = useState("")
  const [featureImportance, setFeatureImportance] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [usingFallback, setUsingFallback] = useState(false)

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setPrediction(null)
    setExplanation("")
    setFeatureImportance(null)
    setUsingFallback(false)

    try {
      // Create a payload with properly parsed numeric values
      const payload = {
        temperature: Number.parseFloat(formData.temperature) || 38.5, // Default value if parsing fails
        milkIntake: Number.parseFloat(formData.milkIntake) || 0,
        bodyScore: Number.parseFloat(formData.bodyScore) || 0,
        rumenFill: Number.parseFloat(formData.rumenFill) || 0,
      }

      // Log the data being sent to the backend
      console.log("Sending data to backend:", payload)

      // Send data to backend for milk quality prediction
      const response = await axios.post(`${ENV.SERVER}/predict-milk-quality-feed`, payload)

      console.log("Backend response:", response.data)

      // Extract prediction data
      const predictedQuality = response.data.predicted_quality
      const predictionExplanation = response.data.explanation || ""
      const importanceData = response.data.feature_importance || {}
      const fallbackUsed = response.data.using_fallback_model || false

      // Update state with prediction results
      setPrediction(predictedQuality)
      setExplanation(predictionExplanation)
      setFeatureImportance(importanceData)
      setUsingFallback(fallbackUsed)

      // Create a new record with the prediction
      const newRecord = {
        id: records.length + 1,
        ...formData,
        milkQuality: predictedQuality,
        timestamp: new Date().toLocaleString(),
      }

      // Add the record to the records array
      setRecords((prevRecords) => [...prevRecords, newRecord])

      // Reset form
      setFormData({
        temperature: temp && typeof temp === "number" ? temp : 38.5,
        milkIntake: "",
        bodyScore: "",
        rumenFill: "",
      })
    } catch (err) {
      console.error("Error predicting milk quantity:", err)

      // More detailed error message
      let errorMessage = "Failed to predict milk quantity. Please try again."
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response data:", err.response.data)
        console.error("Error response status:", err.response.status)

        if (err.response.data && err.response.data.detail) {
          errorMessage = `Server error: ${err.response.data.detail}`
        }
      } else if (err.request) {
        // The request was made but no response was received
        errorMessage = "No response from server. Please check your connection."
      }

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Update form data when parent prop (`temp`) changes
  useEffect(() => {
    // Only update if temp is a valid number
    if (temp && typeof temp === "number") {
      setFormData((prevData) => ({
        ...prevData,
        temperature: temp,
      }))
    }
  }, [temp])

  // Function to get color based on milk quality
  const getQualityColor = (quality) => {
    if (!quality || quality === "Predicting...") return "#777"
    switch (quality.toLowerCase()) {
      case "high":
        return "#4CAF50"
      case "medium":
        return "#FFC107"
      case "low":
        return "#F44336"
      default:
        return "#777"
    }
  }

  // For demonstration purposes - mock prediction if backend fails
  const handleMockPrediction = () => {
    const qualities = ["low", "medium", "high"]
    const randomQuality = qualities[Math.floor(Math.random() * qualities.length)]

    const mockExplanation = `This is a demo prediction. The milk quantity is predicted to be ${randomQuality.toUpperCase()} based on the provided parameters. In a real scenario, this would be determined by analyzing temperature, milk intake, body score, and rumen fill values.`

    const mockImportance = {
      temperature: 0.3,
      milkIntake: 0.2,
      bodyScore: 0.3,
      rumenFill: 0.2,
    }

    setPrediction(randomQuality)
    setExplanation(mockExplanation)
    setFeatureImportance(mockImportance)
    setUsingFallback(true)

    const newRecord = {
      id: records.length + 1,
      ...formData,
      milkQuality: randomQuality,
      timestamp: new Date().toLocaleString(),
    }

    setRecords((prevRecords) => [...prevRecords, newRecord])

    setFormData({
      temperature: temp && typeof temp === "number" ? temp : 38.5,
      milkIntake: "",
      bodyScore: "",
      rumenFill: "",
    })

    setError(null)
  }

  // Render feature importance chart
  const renderFeatureImportance = () => {
    if (!featureImportance) return null

    const maxValue = Math.max(...Object.values(featureImportance))
    const features = Object.entries(featureImportance).sort((a, b) => b[1] - a[1])

    return (
      <div style={{ marginTop: "20px" }}>
        <h4 style={{ marginBottom: "10px" }}>Feature Importance</h4>
        {features.map(([feature, value]) => (
          <div key={feature} style={{ marginBottom: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ width: "120px" }}>{formatFeatureName(feature)}:</span>
              <div style={{ flex: 1, marginLeft: "10px" }}>
                <div
                  style={{
                    height: "20px",
                    width: `${(value / maxValue) * 100}%`,
                    backgroundColor: getQualityColor(prediction),
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    paddingRight: "5px",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "12px",
                  }}
                >
                  {(value * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Format feature name for display
  const formatFeatureName = (name) => {
    switch (name) {
      case "temperature":
        return "Temperature"
      case "milkIntake":
        return "Milk Intake"
      case "bodyScore":
        return "Body Score"
      case "rumenFill":
        return "Rumen Fill"
      default:
        return name
    }
  }

  // Add this function after the formatFeatureName function
  const getMilkQuantityRecommendation = (quality) => {
    if (!quality) return ""

    switch (quality.toLowerCase()) {
      case "low":
        return "To increase milk quantity, consider increasing milk intake by 20-30%. Ensure the cow is well-hydrated and provide high-quality feed with proper protein content. Monitor temperature regularly and consult a veterinarian if it remains outside the normal range."
      case "medium":
        return "To further improve milk quantity, gradually increase milk intake by 10-15%. Maintain optimal body score between 3.0-4.5 and ensure consistent feeding schedule. Supplementing with balanced nutrients can help reach high milk production levels."
      case "high":
        return "Excellent milk quantity! Maintain current feeding practices and continue monitoring body score and rumen fill. Ensure consistent feeding times and high-quality feed to sustain this production level."
      default:
        return ""
    }
  }

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "0 auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Feed Details Form</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Temperature (°C):</label>
          <input
            type="number"
            name="temperature"
            value={formData.temperature}
            onChange={handleInputChange}
            placeholder="Enter temperature (e.g., 38.5)"
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
          <small style={{ color: "#666" }}>Normal range: 38.0 - 39.5°C</small>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Milk Intake (ml):</label>
          <input
            type="number"
            name="milkIntake"
            value={formData.milkIntake}
            onChange={handleInputChange}
            placeholder="Enter milk intake in ml"
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
          <small style={{ color: "#666" }}>Recommended: 1000ml or more</small>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Body Score (1-5):</label>
          <input
            type="number"
            name="bodyScore"
            value={formData.bodyScore}
            onChange={handleInputChange}
            placeholder="Enter body score (1-5)"
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
          <small style={{ color: "#666" }}>Optimal range: 3.0 - 4.5</small>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Rumen Fill (1-5):</label>
          <input
            type="number"
            name="rumenFill"
            value={formData.rumenFill}
            onChange={handleInputChange}
            placeholder="Enter rumen fill (1-5)"
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
          <small style={{ color: "#666" }}>Optimal range: 3.0 - 5.0</small>
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
          {loading ? "Predicting..." : "Submit"}
        </button>
      </form>

      {error && (
        <div
          style={{
            marginTop: "15px",
            padding: "10px",
            backgroundColor: "#ffebee",
            color: "#c62828",
            borderRadius: "4px",
            textAlign: "center",
          }}
        >
          <p>{error}</p>
          <button
            onClick={handleMockPrediction}
            style={{
              marginTop: "10px",
              padding: "8px 15px",
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Use Demo Mode Instead
          </button>
        </div>
      )}

      {prediction && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            backgroundColor: "#e8f5e9",
            borderRadius: "8px",
            textAlign: "left",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "15px" }}>
            <h3 style={{ margin: "0 0 10px 0", color: "#2e7d32" }}>Milk Quantity Prediction</h3>
            <p
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                margin: "0",
                color: getQualityColor(prediction),
              }}
            >
              {prediction.toUpperCase()}
            </p>
            {usingFallback && (
              <span
                style={{
                  display: "inline-block",
                  fontSize: "12px",
                  backgroundColor: "#f0f0f0",
                  color: "#666",
                  padding: "3px 8px",
                  borderRadius: "10px",
                  marginTop: "5px",
                }}
              >
                Using enhanced prediction model
              </span>
            )}
          </div>

          {explanation && (
            <div style={{ marginTop: "15px" }}>
              <h4 style={{ marginBottom: "5px" }}>Explanation:</h4>
              <p style={{ margin: "0", lineHeight: "1.5" }}>{explanation}</p>
            </div>
          )}

          {renderFeatureImportance()}

          {
            <div style={{ marginTop: "20px" }}>
              <h4 style={{ marginBottom: "5px" }}>Recommendation:</h4>
              <p
                style={{
                  margin: "0",
                  lineHeight: "1.5",
                  padding: "10px",
                  backgroundColor: "#f0f8ff",
                  borderLeft: `4px solid ${getQualityColor(prediction)}`,
                  borderRadius: "4px",
                }}
              >
                {getMilkQuantityRecommendation(prediction)}
              </p>
            </div>
          }
        </div>
      )}

      <div style={{ marginTop: "30px" }}>
        <h2 style={{ textAlign: "center" }}>Feed Records</h2>
        {records.length === 0 ? (
          <p style={{ textAlign: "center", color: "#777" }}>No records yet</p>
        ) : (
          records.map((record) => (
            <div
              key={record.id}
              className="card"
              style={{
                backgroundColor: "#fff",
                padding: "15px",
                marginBottom: "15px",
                borderRadius: "8px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ margin: "0" }}>Record {record.id}</h3>
                <span style={{ fontSize: "12px", color: "#777" }}>{record.timestamp}</span>
              </div>
              <hr style={{ margin: "10px 0", border: "none", borderTop: "1px solid #eee" }} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <p style={{ margin: "5px 0" }}>
                  <strong>Temperature:</strong> {record.temperature}°C
                </p>
                <p style={{ margin: "5px 0" }}>
                  <strong>Milk Intake:</strong> {record.milkIntake} ml
                </p>
                <p style={{ margin: "5px 0" }}>
                  <strong>Body Score:</strong> {record.bodyScore}
                </p>
                <p style={{ margin: "5px 0" }}>
                  <strong>Rumen Fill:</strong> {record.rumenFill}
                </p>
              </div>
              <p
                style={{
                  fontWeight: "bold",
                  color: getQualityColor(record.milkQuality),
                  textAlign: "center",
                  marginTop: "10px",
                  padding: "5px",
                  borderRadius: "4px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                Milk Quantity: {record.milkQuality.toUpperCase()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default FeedDetailsForm
