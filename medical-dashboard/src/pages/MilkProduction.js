// pages/MilkProduction.js
import React from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import Footer from '../components/Footer';
import MilkQualityCheckForm from '../components/MilkQualityCheckForm';
import MilkProductionTrend from '../components/MilkProductionTrend';

const MilkProduction = () => {
  return (
    <div className="dashContainer">
      <Sidebar />
      <div className="main">
        <Topbar />
        <div className="details">
          <MilkProductionTrend />
          <MilkQualityCheckForm />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default MilkProduction;
