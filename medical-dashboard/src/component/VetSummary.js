import Notiflix from 'notiflix';
import React, { useState } from 'react';
import ENV from '../data/Env';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaCalendarCheck } from 'react-icons/fa';

const VeterinarianSummary = ({ veterinarian, appointments, removeAppointment }) => {
  const navigate = useNavigate();
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  console.log(appointments)

  const handleRemoveAppointment = (id) => {
    Notiflix.Confirm.show(
      'Confirm Removal',
      'Are you sure you want to remove this appointment?',
      'Yes, Remove',
      'Cancel',
      async () => {
        try {
          await axios.delete(`${ENV.SERVER}/appointments/${id}`);
          Notiflix.Notify.success('Appointment removed successfully!');
          removeAppointment(id);
        } catch (error) {
          Notiflix.Notify.failure('Failed to remove appointment. Please try again.');
        }
      }
    );
  };

  return (
    <div style={{ padding: '16px', backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Veterinarian Summary</h2>
      </div>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        {/* Veterinarian Details Column */}
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: '500' }}>Full Name:</span>
            <span>{veterinarian.full_name}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: '500' }}>Username:</span>
            <span>{veterinarian.username}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: '500' }}>Email:</span>
            <span>{veterinarian.email}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: '500' }}>License No:</span>
            <span>{veterinarian.license_no}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: '500' }}>Contact:</span>
            <span>{veterinarian.contact}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: '500' }}>Specialization:</span>
            <span>{veterinarian.specialization}</span>
          </div>
        </div>
        {/* Profile Image Column */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <img
            src={`${process.env.PUBLIC_URL}/images/vet.jpg`}
            alt="Veterinarian"
            style={{ width: '150px', height: '150px', borderRadius: '50%', border: '2px solid #ccc' }}
          />
        </div>
      </div>

      <br></br> <br></br>
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Appointment Summary</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        {appointments.length === 0 ? (
          <p>No appointments available</p>
        ) : (
          appointments.map((appointment) => (
            <div
              key={appointment.id}
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
              {/* Appointment Details Section */}
              <div style={{ flex: 1, marginRight: '16px', display: 'flex', alignItems: 'center', flexDirection: 'column', 
                alignItems: 'center', justifyContent: 'center' }}>
                <FaCalendarCheck size={44} color="green" style={{ marginRight: '8px' }} />
                <strong>Appointment</strong>
            </div>

              {/* Details Section */}
              <div style={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '8px' }}>
                    <strong>{appointment.id}</strong> 
                </div>
                <div style={{ marginBottom: '8px' }}>
                    <strong>Owner:</strong> {appointment.username}
                </div>
                <div style={{ marginBottom: '8px' }}>
                    <strong>Date:</strong> {appointment.date}
                </div>
                <div style={{ marginBottom: '8px' }}>
                    <strong>Time:</strong> {appointment.time}
                </div>
                {appointment.message && (
                    <div style={{ marginBottom: '8px' }}>
                    <strong>Message:</strong> {appointment.message}
                    </div>
                )}

                <div style={{ marginBottom: '8px' }}>
                  <button
                    onClick={() => navigate('/logged/chat/'+appointment.username)}
                    style={{
                      backgroundColor: 'blue',
                      color: 'white',
                      padding: '8px 12px',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginRight: '5px'
                    }}
                  >
                    Chat
                  </button>
                  <button
                    onClick={() => handleRemoveAppointment(appointment.id)}
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
          ))
        )}
      </div>

      {/* View Appointment Popup */}
      {isPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <h3>Appointment Details</h3>
            <p><strong>Cattle:</strong> {selectedAppointment?.cattle_name}</p>
            <p><strong>Owner:</strong> {selectedAppointment?.owner}</p>
            <p><strong>Date:</strong> {selectedAppointment?.date}</p>
            <p><strong>Time:</strong> {selectedAppointment?.time}</p>
            <p><strong>Status:</strong> {selectedAppointment?.status}</p>
            <button onClick={() => setPopupOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VeterinarianSummary;
