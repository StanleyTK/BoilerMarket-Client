import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

interface Listing {
  id: number;
  title: string;
  description: string;
  price: number | string;
  image?: string;
  displayName?: string;
  uid: string;
}

interface ListingCardProps {
  listing: Listing;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing }) => (
  <div className="relative bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-[1.03]">
    <Link to={`/u/${listing.uid}`}>
      <div className="absolute top-2 left-2 z-10 w-10 h-10 rounded-full bg-white shadow flex items-center justify-center cursor-pointer">
        <FontAwesomeIcon icon={faUser} className="text-gray-600 text-xl" />
      </div>
    </Link>
    <div className="relative h-48 w-full">
      {listing.image ? (
        <img
          src={listing.image} // when we have it lol
          alt={listing.title}
          className="object-cover h-full w-full"
        />
      ) : (
        <div className="bg-gray-300 h-full w-full flex items-center justify-center text-gray-500">
          No image
        </div>
      )}
    </div>
    <div className="p-4">
      <h3 className="text-xl font-semibold text-gray-800">{listing.title}</h3>
      {listing.displayName && (
        <p className="mt-1 text-gray-500 text-sm">{listing.displayName}</p>
      )}
      <p className="mt-2 text-gray-700 font-medium">Price: {listing.price}</p>
      <p className="mt-2 text-gray-600 text-sm">{listing.description}</p>
    </div>
  </div>
);
