import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import axios from "axios";
import ENV from "../data/Env";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MilkCollectionReport = ({ weatherData, cattles }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [manualData, setManualData] = useState([]);

  const calculateAge = (birthDate) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    return { years, months };
  }

  useEffect(() => {
    const fetchMilkProductionData = async () => {
      if (!weatherData || weatherData.length === 0) {
        setError("No weather data available.");
        setLoading(true)
        return;
      }
  
      try {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth(); // 0-indexed
        const startDate = today.getDate();
  
        // Function to get the number of days in a month
        const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  
        // Generate valid dates for the next 10 days
        let days = [];
        for (let i = 0; i < 10; i++) {
          let currentDate = new Date(year, month, startDate + i);
          let validMonth = currentDate.getMonth(); // Check if it changed month
  
          if (validMonth !== month) {
            break; // Stop adding dates when the month changes
          }
  
          days.push(currentDate.getDate());
        }
  
        const { main, weather } = weatherData[0];
        const temperature = main.temp;
        const humidity = main.humidity;
        const weatherDescription = weather[0].description.toLowerCase();
        
        const weatherTextMap = {
          "clear sky": "Clear",
          "few clouds": "Partially cloudy",
          "scattered clouds": "Partially cloudy",
          "broken clouds": "Overcast",
          "shower rain": "Rain, Partially cloudy",
          "rain": "Rain, Overcast",
          "thunderstorm": "Rain, Overcast"
        };
  
        const weatherText = weatherTextMap[weatherDescription] || "Clear";
        const predictions = [];
  
        // Fetch predicted milk production for the valid days
        for (const date of days) {
          const response = await axios.post(ENV.SERVER + "/milk-weather-predict", {
            year,
            month: month + 1, // Convert 0-based month to 1-based
            date,
            temperature,
            humidity,
            rainfall: weatherText,
          });
  
          predictions.push(response.data.predicted_milk_liters);
        }
  
        // Prepare chart data
        setChartData({
          labels: days.map((day) => `Day ${day}`),
          datasets: [
            {
              label: "Predicted Milk Production (Liters)",
              data: predictions,
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderWidth: 2,
              pointRadius: 4,
              pointBackgroundColor: "rgba(75, 192, 192, 1)",
            },
          ],
        });
        setLoading(false)
  
      } catch (err) {
        setError("Failed to fetch data. Please try again.");
      }
    };
  
    fetchMilkProductionData();
  }, [weatherData]);

  const addManualEntry = () => {
    const dateInput = document.getElementById("manual-date").value;
    const amountInput = document.getElementById("manual-amount").value;
    if (!dateInput || !amountInput) {
      alert("Please enter a valid date and amount.");
      return;
    }

    const selectedDate = new Date(dateInput);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      alert("You can only add data for today or past dates.");
      return;
    }

    const formattedDate = selectedDate.getDate();
    const newEntry = { date: formattedDate, amount: parseFloat(amountInput) };

    setManualData((prevData) => [...prevData, newEntry]);

    if (chartData) {
      setChartData((prevChart) => {
        const updatedLabels = [...prevChart.labels];
        const updatedPredictions = [...prevChart.datasets[0].data];
        const existingIndex = updatedLabels.indexOf(`Day ${formattedDate}`);

        if (existingIndex !== -1) {
          updatedPredictions[existingIndex] = newEntry.amount;
        } else {
          updatedLabels.push(`Day ${formattedDate}`);
          updatedPredictions.push(newEntry.amount);
        }

        return {
          ...prevChart,
          labels: updatedLabels,
          datasets: [
            prevChart.datasets[0],
            {
              label: "Manual Entry",
              data: updatedPredictions,
              borderColor: "green",
              backgroundColor: "rgba(0, 255, 0, 0.2)",
              borderWidth: 2,
              pointRadius: 6,
              pointBackgroundColor: "green",
            },
          ],
        };
      });
    }
  };
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#333",
        },
      },
      title: {
        display: true,
        text: "Milk Production Prediction for the Next 10 Days",
        color: "#333",
        font: {
          size: 18,
        },
      },
    },
    scales: {
      x: { ticks: { color: "#333" }, title: { display: true, text: "Days", color: "#333" } },
      y: { ticks: { color: "#333" }, title: { display: true, text: "Liters Produced", color: "#333" }, beginAtZero: true },
    },
  };

  if (loading) return <p>Loading chart...</p>;
  // if (error) return <p>{error}</p>;

  return (
    <div className="recentOrders">
      <div className="cardHeader">
        <h2>Milk Production Trend</h2>
      </div>
      <div className="chartContainer">
        {chartData && <Line data={chartData} options={options} />}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px", marginTop: "20px" }}>
        {cattles.length === 0 ? (
          <p>No cattles available</p>
        ) : (
          cattles.map((cattle) => {
            const { years, months } = calculateAge(cattle.birth);
            return (
              <div key={cattle.id} style={{ backgroundColor: "#f9f9f9", borderRadius: "8px", padding: "16px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", display: "flex", flexDirection: "row" }}>
                <div style={{ flex: 2, marginRight: "16px" }}>
                  <h3>{cattle.name}</h3>
                  <small>({cattle.id})</small>
                  <img src={cattle.image} alt={cattle.name} style={{ width: "100%", borderRadius: "8px", objectFit: "cover" }} />
                </div>
                <div style={{ flex: 2 }}>
                  <p><strong>Breed:</strong> {cattle.breed}</p>
                  <p><strong>Age:</strong> {years} years, {months} months</p>
                  <p><strong>Health:</strong> {cattle.health}</p>
                  <p><strong>Status:</strong> {cattle.status}</p>
                  <input type="date" id="manual-date" max={new Date().toISOString().split("T")[0]} style={{ marginRight: "10px" }} />
                  <input type="number" id="manual-amount" placeholder="Liters" min="0" style={{ marginRight: "10px" }} />
                  <button onClick={addManualEntry} style={{ backgroundColor: "green", color: "white", padding: "8px 12px", border: "none", borderRadius: "4px", cursor: "pointer" }}>Add</button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MilkCollectionReport;
