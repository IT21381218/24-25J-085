import Notiflix from 'notiflix';
import React, { useEffect, useState } from 'react';
import ENV from '../data/Env';
import axios from 'axios';
import UpdateCattlePopup from './UpdateCattlePopup';
import { useNavigate } from 'react-router-dom';

const UserSummary = ({user, cattles, removeCattle}) => {
  const navigate = useNavigate()
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedCattle, setSelectedCattle] = useState(null);

  const calculateAge = (birthDate) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    return { years, months };
  }

  const handleRemoveCattle = (id) => {
    console.log(id)
    Notiflix.Confirm.show(
      'Confirm Removal',
      'Are you sure you want to remove this cattle?',
      'Yes, Remove',
      'Cancel',
      async () => {
        try {
          await axios.delete(`${ENV.SERVER}/cattle/${id}`);
          Notiflix.Notify.success('Cattle removed successfully!');
          removeCattle(id); 
        } catch (error) {
          console.log(error)
          Notiflix.Notify.failure('Failed to remove cattle. Please try again.');
        }
      }
    );
  };

  const handleUpdateCattle = (cattle) => {
    setSelectedCattle(cattle);
    setPopupOpen(true); 
  };

  return (
    <div style={{ padding: '16px', backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600' }}>User Summary</h2>
      </div>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        {/* User Details Column (2 parts) */}
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: '500' }}>Full Name:</span>
            <span>{user.full_name}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: '500' }}>Username:</span>
            <span>{user.username}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: '500' }}>Email:</span>
            <span>{user.email}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: '500' }}>NIC:</span>
            <span>{user.nic}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: '500' }}>Contact:</span>
            <span>{user.contact}</span>
          </div>
        </div>
        {/* Profile Image Column (1 part) */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <img 
            src={`${process.env.PUBLIC_URL}/images/front.jpg`} 
            alt="Profile" 
            style={{ width: '150px', height: '150px', borderRadius: '50%', border: '2px solid #ccc' }} 
          />
        </div>
      </div>
      <br></br> <br></br>
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Cattle Summary</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        {/* Iterate over cattles and display them in a grid */}
        {cattles.length === 0 ? (
          <p>No cattles available</p>
        ) : (
          cattles.map((cattle) => {
            const { years, months } = calculateAge(cattle.birth); // Calculate age
            return (
              <div
              
                key={cattle.id}
                style={{
                  backgroundColor: '#f9f9f9',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'row',
                  padding: '16px',
                }}
              >
                {/* Image Section */}
                <div style={{ flex: 2, marginRight: '16px' }}>
                  <div style={{ marginBottom: '8px' }}>
                    <h3 style={{cursor: 'pointer'}}
                    onClick={() => {
                      navigate('/logged/cattle', { state: { cattle } });
                    }}>{cattle.name}</h3> 
                    <small>({cattle.id})</small>
                  </div>
                  <img
                    src={cattle.image}
                    alt={cattle.name}
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: '8px',
                      objectFit: 'cover',
                    }}
                  />
                </div>

                {/* Details Section */}
                <div style={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
                  
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Breed:</strong> {cattle.breed}
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Birth:</strong> {cattle.birth}
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Health:</strong> {cattle.health}
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Status:</strong> {cattle.status}
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Owner:</strong> {cattle.owner}
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Age:</strong> {years} years, {months} months
                  </div>

                  <div style={{ marginBottom: '8px' }}>
                    <button 
                        onClick={() =>handleUpdateCattle(cattle)}
                        style={{
                          backgroundColor: 'purple',
                          color: 'white',
                          padding: '8px 12px',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          marginRight: '5px'
                        }}
                      >
                        Update
                    </button>
                    <button 
                      onClick={() => handleRemoveCattle(cattle.id)}
                      style={{
                        backgroundColor: 'red',
                        color: 'white',
                        padding: '8px 12px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Remove
                  </button>
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>
      {/* Render the Update Cattle Popup */}
      {isPopupOpen && (
        <UpdateCattlePopup 
          cattle={selectedCattle} 
          onClose={() => setPopupOpen(false)} 
        />
      )}
    </div>
  );
};

export default UserSummary;