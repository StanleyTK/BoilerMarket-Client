import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import Listings from './components/Listings';

const Feed: React.FC = () => {
  const auth = getAuth();
  const [user] = useAuthState(auth);

  return (
    <div className="bg-gray-800 min-h-screen text-white">
      <main className="p-8 text-center">

        <Listings />
      </main>
    </div>
  );
};

export default Feed;
