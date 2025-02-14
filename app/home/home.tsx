import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import Listings from './components/Listings';

const Home: React.FC = () => {
  const auth = getAuth();
  const [user] = useAuthState(auth);

  return (
    <div className="bg-gray-800 min-h-screen text-white">
      <main className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Today's Picks
        </h2>
        <Listings />
      </main>
    </div>
  );
};

export default Home;
