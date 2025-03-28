import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeDropperEmpty, faUser } from '@fortawesome/free-solid-svg-icons';
import { faUserPen } from '@fortawesome/free-solid-svg-icons/faUserPen';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";
import { updateListing } from '~/service/listing-service';
import { getAuth } from "firebase/auth";
import { createRoom } from '~/service/chat-service';
import { useNavigate } from 'react-router';


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
}

// todo - maybe change this to be required once we do view other listings?
interface ListingCardProps {
  listing: Listing;
  userOwnsListing?: boolean;
}

const handleCreateChat = async (listingId: number, navigate: ReturnType<typeof useNavigate>) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) {
    console.error("User not authenticated");
    return;
  }
  const idToken = await user.getIdToken();

  createRoom(idToken, listingId, user.uid)
  .then((roomId) => {
    if (roomId == -1) {
      console.error("Error creating chat room - room ID -1 indicates an error");
      return;
    }
    console.log("Chat room created with ID:", roomId);
    navigate(`/inbox/${roomId}`,); // navigate to the chat room
  })
  .catch((error) => {
    console.error("Error creating chat room:", error);
  })
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, userOwnsListing }) => {
  const navigate = useNavigate();

  return (
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
        <div className="absolute top-2 left-2 z-10 w-10 h-10 rounded-full bg-white shadow flex items-center justify-center cursor-pointer">
          <FontAwesomeIcon icon={faUser} className="text-gray-600 text-xl" />
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
    <button 
      onClick={() => handleCreateChat(listing.id, navigate)} 
      style={{
          backgroundColor: "#007BFF",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "16px",
          marginBottom: "10px",
      }}
      >
      Open Chat
    </button>
  </div>
)
};
