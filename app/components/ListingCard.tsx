import React, { useState } from 'react';
import { useNavigate } from "react-router";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faUser, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faUserPen } from '@fortawesome/free-solid-svg-icons/faUserPen';
import { updateListing } from '~/service/listing-service';
import { getAuth } from "firebase/auth";
import { createRoom } from '~/service/chat-service';

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
  media?: string[];
}

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

const renderMedia = (url: string, index: number) => {
  const isVideo = url.match(/\.(mp4|mov|webm)$/i);
  return isVideo ? (
    <video key={index} controls className="object-cover h-full w-full rounded-t-xl">
      <source src={url} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  ) : (
    <img
      key={index}
      src={url}
      alt={`listing media ${index}`}
      className="object-cover h-full w-full rounded-t-xl"
    />
  );
};


export const ListingCard: React.FC<ListingCardProps> = ({ listing, userOwnsListing }) => {
  const [mediaIndex, setMediaIndex] = useState(0);
  const mediaLength = listing.media?.length || 0;
  const navigate = useNavigate();


  const handleNext = () => {
    if (mediaLength > 0) {
      setMediaIndex((prev) => (prev + 1) % mediaLength);
    }
  };

  const handlePrev = () => {
    if (mediaLength > 0) {
      setMediaIndex((prev) => (prev - 1 + mediaLength) % mediaLength);
    }
  };

  const handleCardClick = () => {
    navigate(`/l/${listing.id}`);
  };

  return (
    <Link to={`/l/${listing.id}`} className="block">
      <div className="relative bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-[1.03]">
        {/* Top Buttons */}
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
            <div className="absolute top-2 right-2 z-10 w-10 h-10 rounded-full bg-white shadow flex items-center justify-center cursor-pointer">
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

        {/* SOLD Tag */}
        {listing.sold && (
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10 px-3 py-1 text-red-600 font-bold text-lg">
            SOLD
          </div>
        )}
        ${listing.price}
      </p>
      <p className="mt-2 text-gray-600 text-sm">{listing.description}</p>
    </div>
  </div>
)


        {/* Media Carousel */}
        <div className="relative h-48 w-full bg-black">
          {listing.media && listing.media.length > 0 ? (
            <>
              {renderMedia(listing.media[mediaIndex], mediaIndex)}
              {listing.media.length > 1 && (
                <>
                  {/* Prev Button */}
                  <button
                    onClick={handlePrev}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white px-3 py-1 rounded-r"
                  >
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>

                  {/* Next Button */}
                  <button
                    onClick={handleNext}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white px-3 py-1 rounded-l"
                  >
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="bg-gray-300 h-full w-full flex items-center justify-center text-gray-500">
              No media
            </div>
          )}
        </div>

        {/* Details */}
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-800">{listing.title}</h3>
          {listing.displayName && (
            <p className="mt-1 text-gray-500 text-sm">{listing.displayName}</p>
          )}
          <p className="mt-2 text-gray-700 font-medium">
            Price:
            {listing.original_price !== listing.price && (
              <span className="line-through text-gray-500 mr-2">
                ${listing.original_price}
              </span>
            )}
            ${listing.price}
          </p>
          <p className="mt-2 text-gray-600 text-sm">{listing.description}</p>
        </div>
      </div>
      </Link>
  );
};
