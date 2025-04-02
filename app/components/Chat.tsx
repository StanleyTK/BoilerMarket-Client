import { getApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { getMessages, getRoom } from "~/service/chat-service";
import type { MessageData, RoomData, UserProfileData } from "~/service/types";
import { getUser } from "~/service/user-service";

interface ChatProps {
  rid: number;
}

const Chat: React.FC<ChatProps> = ({ rid }) => {
  const auth = getAuth(getApp());
  const navigate = useNavigate();
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);

  useEffect(() => {
    const getIdToken = async () => {
      try {
        const idToken = await auth.currentUser?.getIdToken();
        if (!idToken) {
          throw new Error("User not authenticated");
        }
        setIdToken(idToken);
      } catch (error) {
        console.error("Failed to get ID token:", error);
        setError(`Failed to get ID token: ${error}`);
      }
    };

    getIdToken();
  }, [auth]);

  useEffect(() => {
    const initializeWebSocket = async () => {
      if (!idToken || !rid) {
        return
      }
      const ws = new WebSocket(`ws://localhost:8000/ws/chat/${rid}/?token=${idToken}`);
  
      ws.onopen = () => console.log("Connected to WebSocket");
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log(data);
        setMessages((prev) => [...prev, { sender: data.sender, content: data.message, timeSent: data.timeSent }]);
      };
      ws.onclose = () => console.log("WebSocket disconnected");

      setSocket(ws);

      return () => ws.close();
    };

    initializeWebSocket();
  }, [rid, idToken]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const idToken = await user.getIdToken();
        const roomData = await getRoom(idToken, rid);
        const userData = await getUser(user.uid);
        const messages = await getMessages(idToken, rid);
        setMessages(messages);
        setUserData(userData);
        setRoomData(roomData);
        setError(null);
      } catch (error) {
        console.error("Error getting data:", error);
        setError(`Failed to get data: ${error}`);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [auth, navigate]);

  const sendMessage = () => {
    if (socket && message.trim()) {
      socket.send(JSON.stringify({ sender: userData?.displayName, message }));
      setMessage("");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Chat Room: {roomData?.listingName}</h2>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <p style={{ display: "inline" }}><strong>{msg.sender}:</strong> {msg.content}</p>
            <span style={{ display: "inline", fontSize: "0.8em", color: "gray", marginLeft: "10px" }}>
              {new Date(msg.timeSent).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>
      <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..." />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
