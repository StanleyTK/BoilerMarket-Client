import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import TopListings from '../components/TopListings';
import { useTheme } from '~/components/ThemeContext';
import type { Listing } from '../service/types';
import { getHistory, getRecommended } from '../service/user-service';
import { ListingCard } from '~/components/ListingCard';

const Feed: React.FC = () => {
  const auth = getAuth();
  const [user] = useAuthState(auth);
  const { theme } = useTheme();

  const [recentlyViewed, setRecentlyViewed] = useState<Listing[]>([]);
  const [recommended, setRecommended] = useState<Listing[]>([]);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(true);
  const [loadingRecommended, setLoadingRecommended] = useState<boolean>(true);

  useEffect(() => {
    if (user) {
      const fetchHistory = async () => {
        try {
          setLoadingHistory(true);
          const currentUser = auth.currentUser;
          if (!currentUser) {
            throw new Error("User not authenticated");
          }
          const idToken = await currentUser.getIdToken();
          const data = await getHistory(idToken, user.uid);
          setRecentlyViewed(data);
        } catch (error) {
          console.error('Error fetching recently viewed items:', error);
        } finally {
          setLoadingHistory(false);
        }
      };

      const fetchRecommended = async () => {
        try {
          setLoadingRecommended(true);
          const currentUser = auth.currentUser;
          if (!currentUser) {
            throw new Error("User not authenticated");
          }
          const idToken = await currentUser.getIdToken();
          const data = await getRecommended(idToken, user.uid);
          setRecommended(data);
        } catch (error) {
          console.error('Error fetching recommended items:', error);
        } finally {
          setLoadingRecommended(false);
        }
      };

      fetchHistory();
      fetchRecommended();
    }
  }, [user]);


  return (
    <div className={`${theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-black"} min-h-screen`}>
      <main className="p-8 text-center">
        {user ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">Recently Viewed:</h2>
            <div className="mb-8">
              {loadingHistory ? (
                <p>Loading...</p>
              ) : recentlyViewed.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recentlyViewed.map((item) => (
                    <ListingCard key={item.id} listing={item} />
                  ))}
                </div>
              ) : (
                <p>No recently viewed items found.</p>
              )}
            </div>
            <h2 className="text-2xl font-bold mb-4">Recommended:</h2>
            <div className="mb-8">
              {loadingRecommended ? (
                <p>Loading...</p>
              ) : recommended.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommended.map((item) => (
                    <ListingCard key={item.id} listing={item} />
                  ))}
                </div>
              ) : (
                <p>No recommended items found.</p>
              )}
            </div>
          </div>
        ) : (
          <TopListings />
        )}
      </main>
    </div>
  );
};

export default Feed;
