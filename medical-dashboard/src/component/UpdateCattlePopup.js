import React, { useState } from 'react';
import Notiflix from 'notiflix';
import axios from 'axios';
import ENV from '../data/Env';

const healthOptions = ["Healthy", "Sick", "Injured"];
const statusOptions = ["Active", "Sold", "Deceased"];

const UpdateCattlePopup = ({ cattle, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        health: cattle.health || "",
        status: cattle.status || "",
      });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (!formData.health && !formData.status) {
      Notiflix.Notify.failure("Please update at least one field.");
      return;
    }
  
    try {
      console.log(formData);
      await axios.put(`${ENV.SERVER}/cattle/${cattle.id}`, {
        health: formData.health || undefined,
        status: formData.status || undefined,
      });
      
      Notiflix.Notify.success("Cattle updated successfully!");
      onClose();
    } catch (error) {
      Notiflix.Notify.failure("Failed to update cattle. Please try again.");
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={popupStyle}>
        <h3>Update Cattle</h3>
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
        <div style={{ marginTop: '16px' }}>
          <button onClick={handleSubmit} style={buttonStyle}>Confirm Update</button>
          <button onClick={onClose} style={{ ...buttonStyle, backgroundColor: 'gray', marginLeft: '10px' }}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const popupStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  width: '300px',
};

const formGroupStyle = { marginBottom: '12px' };
const labelStyle = { display: 'block', marginBottom: '6px', fontWeight: 'bold' };
const inputStyle = { width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' };
const buttonStyle = { backgroundColor: 'purple', color: 'white', padding: '8px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer' };

export default UpdateCattlePopup;
