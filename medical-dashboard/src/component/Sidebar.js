// Sidebar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaApple, FaHome, FaUser, FaCommentDots, FaQuestionCircle, FaCog, FaSignOutAlt, FaHatCowboy, FaChartBar } from 'react-icons/fa';

const Sidebar = () => {
  const navigate = useNavigate()
  const onLogOut = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };
  return (
    <div className="navigation">
      <ul>
        <li>
          <Link to="#">
            <span className="nav-icon"><img src={process.env.PUBLIC_URL+'/images/cow.png'} height={60} alt='icon'/></span>
            
          </Link>
        </li>
        <li>
          <Link to="/logged/dashboard">
            <span className="nav-icon"><FaHome className="ic"/></span>
            <span className="title">Summary</span>
          </Link>
        </li>
        <li>
          <Link to="/logged/profile">
            <span className="nav-icon"><FaHatCowboy className="ic"/></span>
            <span className="title">My Profile</span>
          </Link>
        </li>
        <li>
          <Link to="/logged/map">
            <span className="nav-icon"><FaCommentDots className="ic"/></span>
            <span className="title">Locate Veterinarian</span>
          </Link>
        </li>
        <li>
          <Link to="/logged/chat/open-channel">
            <span className="nav-icon"><FaCommentDots className="ic"/></span>
            <span className="title">Communicate</span>
          </Link>
        </li>
        <li>
          <Link to="/logged/milk-production">
            <span className="nav-icon"><FaChartBar className="ic"/></span>
            <span className="title">Milk Production Details</span>
          </Link>
        </li>
        <li>
          <Link to="/logged/milk-records">
            <span className="nav-icon"><FaChartBar className="ic"/></span>
            <span className="title">Milk Records History</span>
          </Link>
        </li>
        <li>
          <Link to="/logged/disease-detection">
            <span className="nav-icon"><FaCog className="ic"/></span>
            <span className="title">Disease Detection</span>
          </Link>
        </li>
        <li>
          <Link to="/logged/health-monitor">
            <span className="nav-icon"><FaCog className="ic"/></span>
            <span className="title">Health Checkup</span>
          </Link>
        </li>
        <li>
          <a onClick={onLogOut} style={{cursor:"pointer"}}>
            <span className="nav-icon"><FaSignOutAlt className="ic"/></span>
            <span className="title">Sign Out</span>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
