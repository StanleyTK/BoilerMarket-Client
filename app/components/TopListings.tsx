import React, { useEffect, useState } from 'react';
import { fetchTopListings, fetchTopListingsVerified } from '~/service/fetch-listings';
import { ListingCard } from './ListingCard';
import { getAuth, onAuthStateChanged, sendEmailVerification } from "firebase/auth";
import { getApp } from "firebase/app";

interface Listing {
  id: number;
  title: string;
  description: string;
  price: number | string;
  original_price: number | string;
  image?: string;
  displayName?: string;
  uid: string;
  hidden: boolean;
  sold: boolean;
  profilePicture: string;
}

const TopListings: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const auth = getAuth(getApp());  

  useEffect(() => {

    const getListings = async () => {
      try {
        console.log(auth.currentUser)
        if (!auth.currentUser) {
          const data = await fetchTopListings();
          console.log(data);
          setListings(data);

        }else {
          const idToken = await auth.currentUser.getIdToken();
          const data = await fetchTopListingsVerified(idToken);
          setListings(data);
        }
      } catch (error) {
        console.error('Error fetching top listings:', error);
      }
    };

    getListings();
  }, []);

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-6">
      {listings.length > 0 ? (
        listings.filter((listing) => !listing.hidden)
          .map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))
      ) : (
        <div>Loading listings...</div>
      )}
    </div>
  );
};

export default TopListings;
