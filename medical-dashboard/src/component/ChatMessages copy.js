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
    const url = `ws://localhost:8000/ws/${user.username}`;
    const ws = new WebSocket(url);

    ws.onopen = () => ws.send("Connect");

    ws.onmessage = (e) => {
      const message = JSON.parse(e.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    setWebSocket(ws);
    return () => ws.close();
  }, []);

  const sendMessage = async () => {
    if (newMessage.trim() === "" && !filePreview) return;

    const finalMessage = newMessage + (filePreview ? ` ${filePreview}` : "");
    websocket.send(finalMessage);

    
    websocket.onmessage = (e) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { client_id: user.username, message: finalMessage },
      ]);
    }

    // try {
    //   await fetch(`${ENV.SERVER}/chat-save`, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       sender: user.username,
    //       receiver: receiver,
    //       message: finalMessage,
    //     }),
    //   });
    // } catch (error) {
    //   console.error("Error saving chat message:", error);
    // }

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
    <div className="recentOrders">
      <div className="cardHeader">
        <h2>Chat Messages</h2>
      </div>
      
      <div className="chatMessages">
        {messages.map((msg, index) => {
          const isSelf = msg.client_id === user.username;
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
