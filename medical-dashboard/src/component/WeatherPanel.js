import React from "react";
import { WiHumidity, WiStrongWind, WiThermometer } from "react-icons/wi";

const WeatherPanel = ({ weatherData }) => {
  return (
    <div className="recentCustomers" style={{ padding: "20px" }}>
      {/* Left-aligned card header */}
      <div className="cardHeader">
        <h2 style={{ textAlign: "left", marginBottom: "15px" }}>Weather Summary</h2>
      </div>

      {weatherData.length > 0 ? (
        <div style={{ textAlign: "center" }}>
          {/* Centered Weather Icon */}
          <h3>{weatherData[0].name}</h3>
          <img
            src={`https://openweathermap.org/img/wn/${weatherData[0].weather[0].icon}@2x.png`}
            alt={weatherData[0].weather[0].description}
            style={{ display: "block", margin: "10px auto", width: "150px", height: "150px" }}
          />
          <p style={{ fontSize: "18px", marginBottom: "10px" }}>{weatherData[0].weather[0].description}</p>

          {/* Weather Details with Icons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
            <div style={infoRowStyle}>
              <div style={iconContainerStyle}><WiThermometer size={30} color="#fff" /></div>
              <span style={valueStyle}>{weatherData[0].main.temp}°C</span>
            </div>

            <div style={infoRowStyle}>
              <div style={iconContainerStyle}><WiHumidity size={30} color="#fff" /></div>
              <span style={valueStyle}>{weatherData[0].main.humidity}%</span>
            </div>

            <div style={infoRowStyle}>
              <div style={iconContainerStyle}><WiStrongWind size={30} color="#fff" /></div>
              <span style={valueStyle}>{weatherData[0].wind.speed} m/s</span>
            </div>
          </div>
        </div>
      ) : (
        <p style={{ textAlign: "center" }}>Loading weather data...</p>
      )}
    </div>
  );
};

// Inline styles
const infoRowStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "60%",
  padding: "10px 15px",
  borderRadius: "8px",
  backgroundColor: "#f5f5f5",
};

const iconContainerStyle = {
  width: "40px",
  height: "40px",
  borderRadius: "8px",
  backgroundColor: "#007bff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const valueStyle = {
  fontSize: "18px",
  fontWeight: "bold",
  flex: 1,
  textAlign: "right",
};

export default WeatherPanel;
