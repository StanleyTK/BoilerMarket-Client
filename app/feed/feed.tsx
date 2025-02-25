import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import Listings from '../components/Listings';
import { useTheme } from '~/components/ThemeContext';

const Feed: React.FC = () => {
  const auth = getAuth();
  const [user] = useAuthState(auth);
  const { theme } = useTheme();

  return (
    <div className={`${theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-black"} min-h-screen`}>
      <main className="p-8 text-center">
        <Listings />
      </main>
    </div>
  );
};

export default Feed;
