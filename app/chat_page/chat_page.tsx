import React, { useState } from "react";
import Chat from "../components/Chat"; // Import the Chat component

const ChatPage = () => {
  const [roomName, setRoomName] = useState("");
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);

  const handleJoin = () => {
    if (roomName.trim() && username.trim()) {
      setJoined(true);
    } else {
      alert("Please enter both a username and room name.");
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">Real-Time Chat</h1>

      {!joined ? (
        <div className="p-4 border rounded-lg shadow-lg">
          <input
            type="text"
            placeholder="Enter a chat room..."
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="border p-2 mb-2 w-full"
          />
          <input
            type="text"
            placeholder="Enter your username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 mb-2 w-full"
          />
          <button
            onClick={handleJoin}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
          >
            Join Chat
          </button>
        </div>
      ) : (
        <Chat roomName={roomName} username={username} />
      )}
    </div>
  );
};

export default ChatPage;
