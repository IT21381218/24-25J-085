import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import ENV from '../data/Env';

// Registering necessary chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MilkProductionTrend = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMilkProductionData = async () => {
      try {
        const year = 2024;
        const months = Array.from({ length: 12 }, (_, i) => i + 1); // Months 1–12
        const predictions = [];

        // Fetch predicted milk production for each month
        for (const month of months) {
          const response = await axios.post(ENV.SERVER+'/predict-milk-production', {
            year,
            month,
          });
          predictions.push(response.data.predicted_milk_production);
        }

        // Prepare chart data
        setChartData({
          labels: months.map((month) => `Month ${month}`),
          datasets: [
            {
              label: 'Milk Production (Liters)',
              data: predictions,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data. Please try again.');
        setLoading(false);
      }
    };

    fetchMilkProductionData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#333',
        },
      },
      title: {
        display: true,
        text: 'Milk Production Trend for 2024',
        color: '#333',
        font: {
          size: 18,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#333',
        },
        title: {
          display: true,
          text: 'Months',
          color: '#333',
        },
      },
      y: {
        ticks: {
          color: '#333',
        },
        title: {
          display: true,
          text: 'Liters Produced',
          color: '#333',
        },
        beginAtZero: true,
      },
    },
  };

  if (loading) return <p>Loading chart...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="recentOrders">
      <div className="cardHeader">
        <h2>Milk Production Trend</h2>
      </div>
      <div className="chartContainer">
        {chartData && <Bar data={chartData} options={options} />}
      </div>
    </div>
  );
};

export default MilkProductionTrend;
