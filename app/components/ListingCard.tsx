import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeDropperEmpty, faUser } from '@fortawesome/free-solid-svg-icons';
import { faUserPen } from '@fortawesome/free-solid-svg-icons/faUserPen';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";
import { updateListing } from '~/service/listing-service';


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
  profilePicture: string,
}

// todo - maybe change this to be required once we do view other listings?
interface ListingCardProps {
  listing: Listing;
  userOwnsListing?: boolean;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, userOwnsListing }) => (
  <div className="relative bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-[1.03]">
    {userOwnsListing ? (
      <>
        <Link
          to={`/u/${listing.uid}/manage_listings`}
          state={{ selectedListing: listing }}
        >
          <div className="absolute top-2 left-2 z-10 w-10 h-10 rounded-full bg-white shadow flex items-center justify-center cursor-pointer">
            <FontAwesomeIcon icon={faUserPen} className="text-gray-600 text-xl" />
          </div>
        </Link>

        <div
          className="absolute top-2 right-2 z-10 w-10 h-10 rounded-full bg-white shadow flex items-center justify-center cursor-pointer"
        >
          <FontAwesomeIcon icon={listing.hidden ? faEyeSlash : faEye} className="text-gray-600 text-xl" />
        </div>
      </>


    ) : (
      <Link to={`/u/${listing.uid}`}>
      <div className="absolute top-2 left-2 z-10 w-10 h-10 rounded-full bg-white shadow flex items-center justify-center cursor-pointer overflow-hidden">
        {listing.profilePicture ? (
          <img
            src={listing.profilePicture}
            alt="User Avatar"
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <FontAwesomeIcon icon={faUser} className="text-gray-600 text-xl" />
        )}
      </div>
    </Link>
    )}
    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10 px-3 py-1 text-red-600 font-bold text-lg">
      {listing.sold ? "SOLD" : ""}
    </div>


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
      <p className="mt-2 text-gray-700 font-medium">Price:
        {listing.original_price !== listing.price && (
          <span className="line-through text-gray-500 mr-2">${listing.original_price}</span>
        )}
        ${listing.price}
      </p>
      <p className="mt-2 text-gray-600 text-sm">{listing.description}</p>
    </div>
  </div>
);
