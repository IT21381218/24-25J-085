import React, { useState } from "react";
import axios from "axios";

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
    <div className="p-4 max-w-md mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Upload Disease Image</h2>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {preview && <img src={preview} alt="Preview" className="mt-4 w-full rounded" />}
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleUpload}
        disabled={loading}
      >
        {loading ? "Predicting..." : "Upload & Predict"}
      </button>
      {prediction && <p className="mt-4 text-lg font-semibold">Prediction: {prediction}</p>}
    </div>
  );
};

export default DiseaseUpload;