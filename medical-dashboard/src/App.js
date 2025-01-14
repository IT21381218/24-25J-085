// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import './App.css';
import Home from './pages/Home';
import SignUp from './pages/forms/SignUp';
import SignIn from './pages/forms/SignIn';
import ProfilePictureUpload from './pages/forms/ProfilePictureUpload';
import DiseaseDetection from './pages/DiseaseDetection';
import HealthMonitor from './pages/HealthMonitor';
import MilkProduction from './pages/MilkProduction';
import VetLocate from './pages/VetLocateMap';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/profile-upload" element={<ProfilePictureUpload />} />
        <Route path="/logged/dashboard" element={<Dashboard />} />
        <Route path="/logged/disease-detection" element={<DiseaseDetection />} />
        <Route path="/logged/health-monitor" element={<HealthMonitor />} /> 
        <Route path="/logged/milk-production" element={<MilkProduction />} />
        <Route path="/logged/map" element={<VetLocate />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
