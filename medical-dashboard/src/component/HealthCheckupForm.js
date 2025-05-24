import React, { useState } from 'react';
import axios from 'axios';
import ENV from '../data/Env';

const HealthCheckupForm = () => {
  const [formData, setFormData] = useState({
    body_temperature: '',
    milk_production: '',
    respiratory_rate: '',
    walking_capacity: '',
    sleeping_duration: '',
    body_condition_score: '',
    heart_rate: '',
    eating_duration: '',
    lying_down_duration: '',
    ruminating: '',
    rumen_fill: '',
  });

  const [loading, setLoading] = useState(false);
  const [healthStatus, setHealthStatus] = useState(null);

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const requiredFields = Object.values(formData).filter((value) => value === '');
    if (requiredFields.length > 0) {
      alert('Please fill all the fields before submitting.');
      return;
    }

    setLoading(true);
    setHealthStatus(null);

    try {
      const response = await axios.post(ENV.SERVER+'/predict-health-status', formData);
      setHealthStatus(response.data.health_status);
    } catch (error) {
      console.error('Error predicting health status:', error);
      alert('Failed to predict health status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recentOrders">
      <div className="cardHeader">
        <h2>Health Checkup Form</h2>
      </div>

      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((field) => (
          <div key={field} className="formGroup">
            <label htmlFor={field}>
              {field.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}:
            </label>
            <input
              type="number"
              step="any"
              id={field}
              name={field}
              value={formData[field]}
              onChange={handleInputChange}
              required
              className="formInput"
            />
          </div>
        ))}

        <button type="submit" className="submitButton">
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      {healthStatus && (
        <div className="healthStatusResult">
          <h3>Health Status:</h3>
          <p className={healthStatus === 'Healthy' ? 'healthy' : 'unhealthy'}>
            {healthStatus}
          </p>
        </div>
      )}
    </div>
  );
};

export default HealthCheckupForm;
