// // pages/VetLocate.js
// import React from 'react';
// import Sidebar from '../components/Sidebar';
// import Topbar from '../components/Topbar';
// import Footer from '../components/Footer';
// import MilkQualityCheckForm from '../components/MilkQualityCheckForm';
// import CustomMap from '../components/CustomMap';
// import InformationContainer from '../components/InformationContainer';

// const VetLocate = () => {
//   return (
//     <div className="dashContainer">
//       <Sidebar />
//       <div className="main">
//         <Topbar />
//         <div className="details">
//           <CustomMap />
//           <InformationContainer />
//         </div>
//         <Footer />
//       </div>
//     </div>
//   );
// };

// export default VetLocate;







// pages/VetLocate.js
// import React from 'react';
// import Sidebar from '../components/Sidebar';
// import Topbar from '../components/Topbar';
// import Footer from '../components/Footer';
// import CustomMap from '../components/CustomMap';
// import InformationContainer from '../components/InformationContainer';

// const VetLocate = () => {
//   return (
//     <div className="dash-container">
//       <Sidebar />
//       <div className="main-content">
//         <Topbar />
//         <div className="details">
//           <CustomMap />
//           <InformationContainer />
//         </div>
//         <Footer />
//       </div>
//     </div>
//   );
// };

// export default VetLocate;







import React from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import Footer from '../components/Footer';
import CustomMap from '../components/CustomMap';
import InformationContainer from '../components/InformationContainer';

const VetLocateLayout = ({ children }) => (
  <div className="dash-container">
    <Sidebar />
    <div className="main-content">
      <Topbar />
      {children}
      <Footer />
    </div>
  </div>
);

const VetLocate = () => (
  <VetLocateLayout>
    <div className="details">
      <CustomMap />
      <InformationContainer />
    </div>
  </VetLocateLayout>
);

export default VetLocate;