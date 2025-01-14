import React, { useState } from 'react';
import Notiflix from 'notiflix';

const ContactUsForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    title: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform any additional form submission logic here

    // Show confirmation message with Notiflix
    Notiflix.Notify.success('Your message has been sent successfully!');
    // Reset form after submission
    setFormData({
      name: '',
      contact: '',
      email: '',
      title: '',
      message: ''
    });
  };

  return (
    <div className="container">
      <h1 className="title">Contact Us</h1>

      <div className='contactContainer'>
        <form id="contactForm" onSubmit={handleSubmit}>
            <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
            />
            </div>

            <div className="form-group-row">
            <div className="form-group">
                <label htmlFor="contact">Contact Number</label>
                <input
                type="tel"
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                required
                />
            </div>

            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                />
            </div>
            </div>

            <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
            />
            </div>

            <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
            ></textarea>
            </div>

            <button type="submit" className="submit-btn">Submit</button>
        </form>
      </div>

      
      
    </div>
  );
};

export default ContactUsForm;
