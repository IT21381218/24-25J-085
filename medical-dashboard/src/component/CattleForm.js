import React, { useState } from "react";
import axios from "axios";
import ENV from "../data/Env";
import Notiflix from "notiflix";

const CattleForm = ({ user, addNewCattle }) => {
  const today = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({
    name: "",
    breed: "Sahiwal",
    birth: today,
    health: "Healthy",
    status: "Active",
    image: "https://www.shutterstock.com/image-vector/cows-silhouettes-different-poses-cow-600nw-2497026899.jpg",
    imageFile: null,
  });

  const breeds = ["Sahiwal", "Red Sindhi", "Gir", "Kankrej", "Tharparkar", "Hariana"];
  const healthOptions = ["Healthy", "Sick", "Injured"];
  const statusOptions = ["Active", "Sold", "Deceased"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (e) => {
    const dateValue = new Date(e.target.value).toISOString().split("T")[0];
    setFormData({ ...formData, birth: dateValue });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "gtnnidje");

      try {
        const response = await fetch("https://api.cloudinary.com/v1_1/dkox7lwxe/image/upload", {
          method: "POST",
          body: data,
        });

        const cloudinaryData = await response.json();
        setFormData({ ...formData, image: cloudinaryData.secure_url });
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image. Please try again.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const cattleData = {
      ...formData,
      owner: user.username,
    };

    try {
      const response = await axios.post(ENV.SERVER+"/cattle", cattleData);
      Notiflix.Notify.success(`Cattle added successfully! ID: ${response.data.id}`);
      addNewCattle(cattleData);
      
    } catch (error) {
      Notiflix.Notify.failure('Failed to add cattle. Please try again.');
    }
  };

  const inputStyle = { padding: "10px", borderRadius: "8px", border: "1px solid #ccc", width: "100%", marginBottom: "10px" };
  const labelStyle = { fontWeight: "bold", marginBottom: "5px", display: "block" };
  const formGroupStyle = { marginBottom: "15px" };

  return (
    <div className="recentOrders">
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Add New Cattle</h2>
      <form onSubmit={handleSubmit}>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required style={inputStyle} />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Breed:</label>
          <select name="breed" value={formData.breed} onChange={handleChange} required style={inputStyle}>
            {breeds.map((breed) => (
              <option key={breed} value={breed}>{breed}</option>
            ))}
          </select>
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Birth Date:</label>
          <input type="date" name="birth" onChange={handleDateChange} required style={inputStyle} />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Health:</label>
          <select name="health" value={formData.health} onChange={handleChange} required style={inputStyle}>
            {healthOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Status:</label>
          <select name="status" value={formData.status} onChange={handleChange} required style={inputStyle}>
            {statusOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Image:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} style={inputStyle} />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Image Preview:</label>
          <img src={formData.image} alt="Cattle Preview" style={{ width: "100%", borderRadius: "10px", marginBottom: "10px" }} />
        </div>

        <button type="submit" style={{ padding: "10px 15px", width: "100%", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "16px" }}>
          Add Cattle
        </button>
      </form>
    </div>
  );
};

export default CattleForm;
