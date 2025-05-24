// pages/MilkHistory.js
import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import Footer from '../components/Footer';
import ChatMessages from '../components/ChatMessages';
import MilkRecords from '../components/MilkRecords';

const MilkHistory = () => {
  const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : {};
  });



  return (
    <div className="dashContainer">
      <Sidebar />
      <div className="main">
        <Topbar />
        <div className="details">
          <MilkRecords />
          {/* <ChatOutlet locations={locations}
            setSelectedLocation={setSelectedLocation} /> */}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default MilkHistory;
