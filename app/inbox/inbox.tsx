import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate, useParams } from 'react-router';
import type { InboxRoomData } from '../service/types';
import { getRooms } from '../service/chat-service';
import { getApp } from 'firebase/app';
import Chat from '~/components/Chat';

const Inbox: React.FC = () => {
  const auth = getAuth(getApp());
  const navigate = useNavigate();
  const { rid } = useParams<{ rid: string }>();
  const [rooms, setRooms] = useState<InboxRoomData[]>([]);
  const [selectedRid, setSelectedRid] = useState<number>(rid ? parseInt(rid) : -1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleRoomClick = (roomId: number) => {
    setSelectedRid(roomId);
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

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: '1', borderRight: '1px solid #ccc', overflowY: 'auto' }}>
        {rooms.length === 0 ? (<div>No rooms found</div>) : (
          <div>
            {rooms.map((room) => (
              <div 
                key={room.rid} 
                onClick={() => handleRoomClick(room.rid)} 
                style={{ cursor: 'pointer', padding: '10px', border: '1px solid #ccc', marginBottom: '10px' }}
              >
                <h3>{room.listingName}</h3>
                <p>Seller: {room.seller}</p>
                <p>Buyer: {room.buyer}</p>
                <p>Last Message: {room.recentMessage}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{ flex: '2', padding: '20px' }}>
        {selectedRid === -1 ? (
          <p>Select a room to start chatting.</p>
        ) : (
          <Chat key={selectedRid} rid={selectedRid} />
        )}
      </div>
    </div>
  );
}

export default Inbox;