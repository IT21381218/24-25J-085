import React, { useEffect, useState } from "react";
import { FaPaperclip, FaFileAlt } from "react-icons/fa";
import ENV from "../data/Env";
import { useParams } from "react-router-dom";

const ChatMessages = () => {
  const { receiver: urlReceiver } = useParams();
  const receiver = urlReceiver || "open-channel";

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [websocket, setWebSocket] = useState(null);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : { username: "Guest" };
  });

  useEffect(() => {
    const fetchPreviousMessages = async () => {
      try {
        const response = await fetch(`${ENV.SERVER}/chat/${user.role!='Veterinarian'?user.username:user.full_name}/${receiver}`);
        const data = await response.json();
        if (data.status === "success") {
          // Convert API messages to required format: {time, client_id, message}
          const formattedMessages = data.data.map((msg) => ({
            time: msg.timestamp,
            client_id: msg.sender, // Map sender to client_id
            message: msg.message,
          }));
          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error("Error fetching previous messages:", error);
      }
    };

    fetchPreviousMessages();

    const url = `${ENV.SOCKET_SERVER}/ws/${user.role!='Veterinarian'?user.username:user.full_name}`;
    const ws = new WebSocket(url);
  
    ws.onopen = () => ws.send("Connect");
  
    ws.onmessage = (e) => {
      const message = JSON.parse(e.data);
      console.log(message)
      if(receiver=="open-channel"||message.client_id==receiver||message.client_id==(user.role!='Veterinarian'?user.username:user.full_name))
      setMessages((prevMessages) => [...prevMessages, message]);
    };
  
    setWebSocket(ws);
    return () => ws.close();
  }, []);
  
  const sendMessage = async () => {
    if (newMessage.trim() === "" && !filePreview) return;
  
    const finalMessage = newMessage + (filePreview ? ` ${filePreview}` : "");
    websocket.send(finalMessage);
  
    // Remove the local state update to avoid duplicating the message
    // setMessages((prevMessages) => [
    //   ...prevMessages,
    //   { client_id: user.username, message: finalMessage },
    // ]);

    try {
      await fetch(`${ENV.SERVER}/chat-save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: user.role!=='Veterinarian'?user.username:user.full_name,
          receiver: receiver,
          message: finalMessage,
        }),
      });
    } catch (error) {
      console.error("Error saving chat message:", error);
    }
  
    setNewMessage("");
    setFile(null);
    setFilePreview(null);
  };

  const handleFileUpload = async (selectedFile) => {
    if (!selectedFile) return;
    
    const data = new FormData();
    data.append("file", selectedFile);
    data.append("upload_preset", "gtnnidje");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dkox7lwxe/image/upload",
        { method: "POST", body: data }
      );
      const cloudinaryData = await response.json();
      setFilePreview(cloudinaryData.secure_url);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file. Please try again.");
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      handleFileUpload(selectedFile);
    }
  };

  return (
    <div className="recentOrders" style={{maxHeight: '80vh'}}>
      <div className="cardHeader">
        <h2>Chat Messages</h2>
      </div>
      
      <div className="chatMessages" style={{maxHeight: '60vh'}}>
        {messages.map((msg, index) => {
          const isSelf = msg.client_id === (user.role!='Veterinarian'?user.username:user.full_name);
          const isImage = msg.message.match(/\.(jpeg|jpg|png|gif)$/);
          const isFile = msg.message.match(/\.(pdf|docx|txt)$/);
          
          return (
            <div key={index} className={`message ${isSelf ? "self" : "other"}`}>
              <strong>{msg.client_id}</strong>
              {isImage ? (
                <img src={msg.message} alt="Sent" className="imagePreview" />
              ) : isFile ? (
                <a href={msg.message} target="_blank" rel="noopener noreferrer">
                  <FaFileAlt className="fileIcon" />
                </a>
              ) : (
                <p>{msg.message}</p>
              )}
            </div>
          );
        })}
      </div>

      {filePreview && (
        <div className="filePreviewContainer">
          {filePreview.match(/\.(jpeg|jpg|png|gif)$/) ? (
            <img src={filePreview} alt="Preview" className="imagePreview" />
          ) : (
            <FaFileAlt className="fileIcon" />
          )}
        </div>
      )}

      <div className="chatInput">
        <label className="clipIcon">
          <FaPaperclip />
          <input type="file" onChange={handleFileChange} style={{ display: "none" }} />
        </label>
        <input
          type="text"
          placeholder="Type a message..."
          readOnly={filePreview!=null}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatMessages;
