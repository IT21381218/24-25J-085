// Importing React library
import React from 'react';

// Importing necessary components from react-router-dom for routing
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Importing custom components/pages
import Dashboard from './pages/Dashboard';
import './App.css'; // Importing the CSS file for global styles
import Home from './pages/Home';

import DiseaseDetection from './pages/DiseaseDetection';


// The main App component
function App() {
  return (
    // Wrapping the application with the Router component to enable routing
    <Router>

      <Routes>

        <Route path="/home" element={<Home />} />

        <Route path="/logged/dashboard" element={<Dashboard />} />

        <Route path="/logged/disease-detection" element={<DiseaseDetection />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

// Exporting the App component as the default export
export default App;
