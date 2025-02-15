// pages/VetLocate.js
import React from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import Footer from '../components/Footer';
import MilkQualityCheckForm from '../components/MilkQualityCheckForm';
import CustomMap from '../components/CustomMap';
import InformationContainer from '../components/InformationContainer';

const VetLocate = () => {
  return (
    <div className="dashContainer">
      <Sidebar />
      <div className="main">
        <Topbar />
        <div className="details">
          <CustomMap />
          <InformationContainer />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default VetLocate;
