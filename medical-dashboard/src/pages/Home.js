// Home.js
import React from 'react';
import TopNav from '../components/TopNavigation';
import { Link } from 'react-router-dom';
import InfoBanner from './containers/InfoBanner';
import ContactUsForm from './containers/ContactUsBanner';
import Footer from '../components/footer/Footer';


const Home = () => {
  const backgroundImage = `${process.env.PUBLIC_URL}/images/back.jpg`;
  return (
    <div className="home-container">
        
      {/* Main Section */}
      <div className="main-section" style={{
        backgroundImage: `url(${backgroundImage})`, // Use the local image or online link
        backgroundSize: 'cover',          // Ensures the image covers the entire section
        backgroundPosition: 'center',     // Centers the image
        backgroundRepeat: 'no-repeat',
      }}>
        <TopNav/>
        <div className="content">
          <h1>FARM MONITORING PLATFORM</h1>
          <p>
            Providing top-quality healthcare services tailored to your needs. Join us today and 
            experience personalized care with our experienced professionals.
          </p>
          <Link to={'/sign-up'} className="join-button">Join Now</Link>
          <Link to={'/sign-in'} className="join-button">Login</Link>
        </div>
        <div className="image-section">
          
        </div>
      </div>

      <InfoBanner />

      <hr></hr>

      <ContactUsForm />

      <Footer />
    </div>
  );
};

export default Home;
