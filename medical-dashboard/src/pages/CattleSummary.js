// pages/DiseaseDetection.js
import React from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import Footer from '../components/Footer';
import HealthRecordForm from '../components/HeaalthRecordsForm';
import CattleMonitor from '../components/CattleMonitor';
import { useLocation } from 'react-router-dom';
import FeedIntakes from '../components/FeedIntakes';

const CattleSummary = () => {
  const location = useLocation();
  const { cattle } = location.state || {};

  return (
    <div className="dashContainer">
      <Sidebar />
      <div className="main">
        <Topbar />
        <div className="details">
          <CattleMonitor cattle={cattle}/>
          <FeedIntakes />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default CattleSummary;
