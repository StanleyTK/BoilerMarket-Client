import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate, useParams } from 'react-router';
import type { InboxRoomData } from '../service/types';
import { getRooms } from '../service/chat-service';
import { getApp } from 'firebase/app';

const Inbox: React.FC = () => {
  const auth = getAuth(getApp());
  const navigate = useNavigate();
  const { rid } = useParams<{ rid: string }>();
  const [rooms, setRooms] = useState<InboxRoomData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleRoomClick = (roomId: string) => {
    // Placeholder
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const idToken = await user.getIdToken();
        const rooms = await getRooms(idToken);
        setRooms(rooms);
        setError(null);
      } catch (error) {
        console.error("Error getting rooms:", error);
        setError("Failed to get rooms");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!rooms.length) {
    return <div>No rooms found</div>;
  }

  return (
    <div>
        {rooms.map((room) => (
            <div 
                key={room.rid} 
                onClick={() => handleRoomClick(room.rid)} 
                style={{ cursor: 'pointer', padding: '10px', border: '1px solid #ccc', marginBottom: '10px' }}
            >
                <h3>{room.listingTitle}</h3>
                <p>Seller: {room.seller}</p>
                <p>Buyer: {room.buyer}</p>
                <p>Last Message: {room.recentMessage}</p>
            </div>
        ))}
    </div>
  );
}

export default Inbox;