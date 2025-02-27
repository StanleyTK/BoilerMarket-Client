import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut, type User } from "firebase/auth";
import { getApp } from "firebase/app";
import { useParams, useNavigate, useLocation } from "react-router";
import { updateListing } from "~/service/listing-service";
import { fetchListingByUser } from "~/service/fetch-listings";
import { useTheme } from "~/components/ThemeContext";
import type { UserProfileData } from "~/service/types";
import { getUser } from "~/service/user-service";
import firebase from "firebase/compat/app";

interface Listing {
    id: number;
    title: string;
    description: string;
    price: string;
    image?: string;
    displayName?: string;   
    uid: string;
  }

const Edit_Listing: React.FC = () => {
  const auth = getAuth(getApp());
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const listingId = useParams<{ id: string }>();
  const destructuredId = Object.values(listingId)[0]
  const { theme } = useTheme();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [userListings, setUserListings] = useState<Listing[]>([]);

  const navigate = useNavigate();

  const [user, setUser] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setFirebaseUser(user);
      }
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
        getUser(firebaseUser.uid).then((data) => {
          if (!data) {
            setError("User not found");
          } else {
            setUser(data);
          }
        });
      } catch (err) {
        setError((err as Error).message);
      } finally { 
        setLoading(false);
      }
    };
    fetchUserData();
    
    const verifyCurrentUserOwnsListing = async () => {
      setLoading(true);
        try {
          const idToken = await firebaseUser.getIdToken();

          const data = await fetchListingByUser(String(firebaseUser.uid) , idToken );
          setUserListings(data);

          const filteredListings = data.find((listing: { id: number; }) => listing.id === Number(destructuredId));

          if (!filteredListings || filteredListings.length === 0) {
              setError("Invalid listing to be edited")
              return; 
          }

          setTitle(filteredListings.title)
          setDescription(filteredListings.description)
          setPrice(filteredListings.price as unknown as number)

        } catch (error) {
          setError((error as Error).message);
        } finally {
          setLoading(false);
        }
      };
      verifyCurrentUserOwnsListing();
  }, [firebaseUser, listingId]);

  const handleSave = async () => {
    if (!firebaseUser) {
      setLoading(true);
      return;
    }
    try {
      const idToken = await firebaseUser.getIdToken();

      if (price)

      await updateListing(idToken, Number(destructuredId), {title, description, price});
      navigate(`/u/${firebaseUser.uid}`); // Navigate back to the profile page after saving
    } catch (error) {
      setError("Error saving listing")
      console.error(error);
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
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
      } p-6 flex flex-col items-center`}
    >
      <div
        className={`w-full max-w-2xl ${
          theme === "dark" ? "bg-gray-700" : "bg-gray-300"
        } shadow-lg rounded-xl p-8`}
      >
        <h1 className="text-2xl font-bold mb-6">Edit Listing</h1>
        <div className="space-y-4">
          <div>
            <label
              className={`block ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              } font-semibold mb-1`}
            >
              Listing Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                theme === "dark" ? "bg-gray-600 text-white" : "bg-gray-200 text-black"
              }`}
            />
          </div>

          <div>
            <label
              className={`block ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              } font-semibold mb-1`}
            >
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                theme === "dark" ? "bg-gray-600 text-white" : "bg-gray-200 text-black"
              }`}
            />
          </div>

          <div>
          <label
            className={`block ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            } font-semibold mb-1`}
          >
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
            className={`w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              theme === "dark" ? "bg-gray-600 text-white" : "bg-gray-200 text-black"
            }`}
          />
        </div>
        </div>

        {/* Save / Cancel Buttons */}
        <div className="mt-6 flex space-x-4">
          <button
            onClick={handleSave}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
          >
            Save Changes
          </button>
          <button
            onClick={() => navigate(`/u/${firebaseUser?.uid}`)}
            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Edit_Listing;