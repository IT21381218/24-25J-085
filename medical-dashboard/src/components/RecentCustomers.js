// // components/RecentCustomers.js
// import React from 'react';

// const RecentCustomers = () => {
//   return (
//     <div className="recentCustomers">
//       <div className="cardHeader">
//         <h2>Notifications</h2>
//       </div>
      
//     </div>
//   );
// };

// export default RecentCustomers;




// components/RecentCustomers.js
import React from 'react';

const RecentCustomers = ({ customers }) => {
  return (
    <div className="recentCustomers">
      <div className="cardHeader">
        <h2>Notifications</h2>
      </div>
      <ul className="customer-list">
        {customers.map((customer, index) => (
          <li key={index} className="customer-item">
            <img src={customer.image} alt={customer.name} className="customer-image" />
            <div className="customer-info">
              <h4>{customer.name}</h4>
              <p>{customer.notification}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentCustomers;
