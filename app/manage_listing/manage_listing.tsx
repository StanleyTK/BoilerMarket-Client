import React, { useEffect, useState, useCallback } from "react";
import { getAuth, onAuthStateChanged, type User, signOut } from "firebase/auth";
import { getApp } from "firebase/app";
import { useParams, useNavigate, useLocation } from "react-router";
import { deleteListing, updateListing } from "~/service/listing-service";
import { fetchListingByUser } from "~/service/fetch-listings";
import { useTheme } from "~/components/ThemeContext";
import type { UserProfileData } from "~/service/types";
import { getUser } from "~/service/user-service";
import { ListingCard } from "~/components/ListingCard";
import { WarningModal, ConfirmationModal } from "~/components/CustomModals";

interface Listing {
  id: number;
  title: string;
  description: string;
  price: string;
  image?: string;
  displayName?: string;   
  uid: string;
}

const Manage_Listing: React.FC = () => {
  const auth = getAuth(getApp());
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const { uid: uidFromURL } = useParams<{ uid: string }>();
  const { theme } = useTheme();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [userListings, setUserListings] = useState<Listing[]>([]);
  
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserListings = useCallback(async () => {
    if (!firebaseUser) return;
    setLoading(true);
    try {
      const idToken = await firebaseUser.getIdToken();
      const data = await fetchListingByUser(String(firebaseUser.uid), idToken);
      setUserListings(data);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  }, [firebaseUser]);


  useEffect(() => {
    if (location.state && (location.state as any).selectedListing) {
      const listing = (location.state as any).selectedListing;
      setSelectedListing(listing);
      setTitle(listing.title);
      setDescription(listing.description);
      setPrice(parseFloat(listing.price));
    }
  }, [location]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setFirebaseUser(user);
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (!firebaseUser) {
      setLoading(true);
      return;
    }
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const data = await getUser(firebaseUser.uid);
        if (!data) {
          setError("User not found");
        } else {
          setUser(data);
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
    fetchUserListings();
  }, [firebaseUser, uidFromURL, fetchUserListings]);

  const handleSelectListing = (listing: Listing) => {
    setSelectedListing(listing);
    setTitle(listing.title);
    setDescription(listing.description);
    setPrice(parseFloat(listing.price));
  };

  const handleSave = async () => {
    if (!firebaseUser) {
      setLoading(true);
      return;
    }
    if (!selectedListing) {
      setShowWarningModal(true);
      return;
    }
    try {
      const idToken = await firebaseUser.getIdToken();
      await updateListing(idToken, selectedListing.id, { title, description, price });
      await fetchUserListings();
      setSelectedListing({
        ...selectedListing,
        title,
        description,
        price: price.toString(),
      });
    } catch (error) {
      setError("Error saving listing");
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!firebaseUser) {
      setLoading(true);
      return;
    }
    if (!selectedListing) {
      setShowWarningModal(true);
      return;
    }
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!firebaseUser || !selectedListing) return;
    try {
      const idToken = await firebaseUser.getIdToken()
      await deleteListing(idToken, selectedListing.id);
      await fetchUserListings();
      setSelectedListing(null);
      setTitle("");
      setDescription("");
      setPrice(0);
      setShowDeleteModal(false);
    } catch (err) {
      setError("An error occurred while deleting your listing.");
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-black"}`}>
        <p>Loading page...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-black"}`}>
        <p className="text-red-400 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-black"} p-6 flex flex-col items-center`}>
      <div className={`w-full max-w-2xl ${theme === "dark" ? "bg-gray-700" : "bg-gray-300"} shadow-lg rounded-xl p-8`}>
        <h1 className="text-2xl font-bold mb-6">
          {selectedListing ? `Edit Listing: ${selectedListing.id}` : "Edit Listing"}
        </h1>
        <div className="space-y-4">
          <div>
            <label className={`block ${theme === "dark" ? "text-gray-300" : "text-gray-700"} font-semibold mb-1`}>
              Listing Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === "dark" ? "bg-gray-600 text-white" : "bg-gray-200 text-black"}`}
            />
          </div>

          <div>
            <label className={`block ${theme === "dark" ? "text-gray-300" : "text-gray-700"} font-semibold mb-1`}>
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === "dark" ? "bg-gray-600 text-white" : "bg-gray-200 text-black"}`}
            />
          </div>

          <div>
            <label className={`block ${theme === "dark" ? "text-gray-300" : "text-gray-700"} font-semibold mb-1`}>
              Price
            </label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              onBlur={(e) => {
                const value = parseFloat(e.target.value);
                if (!isNaN(value)) {
                  setPrice(parseFloat(value.toFixed(2)));
                }
              }}
              className={`w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === "dark" ? "bg-gray-600 text-white" : "bg-gray-200 text-black"}`}
            />
          </div>
        </div>

        <div className="mt-6 flex space-x-4">
          <button
            onClick={handleSave}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
          >
            Save Changes
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
          >
            Delete Listing
          </button>
          <button
            onClick={() => {
              setSelectedListing(null);
              setTitle("");
              setDescription("");
              setPrice(0);
            }}
            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
          >
            Cancel
          </button>
        </div>
      </div>

      <div className="user-listing-container">
        {userListings.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-6">
            {userListings.map((listing, index) => (
              <div key={index} onClick={() => handleSelectListing(listing)} className="cursor-pointer">
                <ListingCard listing={listing} userOwnsListing={firebaseUser?.uid === uidFromURL} />
              </div>
            ))}
          </div>
        ) : (
          <p>No listings found.</p>
        )}
      </div>
      {showWarningModal && (
        <WarningModal
          message="Please select a listing first before making changes."
          onClose={() => setShowWarningModal(false)}
        />
      )}
      {showDeleteModal && (
        <ConfirmationModal
          message="Are you sure you want to delete this listing? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default Manage_Listing;
