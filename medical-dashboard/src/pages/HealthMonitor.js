// pages/HealthMonitor.js
import React from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import Footer from '../components/Footer';
import DiseaseUpload from '../components/DiseaseUpload';
import InformationContainer from '../components/InformationContainer';
import HealthCheckupForm from '../components/HealthCheckupForm';

const HealthMonitor = () => {
  return (
    <div className="dashContainer">
      <Sidebar />
      <div className="main">
        <Topbar />
        <div className="details">
          <HealthCheckupForm />
          <InformationContainer />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default HealthMonitor;
