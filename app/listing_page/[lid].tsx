// src/pages/ListingPage.tsx
import React, {
  useEffect,
  useState,
  useRef,
  type ReactNode,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import {
  getListing,
  incrementListingView,
  saveListing,
  unsaveListing,
} from "~/service/listing-service";
import { Link } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getApp } from "firebase/app";
import { createRoom } from "~/service/chat-service";

interface Listing {
  views: ReactNode;
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
  saved_by: string[];
  media?: string[];
  category: string;
  location: string;
  dateListed: string;
}

const handleCreateChat = async (
  listingId: number,
  navigate: ReturnType<typeof useNavigate>
) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) {
    console.error("User not authenticated");
    return;
  }
  const idToken = await user.getIdToken();
  try {
    const roomId = await createRoom(idToken, listingId, user.uid);
    if (roomId === -1) {
      throw new Error("Error creating chat room");
    }
    navigate(`/inbox/${roomId}`);
  } catch (err) {
    console.error("Error creating chat room:", err);
  }
};

const ListingPage: React.FC = () => {
  const { lid: lidFromURL } = useParams<{ lid: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mediaIndex, setMediaIndex] = useState(0);
  const [saveCount, setSaveCount] = useState(0);
  const navigate = useNavigate();
  const auth = getAuth(getApp());
  const currentUser = auth.currentUser;
  const [isSaved, setIsSaved] = useState(false);
  const hasIncremented = useRef(false);

  const mediaLength = listing?.media?.length || 0;

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

  const renderMedia = (url: string, index: number) => {
    const isVideo = /\.(mp4|mov|webm)$/i.test(url);
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !lidFromURL) {
      alert("You need to be logged in to save listings.");
      return;
    }
    try {
      const idToken = await currentUser.getIdToken();
      if (isSaved) {
        await unsaveListing(Number(lidFromURL), idToken);
        setIsSaved(false);
        setSaveCount((c) => Math.max(c - 1, 0));
      } else {
        await saveListing(Number(lidFromURL), idToken);
        setIsSaved(true);
        setSaveCount((c) => c + 1);
      }
    } catch (err) {
      console.error("Error saving listing:", err);
    }
  };

  useEffect(() => {
    const fetchListingData = async () => {
      if (!lidFromURL) return;
      setLoading(true);
      try {
         // increment views only once
         if (!hasIncremented.current) {
          hasIncremented.current = true;
          try {
            const { views } = await incrementListingView(Number(lidFromURL));
            setListing((prev) => (prev ? { ...prev, views } : prev));
          } catch (incErr) {
            console.error("Could not increment view count:", incErr);
          }
        }
        const data = await getListing(Number(lidFromURL));
        if (!data) {
          setError("Listing not found");
        } else {
          setListing(data);
          setSaveCount(data.saved_by.length);
          if (currentUser && data.saved_by.includes(currentUser.uid)) {
            setIsSaved(true);
          }
         
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchListingData();
  }, [lidFromURL, currentUser]);

  if (loading) return <div className="p-4 text-xl">Loading...</div>;
  if (error) return <div className="p-4 text-red-500 text-xl">{error}</div>;
  if (!listing) return <div className="p-4 text-xl">No listing found.</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto text-gray-800">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Media Section */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <div className="relative aspect-square bg-black rounded-xl overflow-hidden">
            {listing.media && listing.media.length > 0 ? (
              <>
                {renderMedia(listing.media[mediaIndex], mediaIndex)}
                {listing.media.length > 1 && (
                  <>
                    <button
                      onClick={handlePrev}
                      className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white px-3 py-1 rounded-r"
                    >
                      <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
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
              <div className="h-full w-full flex items-center justify-center text-gray-400">
                No media
              </div>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="w-full lg:w-1/2 flex">
          <div className="bg-gray-700 text-white rounded-xl p-6 shadow-sm w-full flex flex-col justify-between">
            {/* Save Button */}
            <button
              onClick={handleSave}
              className="top-4 right-4 bg-white text-gray-800 px-3 py-1 rounded-md hover:bg-gray-100 transition z-10"
              title={isSaved ? "Unsave Listing" : "Save Listing"}
            >
              {isSaved ? "★ Saved" : "☆ Save"}
            </button>
            <p className="text-sm text-gray-300 mt-1">
              {saveCount} save{saveCount !== 1 ? "s" : ""}
            </p>

            {/* Title */}
            <h1 className="text-3xl font-bold mb-3">{listing.title}</h1>

            {/* Price */}
            <div className="text-2xl font-semibold text-green-300 mb-4">
              ${listing.price}
              {listing.original_price && listing.original_price !== listing.price && (
                <span className="ml-2 line-through text-gray-400 text-lg">
                  ${listing.original_price}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-lg text-gray-200 mb-4 whitespace-pre-wrap">
              {listing.description}
            </p>

            {/* Details */}
            <div className="text-sm text-gray-300 mb-6">
              <p>
                <strong>Date Listed:</strong>{" "}
                {new Date(listing.dateListed).toLocaleDateString()}
              </p>
              <p>
                <strong>Category:</strong> {listing.category}
              </p>
              <p>
                <strong>Location:</strong> {listing.location}
              </p>
              <p>
                <strong>Status:</strong> {listing.sold ? "Sold" : "Available"}
              </p>
              <p>
                <strong>Views:</strong> {listing.views}
              </p>
              {listing.hidden && (
                <p className="text-red-400 font-medium">
                  <strong>Note:</strong> Hidden
                </p>
              )}
            </div>

            {/* Seller Info */}
            <div className="mt-8 pt-5 border-t border-gray-500">
              <h2 className="text-sm font-semibold mb-3 text-gray-300 tracking-wide uppercase">
                Seller Information
              </h2>
              <Link
                to={`/u/${listing.uid}`}
                className="flex items-center gap-3 text-sm text-gray-200 hover:text-white transition"
              >
                <div className="w-10 h-10 rounded-full bg-white shadow overflow-hidden flex items-center justify-center">
                  {listing.profilePicture ? (
                    <img
                      src={`${listing.profilePicture}?t=${Date.now()}`}
                      alt="User Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-500 text-white text-xl font-bold flex items-center justify-center">
                      {listing.displayName?.charAt(0).toUpperCase() || "?"}
                    </div>
                  )}
                </div>
                <span className="text-lg font-semibold text-gray-100">
                  {listing.displayName || "Unknown Seller"}
                </span>
              </Link>
              <button
                onClick={() => handleCreateChat(listing.id, navigate)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
              >
                Message Seller
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingPage;
