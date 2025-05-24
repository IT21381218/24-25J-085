import React, { useState } from "react";
import axios from "axios";

const MilkQualityCheckForm = () => {
  // State to manage form inputs and response
  const [formData, setFormData] = useState({
    pH: "",
    Temperature: "",
    Taste: "",
    Odor: "",
    Fat: "",
    Turbidity: "",
    Colour: "",
  });

  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setPrediction(null);
    setError(null);

    try {
      const response = await axios.post("http://127.0.0.1:8000/predict-milk-grade", formData);
      setPrediction(response.data.predicted_grade);
    } catch (err) {
      setError("Failed to get the prediction. Please try again.");
    }
  };

  return (
    <div className="recentCustomers">
      {/* <div className="cardHeader">
        <h2>Milk Quality Monitor</h2>
      </div> */}
      <form className="formGroup" onSubmit={handleSubmit}>
        <div className="formControl">
          <label>pH:</label>
          <input
            type="number"
            step="0.01"
            name="pH"
            value={formData.pH}
            onChange={handleChange}
            required
          />
        </div>
        <div className="formControl">
          <label>Temperature:</label>
          <input
            type="number"
            step="0.1"
            name="Temperature"
            value={formData.Temperature}
            onChange={handleChange}
            required
          />
        </div>
        <div className="formControl">
          <label>Taste:</label>
          <input
            type="number"
            name="Taste"
            min="0"
            max="1"
            value={formData.Taste}
            onChange={handleChange}
            required
          />
        </div>
        <div className="formControl">
          <label>Odor:</label>
          <input
            type="number"
            name="Odor"
            min="0"
            max="1"
            value={formData.Odor}
            onChange={handleChange}
            required
          />
        </div>
        <div className="formControl">
          <label>Fat:</label>
          <input
            type="number"
            step="0.01"
            name="Fat"
            value={formData.Fat}
            onChange={handleChange}
            required
          />
        </div>
        <div className="formControl">
          <label>Turbidity:</label>
          <input
            type="number"
            name="Turbidity"
            min="0"
            max="1"
            value={formData.Turbidity}
            onChange={handleChange}
            required
          />
        </div>
        <div className="formControl">
          <label>Colour:</label>
          <input
            type="number"
            name="Colour"
            min="0"
            max="1"
            value={formData.Colour}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btnSubmit">
          Check Quality
        </button>
      </form>

      {/* Display Results */}
      {prediction && (
        <div className="result">
          <h3>Predicted Grade: {prediction}</h3>
        </div>
      )}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default MilkQualityCheckForm;
