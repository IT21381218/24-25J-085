import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './forms.css';

const ProfilePictureUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(`${process.env.PUBLIC_URL}/anim/id.gif`);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }
    
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:8000/face-detection/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file', error);
      alert('Error uploading file');
    }
  };

  return (
    <div className="signup-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Upload Profile Picture</h2>
        <img src={`${process.env.PUBLIC_URL}/anim/id.gif`} alt="Upload Profile" />
        <p>Upload your profile picture to personalize your account.</p>
      </div>

      {/* Form Section */}
      <div className="form-container">
        <h2>Profile Picture Upload</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Upload Profile Image</label>
            <input type="file" onChange={handleFileChange} />
          </div>

          <div className="image-preview">
            <img src={preview} alt="Image Preview" style={{ width: '100%', height: '400px', objectFit: 'contain' }} />
          </div>

          <button type="submit" className="upload-button">Upload</button>
          <p className="back-link"><Link to="/">Back to Home</Link></p>
        </form>
      </div>
    </div>
  );
};

export default ProfilePictureUpload;
