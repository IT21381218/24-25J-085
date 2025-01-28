import React from 'react';

const Topbar = () => {
  return (
    <div className="topbar">
      {/* Toggle Menu */}
      <div className="toggle">
        <ion-icon name="menu-outline" role="img" aria-label="Toggle menu"></ion-icon>
      </div>

      {/* Search Bar */}
      <div className="search">
        <label>
          <input
            type="text"
            placeholder="Search here"
            aria-label="Search input"
          />
          <ion-icon name="search-outline" role="img" aria-label="Search icon"></ion-icon>
        </label>
      </div>

      {/* User Profile */}
      <div className="user">
        <img src="assets/imgs/customer01.jpg" alt="User Profile" />
      </div>
    </div>
  );
};

export default Topbar;
