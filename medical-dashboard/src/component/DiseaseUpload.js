import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "./DiseaseUpload.css";

const DiseaseUpload = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!image) {
      alert("Please select an image first.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await axios.post("YOUR_API_ENDPOINT", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPrediction(response.data.disease || "Prediction failed");
    } catch (error) {
      console.error("Error uploading image:", error);
      setPrediction("Error predicting disease");
    }
    setLoading(false);
  };

  return (
    <motion.div 
      className="container"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2 
        className="title"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Upload Disease Image
      </motion.h2>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {preview && (
        <motion.img 
          src={preview} 
          alt="Preview" 
          className="preview" 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
      )}
      <motion.button
        className="button"
        onClick={handleUpload}
        disabled={loading}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {loading ? "Predicting..." : "Upload & Predict"}
      </motion.button>
      {prediction && (
        <motion.p 
          className="prediction" 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Prediction: {prediction}
        </motion.p>
      )}
    </motion.div>
  );
};

export default DiseaseUpload;

/* CSS Styles */
import "./DiseaseUpload.css";

const styles = `
.container {
  padding: 1rem;
  max-width: 400px;
  margin: auto;
  background: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  text-align: center;
  transition: transform 0.3s ease-in-out;
}

.container:hover {
  transform: scale(1.02);
}

.title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

input[type="file"] {
  margin-top: 10px;
  cursor: pointer;
}

.preview {
  width: 100%;
  margin-top: 10px;
  border-radius: 6px;
  transition: opacity 0.5s ease-in-out;
}

.button {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease-in-out, transform 0.2s ease-in-out;
}

.button:hover {
  background-color: #2563eb;
  transform: scale(1.05);
}

.button:disabled {
  background: gray;
  cursor: not-allowed;
}

.prediction {
  margin-top: 10px;
  font-size: 1rem;
  font-weight: bold;
  color: #333;
}
`;

const styleElement = document.createElement("style");
styleElement.innerHTML = styles;
document.head.appendChild(styleElement);
