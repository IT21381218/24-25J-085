// pages/Dashboard.js
import React from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import RecentOrders from '../components/RecentOrders';
import RecentCustomers from '../components/RecentCustomers';
import Footer from '../components/Footer';
import Card from '../components/Card';

const Dashboard = () => {
  return (
    <div className="dashContainer">
      <Sidebar />
      <div className="main">
        <Topbar />
        <div className="cardBox">
          <Card numbers="0" cardName="Cattle Management" icon='/icons/farm-icon-removebg-preview.png' />
          <Card numbers="0 Alerts" cardName="Disease Detection" icon='/icons/cow-icon-removebg-preview.png' />
          <Card numbers="0 Daily" cardName="Production Management" icon='/icons/milk-icon-removebg-preview.png' />
          <Card numbers="0 Daily" cardName="Feeding" icon='/icons/feed-icon-removebg-preview.png' />
        </div>
        <div className="details">
          <RecentOrders />
          <RecentCustomers />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
