// pages/DiseaseDetection.js
import React from 'react';
import Topbar from '../components/Topbar';
import Footer from '../components/Footer';
import DiseaseUpload from '../components/DiseaseUpload';
import InformationContainer from '../components/InformationContainer';

const DiseaseDetection = () => {
    return (
        <div className="dashContainer">
            <Sidebar />
            <div className="main">
                <Topbar />
                <div className="details">
                    <DiseaseUpload />
                    <InformationContainer />
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default DiseaseDetection;
