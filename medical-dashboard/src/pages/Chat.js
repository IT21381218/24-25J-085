import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import Footer from '../components/Footer';

const ChatSection = ({ selectedVet }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

//   useEffect(() => {
//     if (selectedVet) {
//       setMessages([{ text: `You are now chatting with Dr. ${selectedVet.name}`, sender: 'system' }]);
//     }
//   }, [selectedVet]);

//   const handleSendMessage = (e) => {
//     e.preventDefault();
//     if (input.trim()) {
//       setMessages([...messages, { text: input, sender: 'user' }]);
//       setInput('');
//     }
//   };

  return (
    <div className="dash-container">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <div className="chat-container">
          {selectedVet ? (
            <div className="vet-profile">
              <h3>Chat with Dr. {selectedVet.name}</h3>
              <p>Specialty: {selectedVet.specialty}</p>
              <p>Location: {selectedVet.location}</p>
            </div>
          ) : (
            <p>Please select a veterinarian to start chatting.</p>
          )}
          <div className="chat-box">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <form className="chat-input" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
            />
            <button type="submit">Send</button>
          </form>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ChatSection;
