import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";
import MilkCollectionReport from "../components/MilkCollectionReport";
import WeatherPanel from "../components/WeatherPanel";
import ENV from "../data/Env";

const cities = ["Colombo", "Kandy", "Galle"]; // Example cities

const MilkProduction = () => {
  const [user, setUser] = useState(() => {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : {};
  });
  const [weatherData, setWeatherData] = useState([]);
  const [cattles, setCattles] = useState([]);

  const fetchWeatherForCities = async () => {
    try {
      const responses = await Promise.all(
        cities.map((city) =>
          axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=3ca1b71cf73d793ea485f6d257cedd49&units=metric`
          )
        )
      );
      setWeatherData(responses.map((res) => res.data));
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  useEffect(() => {
    fetchWeatherForCities();
  }, []);

  useEffect(() => {
    const fetchCattles = async (user) => {
      try {
        const response = await fetch(`${ENV.SERVER}/cattle/owner/${user}`);
        const data = await response.json();
        setCattles(data);
      } catch (error) {
        // console.error("Error fetching cattles:", error);
      }
    };

    if (user.username) {
      fetchCattles(user.username);
    }
  }, [user]);

  return (
    <div className="dashContainer">
      <Sidebar />
      <div className="main">
        <Topbar />
        <div className="details">
          {/* Pass weatherData to both components */}
          <MilkCollectionReport weatherData={weatherData} cattles={cattles} username={user.username}/>
          <WeatherPanel weatherData={weatherData} />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default MilkProduction;
