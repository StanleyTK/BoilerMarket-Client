import { getApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { createContext, useEffect, useState, type ReactNode } from "react";
import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

// Define the shape of notification data
interface Notification {
  sender: string;
  message: string;
  room: string;
}

// Define the context type
interface WebSocketContextType {
  notifications: Notification[];
}

// Create WebSocket context
export const WebSocketContext = createContext<WebSocketContextType | null>(null);

interface WebSocketProviderProps {
  children: ReactNode; // Allows passing React components inside the provider
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const auth = getAuth(getApp());
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [idToken, setIdToken] = useState<string | null>(null);

  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        console.log("🔔 Notification Permission:", permission);
      });
    }
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          setIdToken(token);
        } catch (error) {
          console.error("Failed to get ID token:", error);
        }
      } else {
        setIdToken(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (!idToken) {
      return;
    }
    const ws = new WebSocket(`ws://localhost:8000/ws/global/?token=${idToken}`);

    ws.onopen = () => console.log("Connected to global notification WebSocket");

    ws.onmessage = (event: MessageEvent) => {
      console.log("📩 Received WebSocket Message:", event.data);
      try {
        const data: Notification = JSON.parse(event.data);
        setNotifications((prev) => [...prev, data]);

        // Show browser notification when the tab is not active
        // new Notification(`New message in ${data.room}`, { body: `${data.sender}: ${data.message}` });
        console.log("triggering toast");
        toast.info(`New message in ${data.room}: ${data.sender}: ${data.message}`);
        // alert(`New message in ${data.room}: ${data.sender}: ${data.message}`);
      } catch (error) {
        console.error("Error parsing WebSocket message", error);
      }
    };

    ws.onerror = (error: Event) => console.error("WebSocket error:", error);
    ws.onclose = () => console.log("Disconnected from global notification WebSocket");

    setSocket(ws);

    return () => ws.close();
  }, [idToken]);

  return (
    <>
      <WebSocketContext.Provider value={{ notifications }}>
        {children}
      </WebSocketContext.Provider>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
    </>
  );
};
