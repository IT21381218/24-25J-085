import React, { useState } from 'react';
import './info.css';

const InfoBanner = () => {
  const profileImage = `${process.env.PUBLIC_URL}/images/front.jpg`;

  // Define state for active tab
  const [activeTab, setActiveTab] = useState('Health Monitoring');

  // Define content for each tab
  const tabContent = {
    'Health Monitoring': {
      title: 'Enhance Herd Health',
      description: 'Monitor the health of your cattle in real-time to detect early signs of illness and ensure optimal wellbeing.',
    },
    'Feed Management': {
      title: 'Optimize Feed Management',
      description: 'Efficiently manage feed resources to improve cattle nutrition and reduce waste.',
    },
    'Breeding': {
      title: 'Streamline Breeding Cycles',
      description: 'Leverage data to optimize breeding schedules and improve reproductive outcomes.',
    },
    'Dairy Production': {
      title: 'Increase Dairy Productivity',
      description: 'Implement best practices and technology to enhance milk yield and quality.',
    },
    'Environmental Impact': {
      title: 'Reduce Environmental Impact',
      description: 'Adopt sustainable practices to minimize the ecological footprint of cattle farming.',
    },
    'Technology': {
      title: 'Leverage Farming Technology',
      description: 'Utilize the latest tools to automate processes and improve operational efficiency.',
    },
  };

  return (
    <div className={'container'}>
      <h1 className={'title'}>Innovative Solutions for Modern Cattle Farming</h1>

      {/* Tabs Section */}
      <div className={'tabs'}>
        {Object.keys(tabContent).map((tab, index) => (
          <span
            key={index}
            className={`tab ${activeTab === tab ? 'activeTab' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </span>
        ))}
      </div>

      {/* Content Section */}
      <div className={'contentContainer'}>
        <div className={'content'}>
          <div className={'feature'}>
            <div className={'icon'}></div>
            <div>
              <h2>{tabContent[activeTab].title}</h2>
              <p>{tabContent[activeTab].description}</p>
            </div>
            
          </div>
          <div className={'feature'}>
            <div className={'icon'}></div>
            <div>
              <h2>{tabContent[activeTab].title}</h2>
              <p>{tabContent[activeTab].description}</p>
            </div>
            
          </div>
          <div className={'feature'}>
            <div className={'icon'}></div>
            <div>
              <h2>{tabContent[activeTab].title}</h2>
              <p>{tabContent[activeTab].description}</p>
            </div>
            
          </div>
          <a href="#learn-more" className={'learnMore'}>Learn more →</a>
        </div>

        {/* Image Section */}
        <div className={'imageSection'}>
          <img src={profileImage} alt="Farm Profile" className={'profileImage'} />
          <div className={'stats'}>
            <p>95% of farmers report improved herd health with our solutions</p>
          </div>
          <div className={'meeting'}>
            <p className={'day'}>FRI</p>
            <p className={'time'}>2:00PM - 3:00PM</p>
            <p className={'meetingTitle'}>Farm Consultation</p>
            <p className={'meetingType'}>Health & Productivity Assessment</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoBanner;
