import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaUser,
  FaMapMarkerAlt,
  FaChartLine,
  FaHeartbeat,
  FaStethoscope,
  FaSignOutAlt,
} from 'react-icons/fa';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const onLogOut = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="navigation">
      <ul>
        <li>
          <Link to="#" className="brand">
            <span className="nav-icon">
              <img src={process.env.PUBLIC_URL + '/images/cow.png'} height={60} alt="CattleFarm Logo" />
            </span>
            <span className="title">CattleFarm</span>
          </Link>
        </li>
        <li className={isActive('/logged/dashboard') ? 'active' : ''}>
          <Link to="/logged/dashboard">
            <span className="nav-icon"><FaHome /></span>
            <span className="title">Summary</span>
          </Link>
        </li>
        <li className={isActive('/logged/profile') ? 'active' : ''}>
          <Link to="/logged/profile">
            <span className="nav-icon"><FaUser /></span>
            <span className="title">My Profile</span>
          </Link>
        </li>
        <li className={isActive('/logged/map') ? 'active' : ''}>
          <Link to="/logged/map">
            <span className="nav-icon"><FaMapMarkerAlt /></span>
            <span className="title">Locate Veterinarian</span>
          </Link>
        </li>
        <li className={isActive('/logged/milk-production') ? 'active' : ''}>
          <Link to="/logged/milk-production">
            <span className="nav-icon"><FaChartLine /></span>
            <span className="title">Milk Production Details</span>
          </Link>
        </li>
        <li className={isActive('/logged/disease-detection') ? 'active' : ''}>
          <Link to="/logged/disease-detection">
            <span className="nav-icon"><FaStethoscope /></span>
            <span className="title">Disease Detection</span>
          </Link>
        </li>
        <li className={isActive('/logged/health-monitor') ? 'active' : ''}>
          <Link to="/logged/health-monitor">
            <span className="nav-icon"><FaHeartbeat /></span>
            <span className="title">Health Checkup</span>
          </Link>
        </li>
        <li>
          <button onClick={onLogOut} className="logout-button">
            <span className="nav-icon"><FaSignOutAlt /></span>
            <span className="title">Sign Out</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
