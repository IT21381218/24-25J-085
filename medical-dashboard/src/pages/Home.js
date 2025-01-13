// Importing React library
import React from 'react';

// Importing custom components
import TopNav from '../components/TopNavigation'; // Top navigation bar
import { Link } from 'react-router-dom'; // For navigation links
import InfoBanner from './containers/InfoBanner'; // Information banner section
import ContactUsForm from './containers/ContactUsBanner'; // Contact Us form section
import Footer from '../components/footer/Footer'; // Footer section

// The Home component
const Home = () => {
  // Define the background image path
  const backgroundImage = `${process.env.PUBLIC_URL}/images/back.jpg`;

  return (
    <div className="home-container">
      {/* Main Section */}
      <div
        className="main-section"
        style={{
          backgroundImage: `url(${backgroundImage})`, // Set the background image
          backgroundSize: 'cover', // Ensures the image covers the entire section
          backgroundPosition: 'center', // Centers the image
          backgroundRepeat: 'no-repeat', // Prevents image repetition
        }}
      >
        {/* Top navigation bar */}
        <TopNav />

        {/* Main content */}
        <div className="content">
          <h1>FARM MONITORING PLATFORM</h1>
          <p>
            Providing top-quality healthcare services tailored to your needs. Join us today and
            experience personalized care with our experienced professionals.
          </p>

          {/* Navigation buttons */}
          <Link to={'/sign-up'} className="join-button">
            Join Now
          </Link>
          <Link to={'/sign-in'} className="join-button">
            Login
          </Link>
        </div>

        {/* Placeholder for an image section */}
        <div className="image-section"></div>
      </div>

      {/* Information banner section */}
      <InfoBanner />

      {/* Horizontal divider */}
      <hr></hr>

      {/* Contact Us form section */}
      <ContactUsForm />

      {/* Footer section */}
      <Footer />
    </div>
  );
};

// Exporting the Home component as the default export
export default Home;
