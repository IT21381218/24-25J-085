// components/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer style={{ 
      backgroundColor: '#39ba51', 
      color: 'white', 
      textAlign: 'center', 
      padding: '10px', 
      position: 'fixed', 
      bottom: 0, 
      width: '100%' 
    }}>
      <p style={{ color: 'white' }}>© 2024 CattleFarm. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
