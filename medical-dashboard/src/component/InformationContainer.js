// components/InformationContainer.js
import React from 'react';

const InformationContainer = () => {
  const instructions = [
    "Ensure your cattle have access to clean and fresh water at all times.",
    "Provide a balanced diet that meets the nutritional needs of the cattle.",
    "Schedule regular veterinary check-ups to monitor and maintain health.",
    "Keep the living area clean and dry to prevent infections and diseases.",
    "Vaccinate cattle as per the recommended schedule to avoid diseases.",
    "Isolate sick animals immediately to prevent the spread of infections.",
    "Provide shade and proper ventilation to protect cattle from heat stress.",
    "Train handlers and workers on safe and humane cattle management practices.",
    "Monitor cattle behavior daily to detect any signs of illness or discomfort.",
    "Regularly deworm cattle to prevent parasitic infestations."
  ];

  return (
    <div className="recentCustomers">
      <div className="cardHeader">
        <h2>Cattle Management and Care Instructions</h2>
      </div>
      <ul className="instructionsList">
        {instructions.map((instruction, index) => (
          <li key={index}>{instruction}</li>
        ))}
      </ul>
    </div>
  );
};

export default InformationContainer;
