import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Notiflix from 'notiflix';
import './forms.css';

const SignUp = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    address: '',
    email: '',
    contact: '',
    password: '',
    confirmPassword: '',
    nic: ''
  });

  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const validateForm = () => {
    let formErrors = {};
    if (!formData.username) formErrors.username = 'Username is required';
    if (!formData.full_name) formErrors.full_name = 'Full Name is required';
    if (!formData.address) formErrors.address = 'Address is required';
    if (!formData.email) formErrors.email = 'Email is required';
    if (!validateEmail(formData.email)) formErrors.email = 'Invalid email';
    if (!formData.contact) formErrors.contact = 'Contact number is required';
    if (formData.contact.length !== 10) formErrors.contact = 'Contact number must be 10 characters';
    if (!formData.password) formErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) formErrors.confirmPassword = 'Passwords do not match';
    if (!formData.nic) formErrors.nic = 'NIC is required';
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        console.log(formData)
        const response = await axios.post('http://localhost:8000/register', formData);
        Notiflix.Notify.success('Registration successful');
        navigate('/sign-in')
      } catch (error) {
        Notiflix.Notify.failure('Registration failed');
      }
    } else {
      Object.values(errors).forEach(error => Notiflix.Notify.failure(error));
    }
  };

  return (
    <div className="signup-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Join Us</h2>
        <img src={`${process.env.PUBLIC_URL}/images/art.png`} alt="Healthcare" />
        <p>Access personalized healthcare services and resources by creating an account with us.</p>
      </div>

      {/* Form Section */}
      <div className="form-container">
        <h2>Create an Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input type="text" name="username" placeholder="Enter Username" value={formData.username} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="full_name" placeholder="Enter Full Name" value={formData.full_name} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input type="text" name="address" placeholder="Enter Address" value={formData.address} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>NIC</label>
            <input type="text" name="nic" placeholder="Enter NIC" value={formData.nic} onChange={handleChange} />
          </div>

          <div className="form-group row">
            <div className="column">
              <label>Email</label>
              <input type="email" name="email" placeholder="Enter Email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="column">
              <label>Contact Number</label>
              <input type="tel" name="contact" placeholder="Enter Contact Number" value={formData.contact} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group row">
            <div className="column">
              <label>Password</label>
              <input type="password" name="password" placeholder="Enter Password" value={formData.password} onChange={handleChange} />
            </div>
            <div className="column">
              <label>Confirm Password</label>
              <input type="password" name="confirmPassword" placeholder="Retype Password" value={formData.confirmPassword} onChange={handleChange} />
            </div>
          </div>

          <div className="agreement">
            <input type="checkbox" />
            <label>I agree to the Terms & Conditions</label>
          </div>
          {/* <div className="agreement">
            <input type="checkbox" />
            <label>I agree to receive communications</label>
          </div> */}

          <button type="submit" className="signup-button">Sign Up</button>
          <p className="signin-link">Already have an account? <Link to="/sign-in">Sign In</Link></p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
