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
      {/* Defining routes for the application */}
      <Routes>
        {/* Route for the Home page */}
        <Route path="/home" element={<Home />} />

        {/* Route for the Dashboard page (accessible after login) */}
        <Route path="/logged/dashboard" element={<Dashboard />} />

        {/* Route for the Disease Detection page */}
        <Route path="/logged/disease-detection" element={<DiseaseDetection />} />

        {/* Catch-all route: If no route matches, the Home page is rendered */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

// Exporting the App component as the default export
export default App;
