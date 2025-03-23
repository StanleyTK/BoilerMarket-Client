import React, { useState, useEffect } from "react";

interface ChatProps {
  roomName: string;
  username: string;
}

const Chat: React.FC<ChatProps> = ({ roomName, username }) => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/chat/${roomName}/`);
    
    ws.onopen = () => console.log("Connected to WebSocket");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, { sender: data.sender, text: data.message }]);
    };
    ws.onclose = () => console.log("WebSocket disconnected");

    setSocket(ws);

    return () => ws.close();
  }, [roomName]);

  const sendMessage = () => {
    if (socket && message.trim()) {
      socket.send(JSON.stringify({ sender: username, message }));
      setMessage("");
    }
  };

  return (
    <div>
      <h2>Chat Room: {roomName}</h2>
      <div>
        {messages.map((msg, index) => (
          <p key={index}><strong>{msg.sender}:</strong> {msg.text}</p>
        ))}
      </div>
      <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..." />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
